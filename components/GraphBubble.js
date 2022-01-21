import React, {useEffect, useState} from 'react'
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import CustomText from './CustomText'
import {LineChart} from "react-native-chart-kit";
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { recordhistory, getHistory } from '../utils/DAO';
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function GraphBubble({stat, data, historyCallback}) {
  const [displayDT, setDisplayDT] = useState(data.labels[data.labels.length - 1])
  const [displayVal, setDisplayVal] = useState(data.datasets[0].data[data.labels.length - 1])
  const [highlightedPoint, setHighlightedPoint] = useState(data.labels.length - 1)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setDisplayDT(data.labels[data.labels.length - 1])
    setDisplayVal(data.datasets[0].data[data.labels.length - 1])
    setHighlightedPoint(data.labels.length - 1)
  }, [data])

  const chartConfig = {
    backgroundGradientFrom: "#fcca47",
    backgroundGradientTo: "#fcca47",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.graph}>
        <View style={styles.graphHeader}>
          <CustomText style={styles.titleText}>{stat}</CustomText>
          <TouchableHighlight
          style={styles.graphButtonWrapper}
          activeOpacity={0.8}
          underlayColor='#a67800'
          disabled={loading}
          onPress={() => {
            setLoading(true)
            recordhistory(setLoading)
            getHistory(historyCallback)
          }}
          >
            <View style={styles.graphButton}>
              {
                <CustomText style={styles.graphButtonText}>
                  Add a history
                </CustomText>
              }
              <Icon name='add' size={20} color='#000'/>
            </View>
          </TouchableHighlight>
        </View>
        <LineChart
            data={data}
            width={Dimensions.get("window").width * 0.9}
            height={Dimensions.get("window").height * 0.27}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
              alignSelf: 'center',
            }}
            withInnerLines={false}
            withOuterLines={false}
            formatXLabel={(xLabel) => {
              return ''
            }}
            onDataPointClick={(dataPoint) => {
              setDisplayDT(data.labels[dataPoint.index])
              setDisplayVal(data.datasets[0].data[dataPoint.index])
              setHighlightedPoint(dataPoint.index)
            }}
            getDotColor={(dataPoint, dataPointIndex) => {
              if (dataPointIndex === highlightedPoint) {
              return '#fff';
              }
              return '#000';
            }}
            getDotProps={(dataPoint, dataPointIndex) => {
              if (dataPointIndex === highlightedPoint) {
              return {
                r: "10",
                strokeWidth: "2",
                stroke: "#000",
              }
              }
              return {
                r: "6",
              };
            }
            }
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.valText}>{displayVal}</CustomText>
          <CustomText style={styles.dateText}>{toPrettyDate(displayDT)}</CustomText>
        </View>
        
      </View>
    </View>
  )
}

const toPrettyDate = (time) => {
  const date = new Date(time)
  return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' +  String(date.getMinutes()).padStart(2, '0');
  
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flex: 1,
  },
  graph: {
    flex: 1,
    marginBottom: 56,
    backgroundColor: '#fcca47',
    padding: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 9,
    borderColor: '#E2B53F',
  },
  titleText: {
    alignSelf: 'flex-start',
    fontSize: 20,
    paddingHorizontal: 15,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    right: 1
  },
  textContainer: {
    bottom: 8,
    alignItems: 'center',
  },
  valText: {
    fontSize: 30,
  },
  dateText : {
    fontSize: 15,
  },
  graphButtonWrapper: {
    justifyContent: 'space-around',
    backgroundColor: '#fcca47',
    borderRadius: 5,
    padding: 2,
  },
  graphButton: {
    flexDirection: "row",
    alignItems: 'center',
    borderTopRightRadius: 5,
    paddingHorizontal: 10,
    
  },
  graphButtonText: {
    fontSize: 15,
    color: '#000'
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#E2B53F',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    paddingBottom: 5
  }
  
})