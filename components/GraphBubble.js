import React, {useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import CustomText from './CustomText'
import { getHistory } from '../utils/DAO';
import { LineChart } from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';
import IconButton from './IconButton';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const { width, height } = Dimensions.get('window');


function invokeHaptic() {
  haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
}

export default function GraphBubble({graphIndex}) {
  const [data, setData] = useState(null);
  const fields = ['Total Value', 'Items', 'Collections',  'Total Quantity'];
  const [history, setHistory] = useState(null);
  const [itemCountHistory, setItemCountHistory] = useState(null);
  const [collectionCountHistory, setCollectionCountHistory] = useState(null);
  const [itemQuantityHistory, setItemQuantityHistory] = useState(null);
  const [totalValueHistory, setTotalValueHistory] = useState(null);
  const histories = [totalValueHistory, itemCountHistory, collectionCountHistory, itemQuantityHistory]
  const integerDisplay = [false, true, true, true]
  
  const loadHistory = () => {
    getHistory(setHistory)
  }

  useEffect(() => {
    loadHistory()
  }, []);
  
  useEffect(() => {
    if(history) {
      setItemCountHistory(history.map((e) => ({timestamp: e.time, value: e.item_count})))
      setCollectionCountHistory(history.map((e) => ({timestamp: e.time, value: e.collection_count})))
      setItemQuantityHistory(history.map((e) => ({timestamp: e.time, value: e.item_quantity})))
      setTotalValueHistory(history.map((e) => ({timestamp: e.time, value: e.total_value})))
    }   
  }, [history])

  useEffect(() => {
    if(totalValueHistory && itemCountHistory && collectionCountHistory && itemQuantityHistory)
    {
      setData(histories[graphIndex])
    }
  }, [graphIndex])

  useEffect(() => {
    if(totalValueHistory) {
      setData(histories[graphIndex])
    }
  }, [totalValueHistory]);
  

  return (
    <View style={styles.container}>
      
        {
          data &&
          <LineChart.Provider data={data} >
            <View style={styles.graph}>
            <View style={styles.header}>
              <View>
                <LineChart.PriceText style={styles.valText}
                  format={({ value }) => {
                    'worklet';
                    let formattedPrice = (value);
                    if(formattedPrice === '') {
                      formattedPrice = (Math.round(data.slice(-1)[0].value * 100) / 100).toFixed(2); 
                    }
                    if(integerDisplay[graphIndex]) {
                      const removeString = '.00'
                      if(formattedPrice.endsWith(removeString)) {
                        formattedPrice = formattedPrice.substring(0, formattedPrice.length - removeString.length )
                      }
                    }
                    return `${formattedPrice}`;
                  }}
                />
                <LineChart.DatetimeText style={styles.dateText}
                  format={({ value }) => {
                    'worklet';
                    let formattedDate = (value);
                    if(formattedDate === -1) {
                      formattedDate = data.slice(-1)[0].timestamp
                    }
                    formattedDate = new Date(formattedDate)
                    return `${formattedDate.getDate() + ' ' + monthNames[formattedDate.getMonth()] + ' ' + formattedDate.getFullYear() + ' ' + formattedDate.getHours() + ':' +  String(formattedDate.getMinutes()).padStart(2, '0')}`;
                  }}
                />
                <CustomText style={styles.statText}>{fields[graphIndex]}</CustomText>
                
              </View>
              
            </View>
            {
              data.length > 1 ? 
              <LineChart width={width * 0.85} height={width * 0.5}>
                <LineChart.Path color="#000"/>
                <LineChart.CursorCrosshair onActivated={invokeHaptic} onEnded={invokeHaptic} color="#fcca47"/>
              </LineChart> 
              :
              <View style={styles.callToActionWrapper}>
                <CustomText style={styles.callToActionEmoji}>📈</CustomText>
                <CustomText style={styles.callToAction}>This will update as you go!</CustomText>
              </View>
            }
            
            <View style={styles.refreshButtonContainer}>
              
                <IconButton 
                style={styles.refreshButton}
                activeOpacity={0.8} 
                underlayColor="#e0e0e0"

                iconName='refresh'
                size={45}
                color="#000"
                />
              
            </View>
          </View>
          </LineChart.Provider>
        }
  
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    flex: 1,
    backgroundColor: '#fff',
  },
  graph: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap'
  },
  valText:{
    fontSize: 30,
    fontWeight: 'bold'
  },
  statText: {
    fontSize: 15,
    opacity: 0.5
  },
  dateText:{
    fontSize: 15,
    opacity: 0.5,
  },
  refreshButtonContainer: {
    position: 'absolute',
    top: width * 0.01,
    right: 0,
  },
  refreshButton: {
    padding: 3,
    borderRadius: 100,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  callToActionWrapper: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callToAction : {
    fontSize: 20,
    marginRight: 5, 
    marginLeft:5,
    textAlign: "center"
  },
  callToActionEmoji : {
    fontSize: 50,
  },
})