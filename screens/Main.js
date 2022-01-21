import React, { useRef, useState, useMemo, useEffect } from "react";
import { View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native'
import SummaryStatistic from '../components/SummaryStatistic';
import CustomText from "../components/CustomText";
import globalStyles from "../styles/globalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons'
import CollectionBubble from "../components/CollectionBubble";
import BagModel from "../components/BagModel";
import IconButton from "../components/IconButton";
import Animated, { useAnimatedStyle, interpolate, useSharedValue, withTiming, withDelay, Extrapolate } from "react-native-reanimated";
import BottomSheet, {useBottomSheet } from '@gorhom/bottom-sheet';
import GraphBubble from "../components/GraphBubble";
import Carousel from 'react-native-reanimated-carousel';
import { getAllCollections, getItemsCount, getCollectionsCount, getItemsQuantitySum, getItemsTotalSum, getHistory } from "../utils/DAO";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
// import SortBy from "../components/SortBy";
import {abbreviate} from './../utils/utils'

const { width, height } = Dimensions.get('window');
const reservedCollection = 'Items Without Collections'

const fallbackGraphData = 
{
  labels: ["Error"],
  datasets: [
    {
      data: [
        Math.random() * 100,

      ]
    }
  ]
}


export default function Main({navigation}) {
  // data from navigation
  const isFocused = useIsFocused();

  const carouselRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '70%'], []);
  const [collections, setCollections] = useState([]);

  // statistics
  const [itemCount, setItemCount] = useState(null);
  const [collectionCount, setCollectionCount] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(null);
  const [totalValue, setTotalValue] = useState(null);
  const [history, setHistory] = useState(null);
  const [itemCountHistory, setItemCountHistory] = useState(fallbackGraphData);
  const [collectionCountHistory, setCollectionCountHistory] = useState(fallbackGraphData);
  const [itemQuantityHistory, setItemQuantityHistory] = useState(fallbackGraphData);
  const [totalValueHistory, setTotalValueHistory] = useState(fallbackGraphData);
  const fields = ['Total Value', 'Items', 'Collections',  'Total Quantity'];
  const values = [abbreviate(totalValue, 2, 2), abbreviate(itemCount), abbreviate(collectionCount), abbreviate(itemQuantity)];
  const histories = [totalValueHistory, itemCountHistory, collectionCountHistory,
    itemQuantityHistory];

  useEffect(() => {
    if(history) {
      const timeLabels = history.map(e => e.time) ? history.map(e => e.time):[0];
      setItemCountHistory({
        labels: timeLabels,
        datasets: [
          {
            data: history.map(e => e.item_count) ? history.map(e => e.item_count):[0]
          }
        ]
      })
      setCollectionCountHistory({
        labels: timeLabels,
        datasets: [
          {
            data: history.map(e => e.collection_count) ? history.map(e => e.collection_count):[0]
          }
        ]
      })
      setItemQuantityHistory({
        labels: timeLabels,
        datasets: [
          {
            data: history.map(e => e.item_quantity) ? history.map(e => e.item_quantity):[0]
          }
        ]
      })
      setTotalValueHistory({
        labels: timeLabels,
        datasets: [
          {
            data: history.map(e => e.total_value) ? history.map(e => e.total_value):[0]
          }
        ]
      })
    }   
  }, [history])

  useEffect(() => {
    if(isFocused){
      getAllCollections(setCollections)
      getItemsCount(setItemCount)
      getCollectionsCount(setCollectionCount)
      getItemsQuantitySum(setItemQuantity)
      getItemsTotalSum(setTotalValue)
      getHistory(setHistory)
    }
  }, [isFocused])


  const bottomSheetDataSHARED = useSharedValue(0)
  const scaleIn = useSharedValue(0)

  useEffect(() => {
    scaleIn.value = withDelay(1000, withTiming(1, {duration: 500}))
  }, [])

  const animBag = useAnimatedStyle(()=> {
    return {
      transform: [{scale: bottomSheetDataSHARED.value}],
      opacity: bottomSheetDataSHARED.value
    }
  })

  const animStats = useAnimatedStyle(()=> {
    return {
      transform: [{translateY: interpolate(bottomSheetDataSHARED.value, [0,1], [0, height], Extrapolate.CLAMP)}],
    }
  })

  const BottomSheetContent = () => {
    const bottomSheetData = useBottomSheet()

    const animBottomSheet = useAnimatedStyle(()=> {
      // using this hook to also update the shared value outside
      bottomSheetDataSHARED.value = bottomSheetData.animatedIndex.value
      return {
      }
    })

    return (
      <View style={styles.container}>
          <View style={styles.bottomSheetTitle}>
            <CustomText style={globalStyles.headingText}>Collections</CustomText>
            <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>{collections.length}</CustomText>
            <IconButton
              style={[styles.iconButton, styles.plus]}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={()=>navigation.navigate('Collection')}
              iconName="add"
              size={43}
            />  
          </View>
          <View
            style={styles.container}
          >
            {/* <SortBy style={{right: 30}}/> */}
            <ScrollView style={styles.container} contentContainerStyle={collections.length === 0 && {justifyContent: 'center', flex: 1, }}
            >
              {
                collections.length === 0 ?
                <View style={styles.callToActionWrapper}>
                  <CustomText style={styles.callToActionEmoji}>☝🏼</CustomText>
                  <CustomText style={styles.callToAction}>It's a little lonely here... {'\n'} add a collection!</CustomText>
                  <TouchableHighlight
              style={styles.reservedBubble}
              activeOpacity={0.9}
              underlayColor="#f2f2f2"
              onPress={()=>navigation.navigate('Collection', {collection: reservedCollection})}>
                <CustomText style={styles.reservedText}>Items without collections 🗑️</CustomText>
              </TouchableHighlight>
                </View>
                :
                <View style={styles.collections}>
                  {
                    collections.map((item, index) => (
                      <View style={[styles.container, {flexBasis: width * 0.4}]} key={item.name}>
                        <CollectionBubble navigation={navigation} name={item.name}  />
                      </View>
                    ))
                  }
                  <TouchableHighlight
                  style={styles.reservedBubble}
                  activeOpacity={0.9}
                  underlayColor="#f2f2f2"
                  onPress={()=>navigation.navigate('Collection', {collection: reservedCollection})}>
                    <CustomText style={styles.reservedText}>Items without collections 🗑️</CustomText>
                  </TouchableHighlight>
                  
                </View>
              }
              
              
            </ScrollView>
            {/* Reserved collection */}
            
          </View>
      </View >
    )
  }

  return (
    <View style={[styles.container, {backgroundColor: '#ffffff'}]}>
      <View style={styles.header}>
        <CustomText style={styles.headerText}>Inventorio</CustomText>
        <TouchableHighlight style={styles.settings}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={()=>navigation.navigate('Settings')}
          iconName="settings"
        >
              <Icon name="settings" size={25} />
        </TouchableHighlight>
      </View>

      

      <Animated.View style={[styles.summaryStatisticsWrapper, animStats]}>
        <CustomText style={[globalStyles.headingText, styles.ml]}>Analytics</CustomText>
        <View style={styles.summaryStaticsGroup}>
          {
            carouselRef &&
            fields.map((field, index) => (
              <View key={field} style={styles.summaryStatisticItem}>
                <SummaryStatistic
                title={field}
                value={values[index]}
                onPress={carouselRef.current?.goToIndex}
                index={index}
                />
              </View>
            )) 
          }
        </View>
        <Carousel
          ref={carouselRef}
          style={{height: 350}}
          width={390}
          data={[{ stat: 'Total Value', history: histories[0] },
          { stat: 'Items', history: histories[1] }, { stat: 'Collections', history: histories[2] }, 
          { stat: 'Total Quantity', history: histories[3] }
          ]}
            renderItem={({ item }) => {
              return <GraphBubble stat={item.stat} data={item.history} historyCallback={setHistory}/>;
            }}
        />

      </Animated.View>
      {/* <Animated.View style={[styles.container, animBag]}>
        <BagModel/>
      </Animated.View> */}
      <View style={styles.bottomSheet}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          containerStyle={styles.container}
          overDragResistanceFactor={1}
          backgroundStyle={{backgroundColor: '#fcca47', borderTopRightRadius: 30, borderTopLeftRadius: 30}}
          handleStyle={{borderTopRightRadius: 30, borderTopLeftRadius: 30, height: 30}}
          handleIndicatorStyle={{width: '10%', height: 8}}
          animateOnMount={false}
        >
          <BottomSheetContent/>
        </BottomSheet>
      </View>
    </View>  
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  iconButton: {
    borderRadius: 100,
    padding: 5,
  },
  settings: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderWidth: 0.5,
  },
  plus: {
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 4,
  },
  bottomSheetTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 30,
  },
  bottomSheet: {
    flex: 1
  },
  summaryStatisticsWrapper: {
    position: 'absolute',
    left: 0, 
    right: 0, 
    bottom: 30,
    height: height * 0.83,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 16,
    backgroundColor: '#fff'
  },
  summaryStaticsGroup: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
    height: '37%'
  },
  summaryStatisticItem: {
    flexBasis: '43%',
    margin: 10,
  },
  collections: {
    flex: 1,
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingBottom: 50,
  },
  callToActionWrapper: {
    flex: 1,
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
    marginLeft: '5%',
    marginBottom: '5%',
    transform: [{ rotate: '45deg'}, { scaleX: -1 }]
  },
  ml: {
    marginLeft: 20
  },
  graphs: {
    alignItems: 'center',
    marginTop: 60
  },
  totalValueLabel: {
    fontSize: 25,
  },
  totalValueText: {
    fontSize: 55,
  },
  otherStatsGroup: {
    marginTop: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otherStatsLabel: {
    fontSize: 15,
  },
  otherStatsText: {
    fontSize: 32,
  },
  reservedBubble: {
    backgroundColor: '#e0e0e0',
    borderRadius: 30,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 4,
    padding: 10,
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  reservedText: {
    fontSize: 20
  },
  bottomSheet: {
    flex: 1,
    elevation: 50,
  },
  header: {
    flexDirection: 'row',
    height: '11%',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20
  },
  headerText: {
    fontSize: 40
  }
})
