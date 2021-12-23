import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('db.inventory')

// 
const dbTransaction = (sql) => {
  db.transaction(tx => {
    tx.executeSql(
      sql, null,
      (txObj, resultSet) => (console.log('')),
      (txObj, error) => console.log('Error', error))
    });
}

// Run when app opens for first time
export const createTables = () => {
  dbTransaction(
    `
      CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, 
      photo TEXT,
      receipt TEXT,
      price REAL,
      quantity INTEGER,
      total REAL,
      notes TEXT
      );
      `
  )
  dbTransaction(
    `
      CREATE TABLE IF NOT EXISTS collections (
      name TEXT PRIMARY KEY
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
}

// Run when app needs to be updated
export const dropTables = () => {
  dbTransaction(`DROP TABLE items;`)
  dbTransaction(`DROP TABLE collections;`)
  dbTransaction(`DROP TABLE items_collections;`)
  dbTransaction(`DROP TABLE history;`)
}

// CRUD Items
export const createItem = (name, photo, receipt, price, quantity, total, notes, assocCollections) => {
  var assocCollections = assocCollections
  db.transaction((tx) => {
    tx.executeSql(
    `INSERT INTO items (name, photo, receipt, price, quantity, total, notes) 
      values (?, ?, ?, ?, ?, ?, ?)`, 
      [name, photo, receipt, price, quantity, total, notes],
      (txObj, resultSet) => {
        console.log(`inserted ${JSON.stringify(resultSet)}`)
        assocCollections.forEach(collection => {
          associate(resultSet.insertId, collection)
        });
      },
      (txObj, error) => console.log('Error', error))
  });
}

export const getFromItems = (collection, callback) => {
  let sql = 'SELECT * FROM items';
  if(collection) {
    sql = `SELECT * FROM items WHERE id IN (
      SELECT item_id FROM items_collections WHERE collection_name = '${collection}')
    `
  }

  db.transaction(tx => {
    tx.executeSql(sql, null, 
    (txObj, resultSet) => (callback(resultSet.rows._array)),
    (txObj, error) => console.log('Error ', error)
    ) 
  }) 
}

export const getItem = (id, callback) => {
  let sql = 'SELECT * FROM items WHERE id = ?';
  db.transaction(tx => {
    tx.executeSql(sql, [id], 
    (txObj, resultSet) => (callback(resultSet.rows._array[0])),
    (txObj, error) => console.log('Error ', error)
    ) 
  }) 
}

export const updateItem = (name, photo, receipt, price, quantity, total, notes, id, assocCollections, dissocCollections) => {  
  var assocCollections = assocCollections 
  var dissocCollections = dissocCollections
  db.transaction(tx => {
    tx.executeSql(
    `UPDATE items 
      SET name = ?, photo = ?, receipt = ?, price = ?, quantity = ?, total = ?, notes = ?
      WHERE id = ?`, 
      [name, photo, receipt, price, quantity, total, notes, id],
      (txObj, resultSet) => {
        console.log(`updated ${JSON.stringify(resultSet)}`)
        assocCollections.forEach(collection => {
          associate(id, collection)
        });
        dissocCollections.forEach(collection => {
          dissociate(id, collection)
        });
      },
      (txObj, error) => console.log('Error', error))
  });
}

export const deleteItem = (id) => {
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
}

// CRUD Collections
export const getAllCollections = (callback) => {
  let sql = 'SELECT * FROM collections';
  db.transaction(tx => {
    tx.executeSql(sql, null, 
      (txObj, resultSet) => (callback(resultSet.rows._array)),
      (txObj, error) => console.log('Error ', error)
    ) 
  }
  )
}

export const createCollection = (name) => {
  db.transaction(tx => {
    tx.executeSql(
    `INSERT INTO collections (name) 
      values (?)`, 
      [name],
      (txObj, resultSet) => (console.log(`inserted ${JSON.stringify(resultSet)}`)),
      (txObj, error) => console.log('Error', error))
  })
}

export const updateCollection = (oldName, newName) => {
  db.transaction(tx => {
    tx.executeSql(
    `UPDATE collections 
      SET name = ?
      WHERE name = ?`, 
      [newName, oldName],
      (txObj, resultSet) => (console.log(`updated ${JSON.stringify(resultSet)}`)),
      (txObj, error) => console.log('Error', error))
  });
  handleUpdateCollection(oldName, newName)
}

export const deleteCollection = (name) => {
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
}

// Manage many-to-many table: items_collections

const associate = (item_id, collection_name) => {
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

const dissociate = (item_id, collection_name) => {
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

const handleDeleteItem = (item_id) => {
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

const handleDeleteCollection = (collection_name) => {
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

const handleUpdateCollection = (old_collection_name, new_collection_name) => {
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
export const getItemsWithoutCollection = (callback) => {
  sql = `SELECT * FROM items WHERE id NOT IN (
    SELECT item_id FROM items_collections)
  `

  db.transaction(tx => {
    tx.executeSql(sql, null, 
    (txObj, resultSet) => (callback(resultSet.rows._array)),
    (txObj, error) => console.log('Error ', error)
    ) 
  }) 
}

export const getCollectionStats = () => {

}

export const getItemCollections = (id, callback) => {
  let sql = 'SELECT collection_name FROM items_collections WHERE item_id = ?';
  db.transaction(tx => {
    tx.executeSql(sql, [id], 
      (txObj, resultSet) => (callback(resultSet.rows._array)),
      (txObj, error) => console.log('Error ', error)
    ) 
  }
  )
}
