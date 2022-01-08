import React, {useEffect, useState} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import CustomText from './CustomText'
import {LineChart} from "react-native-chart-kit";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];



export default function GraphBubble({stat, data}) {
  const [displayDT, setDisplayDT] = useState(data.labels[data.labels.length - 1])
  const [highlightedPoint, setHighlightedPoint] = useState(data.labels.length - 1)
  
  useEffect(() => {
    setDisplayDT(data.labels[data.labels.length - 1])
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
      <CustomText style={styles.titleText}>{stat}</CustomText>
      <View style={styles.graph}>
      <LineChart
          data={data}
          width={Dimensions.get("window").width * 0.9}
          height={Dimensions.get("window").height * 0.3}
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
      <CustomText style={styles.dateText}>{toPrettyDate(displayDT)}</CustomText>
      </View>
    </View>
  )
}

const toPrettyDate = (time) => {
  const date = new Date(time)
  return date.getDay() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' +  String(date.getMinutes()).padStart(2, '0');
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  graph: {
    flex: 1,
    backgroundColor: '#fcca47',
    padding: 0,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 9,
    borderColor: '#E2B53F'
  },
  titleText: {
    marginLeft: 5,
    fontSize: 25  
  },
  dateText : {
    fontSize: 20
  }
  
})