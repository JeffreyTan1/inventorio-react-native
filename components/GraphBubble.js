import React, {useEffect} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import CustomText from './CustomText'
import {LineChart} from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#7d7d7d",
  backgroundGradientTo: "#7d7d7d",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
};

export default function GraphBubble({stat, data}) {
  useEffect(() => {
    console.log("data ", data)
  }, [])
  return (
    <View style={styles.container}>
      <CustomText>{stat}</CustomText>
      <View style={styles.graph}>
      <LineChart
          data={data}
          width={Dimensions.get("window").width * 0.9}
          height={Dimensions.get("window").height * 0.4}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            alignSelf: 'center',
        }}
      />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  graph: {
    flex: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 16,
  },
  
})