import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.inventory')

const dbTransaction = (sql) => {
  db.transaction(tx => {
    tx.executeSql(
      sql, null,
      (txObj, resultSet) => {
      },
      (txObj, error) => console.log('Error', error))
    });
}

// Run when app opens for first time
export const createTables = async () => {
  dbTransaction(
    `
      CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, 
      photos TEXT,
      price REAL,
      quantity INTEGER,
      total REAL,
      notes TEXT,
      created INTEGER,
      modified INTEGER
      );
      `
  )
  dbTransaction(
    `
      CREATE TABLE IF NOT EXISTS collections (
      name TEXT PRIMARY KEY,
      photo TEXT,
      created INTEGER,
      modified INTEGER
      );
      `
  )
  dbTransaction(
    `
    CREATE TABLE IF NOT EXISTS items_collections (
    item_id INTEGER, 
    collection_name TEXT
    );
    `
  )
  dbTransaction(
    `
      CREATE TABLE IF NOT EXISTS history ( 
      item_count INTEGER, 
      collection_count INTEGER,
      item_quantity INTEGER,
      total_value REAL,
      time INTEGER
      );
      `
  )

  let historyLen;
  
  db?.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) FROM history', null, 
      (txObj, { rows: { _array } }) => {
        historyLen = (_array[0]['COUNT(*)'])
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });

  if(historyLen === 0) {
    db.transaction(tx => {
      tx.executeSql(`INSERT INTO history (item_count, collection_count, item_quantity, total_value, time) 
      values (?, ?, ?, ?, ?)`, [0, 0, 0, 0, (new Date()).getTime()], 
        (txObj, resultSet) => {
          console.log('History recorded', JSON.stringify(resultSet))
        },
        (txObj, error) => console.log('Error', error)
        ) 
    });
  }
}

// Run when app needs to be updated
export const dropTables = async () => {
  dbTransaction(`DROP TABLE items;`)
  dbTransaction(`DROP TABLE collections;`)
  dbTransaction(`DROP TABLE items_collections;`)
  dbTransaction(`DROP TABLE history;`)
}

// CRUD Items
export const createItem = async (name, photos, price, quantity, total, notes, assocCollections, created, modified, callback) => {
  var assocCollections = assocCollections
  db.transaction((tx) => {
    tx.executeSql(
    `INSERT INTO items (name, photos, price, quantity, total, notes) 
      values (?, ?, ?, ?, ?, ?)`, 
      [name, JSON.stringify(photos), price, quantity, total, notes],
      (txObj, resultSet) => {
        console.log(`inserted ${JSON.stringify(resultSet)}`)
        assocCollections.forEach(collection => {
          associate(resultSet.insertId, collection)
        });
        callback(resultSet.insertId)
      },
      (txObj, error) => console.log('Error', error))
  });
  recordhistory()
}

export const getFromItems = async (collection, callback) => {
  let sql = 'SELECT * FROM items';
  if(collection) {
    sql = `SELECT * FROM items WHERE id IN (
      SELECT item_id FROM items_collections WHERE collection_name = '${collection}')
    `
  }

  db.transaction(tx => {
    tx.executeSql(sql, null, 
    (txObj, resultSet) => (callback(parseJSONToArray(resultSet.rows._array))),
    (txObj, error) => console.log('Error ', error)
    ) 
  }) 
}

export const getItem = async (id, callback) => {
  let sql = 'SELECT * FROM items WHERE id = ?';
  db.transaction(tx => {
    tx.executeSql(sql, [id], 
    (txObj, resultSet) => (callback(parseJSONToArray(resultSet.rows._array)[0])),
    (txObj, error) => console.log('Error ', error)
    ) 
  }) 
}

export const updateItem = async (name, photos, price, quantity, total, notes, id, assocCollections, dissocCollections, created, modified, callback) => {  
  var assocCollections = assocCollections 
  var dissocCollections = dissocCollections
  db.transaction(tx => {
    tx.executeSql(
    `UPDATE items 
      SET name = ?, photos = ?, price = ?, quantity = ?, total = ?, notes = ?
      WHERE id = ?`, 
      [name, JSON.stringify(photos), price, quantity, total, notes, id],
      (txObj, resultSet) => {
        console.log(`updated ${JSON.stringify(resultSet)}`)
        assocCollections.forEach(collection => {
          associate(id, collection)
        });
        dissocCollections.forEach(collection => {
          dissociate(id, collection)
        });
        callback((val) => val + 1)
      },
      (txObj, error) => console.log('Error', error))
  });
  recordhistory()
}

export const deleteItem = async (id) => {
  // ensures mtm table is updated
  handleDeleteItem(id);
  db.transaction(tx => {
    tx.executeSql(
    `DELETE FROM items WHERE id = ?`, [id],
    (txObj, resultSet) => {
      if (resultSet.rowsAffected > 0) {
        (console.log(`deleted ${JSON.stringify(resultSet)}`))
      }
    },
    (txObj, error) => console.log('Error', error))
  });
  recordhistory()
}

// CRUD Collections
export const getAllCollections = async (callback) => {
  let sql = 'SELECT * FROM collections';
  db.transaction(tx => {
    tx.executeSql(sql, null, 
      (txObj, resultSet) => (callback(resultSet.rows._array)),
      (txObj, error) => console.log('Error ', error)
    ) 
  }
  )
}

export const collectionDBSuccess = 'Success'
export const collectionDuplicateError = 'This collection name is already taken!'

export const createCollection = async (name, created, modified, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
    `INSERT INTO collections (name, photo) 
      values (?, ?)`, 
    [name, null],
    (txObj, resultSet) => {
      console.log(`inserted ${JSON.stringify(resultSet)}`)
      errorCallback(collectionDBSuccess)
    },
    (txObj, error) => {
      console.log('Error', error)
      errorCallback(collectionDuplicateError)
    })
  })
  recordhistory()
}

export const updateCollection = async (oldName, newName, modified, errorCallback) => {
  db.transaction(tx => {
    tx.executeSql(
    `UPDATE collections 
      SET name = ?
      WHERE name = ?`, 
      [newName, oldName],
      (txObj, resultSet) => {
        console.log(`updated ${JSON.stringify(resultSet)}`)
        errorCallback(collectionDBSuccess)
      },
      (txObj, error) => {
        console.log('Error', error)
        errorCallback(collectionDuplicateError)
      })
  });
  handleUpdateCollection(oldName, newName)
  recordhistory()
}

export const deleteCollection = async (name) => {
  // ensures mtm table is updated
  handleDeleteCollection(name)
  db.transaction(tx => {
    tx.executeSql(
    `DELETE FROM collections WHERE name = ?`, [name],
    (txObj, resultSet) => {
      if (resultSet.rowsAffected > 0) {
        (console.log(`deleted ${JSON.stringify(resultSet)}`))
      }
    },
    (txObj, error) => console.log('Error', error))
  });
  recordhistory()
}

// Manage many-to-many table: items_collections

const associate = async (item_id, collection_name) => {
  console.log(`Associating item_id:${item_id} collection_name:${collection_name}`)
  db.transaction(tx => {
    tx.executeSql(
    `INSERT INTO items_collections (item_id, collection_name) 
      values (?, ?)`, 
      [item_id, collection_name],
      (txObj, resultSet) => (console.log(`insert ${JSON.stringify(resultSet)}`)),
      (txObj, error) => console.log('Error', error))
  })
}

const dissociate = async (item_id, collection_name) => {
  db.transaction(tx => {
    tx.executeSql(
    `DELETE FROM items_collections WHERE item_id = ? AND collection_name = ?`, 
      [item_id, collection_name],
      (txObj, resultSet) => {
        if (resultSet.rowsAffected > 0) {
          (console.log(`dissociate delete ${JSON.stringify(resultSet)}`))
        }
      },
      (txObj, error) => console.log('Error', error))
  })
}

const handleDeleteItem = async (item_id) => {
  db.transaction(tx => {
    tx.executeSql(
    `DELETE FROM items_collections WHERE item_id = ?`, [item_id],
    (txObj, resultSet) => {
      if (resultSet.rowsAffected > 0) {
        (console.log(`deleted ${JSON.stringify(resultSet)}`))
      }
    },
    (txObj, error) => console.log('Error', error))
  });
}

const handleDeleteCollection = async (collection_name) => {
  db.transaction(tx => {
    tx.executeSql(
    `DELETE FROM items_collections WHERE collection_name = ?`, [collection_name],
    (txObj, resultSet) => {
      if (resultSet.rowsAffected > 0) {
        (console.log(`deleted ${JSON.stringify(resultSet)}`))
      }
    },
    (txObj, error) => console.log('Error', error))
  });
}

const handleUpdateCollection = async (old_collection_name, new_collection_name) => {
  db.transaction(tx => {
    tx.executeSql(
    `UPDATE items_collections 
      SET collection_name = ?
      WHERE collection_name = ?`, 
      [new_collection_name, old_collection_name],
      (txObj, resultSet) => (console.log(`updated ${JSON.stringify(resultSet)}`)),
      (txObj, error) => console.log('Error', error))
  });
}


// Other methods
export const getItemsWithoutCollection = async (callback) => {
  let sql = `SELECT * FROM items WHERE id NOT IN (
    SELECT item_id FROM items_collections)
  `
  db.transaction(tx => {
    tx.executeSql(sql, null, 
    (txObj, resultSet) => {
      callback(parseJSONToArray(resultSet.rows._array))},
    (txObj, error) => console.log('Error ', error)
    ) 
  }) 
}

export const getItemCollections = async (id, callback) => {
  let sql = 'SELECT collection_name FROM items_collections WHERE item_id = ?';
  db.transaction(tx => {
    tx.executeSql(sql, [id], 
      (txObj, resultSet) => (callback(resultSet.rows._array)),
      (txObj, error) => console.log('Error ', error)
    ) 
  }
  )
}

export const getItemsCount = async (callback) => {
  db?.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) FROM items', null, 
      (txObj, { rows: { _array } }) => {
        callback(_array[0]['COUNT(*)'])
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
}

export const getCollectionsCount = async (callback) => {
  db?.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) FROM collections', null, 
      (txObj, { rows: { _array } }) => {
        callback(_array[0]['COUNT(*)'])
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });  
}

export const getItemsQuantitySum = async (callback) => {
  db?.transaction(tx => {
    tx.executeSql('SELECT SUM(quantity) FROM items', null, 
      (txObj, { rows: { _array } }) => {
        callback(_array[0]['SUM(quantity)'] ? _array[0]['SUM(quantity)'] : 0);
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
}

export const getItemsTotalSum = async (callback) => {
  db?.transaction(tx => {
    tx.executeSql('SELECT SUM(total) FROM items', null, 
      (txObj, { rows: { _array } }) => {
        callback(_array[0]['SUM(total)'] ? _array[0]['SUM(total)'] : 0)
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
}


// History related
export const getHistory = async (callback) => {
  // SELECT * FROM history ORDER BY time DESC LIMIT 15 if required
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM history', null, 
      (txObj, { rows: { _array } }) => {
        callback(_array)
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
}

export const recordhistory = async (callback) => {
  let itemCount, collectionCount, itemQuantity, totalValue = null;
  db.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) FROM items', null, 
      (txObj, { rows: { _array } }) => {
        itemCount = (_array[0]['COUNT(*)']) ? (_array[0]['COUNT(*)']) : 0
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
  db.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) FROM collections', null, 
      (txObj, { rows: { _array } }) => {
        collectionCount = (_array[0]['COUNT(*)']) ? (_array[0]['COUNT(*)']) : 0
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
  db.transaction(tx => {
    tx.executeSql('SELECT SUM(quantity) FROM items', null, 
      (txObj, { rows: { _array } }) => {
        itemQuantity = _array[0]['SUM(quantity)'] ? _array[0]['SUM(quantity)'] : 0;
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
  db.transaction(tx => {
    tx.executeSql('SELECT SUM(total) FROM items', null, 
      (txObj, { rows: { _array } }) => {
        totalValue = _array[0]['SUM(total)'] ? _array[0]['SUM(total)'] : 0;
      },
      (txObj, error) => console.log('Error ', error)
      ) 
  });
  db.transaction(tx => {
    tx.executeSql(`INSERT INTO history (item_count, collection_count, item_quantity, total_value, time) 
    values (?, ?, ?, ?, ?)`, [itemCount, collectionCount, itemQuantity, totalValue, (new Date()).getTime()], 
      (txObj, resultSet) => {
        console.log('History recorded', JSON.stringify(resultSet))
      },
      (txObj, error) => console.log('Error', error)
      ) 
  });
  // set loading off on addhistory
  if(callback){
    callback(false)
  }
 
}

export const clearHistory = () => {
  db.transaction(tx => {
    tx.executeSql(
      `DROP TABLE history;`, null,
      (txObj, resultSet) => {
        db.transaction(tx => {
          tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS history ( 
            item_count INTEGER, 
            collection_count INTEGER,
            item_quantity INTEGER,
            total_value REAL,
            time INTEGER
            );
            `, null,
            (txObj, resultSet) => {
              db.transaction(tx => {
                tx.executeSql(
                  `
                  CREATE TABLE IF NOT EXISTS history ( 
                  item_count INTEGER, 
                  collection_count INTEGER,
                  item_quantity INTEGER,
                  total_value REAL,
                  time INTEGER
                  );
                  `, null,
                  (txObj, resultSet) => {
                    db.transaction(tx => {
                      tx.executeSql(`INSERT INTO history (item_count, collection_count, item_quantity, total_value, time) 
                      values (?, ?, ?, ?, ?)`, [0, 0, 0, 0, (new Date()).getTime()], 
                        (txObj, resultSet) => {
                          console.log('History recorded', JSON.stringify(resultSet))
                        },
                        (txObj, error) => console.log('Error', error)
                        ) 
                    });
                  },
                  (txObj, error) => console.log('Error', error))
              });
            },
            (txObj, error) => console.log('Error', error))
        });
      },
      (txObj, error) => console.log('Error', error))
  });

}

// Utils
const parseJSONToArray = (array) => {
  return array.map((item) => ({...item, photos: JSON.parse(item.photos)}))
}