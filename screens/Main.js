import React, { useRef, useState, useMemo, useEffect } from "react";
import { View, StyleSheet, TouchableHighlight  } from 'react-native'
import SummaryStatistic from '../components/SummaryStatistic';
import CustomText from "../components/CustomText";
import globalStyles from "../styles/globalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons'
import CollectionBubble from "../components/CollectionBubble";
import BagModel from "../components/BagModel";
import IconButton from "../components/IconButton";
import Animated, { useAnimatedStyle, interpolate, useSharedValue, withTiming, withDelay } from "react-native-reanimated";
import BottomSheet, {useBottomSheet, useBottomSheetSpringConfigs, useBottomSheetTimingConfigs} from '@gorhom/bottom-sheet';
import GraphBubble from "../components/GraphBubble";
import Carousel from 'react-native-reanimated-carousel';
import { getAllCollections, getItemsCount, getCollectionsCount, getItemsQuantitySum, getItemsTotalSum, getHistory } from "../utils/DAO";
import { useIsFocused } from "@react-navigation/native";
import { NativeViewGestureHandler, ScrollView } from "react-native-gesture-handler";

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
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['12%', '60%'], []);
  const [collections, setCollections] = useState([]);
  const [carouselData, setCarouselData] = useState([]);

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

  const fields = ['Items', 'Collections', 'Quantity', 'Total Value'];
  const values = [itemCount, collectionCount, itemQuantity, totalValue];
  const histories = [itemCountHistory, collectionCountHistory,
    itemQuantityHistory, totalValueHistory];


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

  useEffect(() => {
    setCarouselData(splitInFours())
  }, [collections])

  // takes an array of objects 
  // splits it into an array of size-4 arrays of objects 
  const splitInFours = () => {
    if (!collections) return
    var perChunk = 4 // items per chunk    
    var inputArray = collections
    var result = inputArray.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index/perChunk)
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
    
    result = result.map(x => ({data: x}))
    return result
  }

  const bottomSheetDataSHARED = useSharedValue(0)
  const scaleIn = useSharedValue(0)

  useEffect(() => {
    scaleIn.value = withDelay(1000, withTiming(1, {duration: 500}))
  }, [])
  
  const animScaleIn = useAnimatedStyle(()=> {
    return {
      transform: [{scale: scaleIn.value}]
    }
  })

  const animBag = useAnimatedStyle(()=> {
    return {
      transform: [{translateX: interpolate(bottomSheetDataSHARED.value, [0,1], [-75, 0])}, {translateY: interpolate(bottomSheetDataSHARED.value, [0,1], [-20, 0])}]
    }
  })

  const animStats = useAnimatedStyle(()=> {
    return {
      transform: [{scale: interpolate(bottomSheetDataSHARED.value, [0,1], [0, 1])}],
      opacity: bottomSheetDataSHARED.value,
    }
  })

  const animGraph = useAnimatedStyle(()=> {
    return {
      opacity: (1 - bottomSheetDataSHARED.value),
      transform: [{scale: interpolate(bottomSheetDataSHARED.value, [0,1], [1, 0])}],
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

    const _renderItem = (item, index) => {
      return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center', flex:1}} key={index}>
          {
            item.data.map((collection) => (
              <CollectionBubble navigation={navigation} name={collection.name} key={collection.name} />
            ))
          }
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
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
          <Animated.View
            style={[styles.bottomSheet]}
          >
            {/* <SortBy style={{right: 30}}/> */}
            {
              collections.length !== 0 ?
              <ScrollView style={styles.collectionsView}
              >

                  <View style={[styles.collections]}>
                  {
                    collections.map((item, index) => (
                      <CollectionBubble navigation={navigation} name={item.name} key={item.name} />
                    ))
                  }
                  </View>
               
              </ScrollView>
            :
            <View style={styles.callToActionWrapper}> 
              <CustomText style={styles.callToAction}>Add a collection to get started!</CustomText>
            </View>
            
            }
          </Animated.View>
      </View >
    )
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.mainContent}>
        
        <Animated.View style={[styles.summaryStaticsGroup, animStats]}>
          {
            fields.map((field, index) => (
              <SummaryStatistic
                key={field}
                title={field}
                value={values[index]}
              />
            )) 
          }
        </Animated.View>
        <Animated.View style={[styles.container, animBag, animScaleIn]}>
          {/* TODO: loading bag on every render using await that clogs js thread */}
          <BagModel/>
        </Animated.View>
        <TouchableHighlight style={styles.settings}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={()=>navigation.navigate('Settings')}
          iconName="settings"
          size={43}
        >
              <Icon name="settings" size={30} />
        </TouchableHighlight>
 
      </View>
      
      <Animated.View style={[{alignItems: 'center'}, animGraph]}>
        <Carousel
            style={{height: 350}}
            width={390}
            data={[{ stat: 'Item Count', history: histories[0] }, { stat: 'Collection Count', history: histories[1] }, 
            { stat: 'Item Quantity', history: histories[2] }, { stat: 'Total Value', history: histories[3] }
          ]}
            renderItem={({ stat, history }) => {
              return <GraphBubble stat={stat} data={history}/>;
            }}
        />
      </Animated.View>
      
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        contentContainerStyle={styles.contentContainer}
        overDragResistanceFactor={1}
        backgroundStyle={{backgroundColor: '#fcca47', borderTopRightRadius: 30, borderTopLeftRadius: 30}}
        handleStyle={{borderTopRightRadius: 30, borderTopLeftRadius: 30, height: 30}}
        handleIndicatorStyle={{width: '10%', height: 8}}
        animateOnMount={false}
      >
        <BottomSheetContent/>
      </BottomSheet>
   
      

    </View>  
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  collections: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'
  },
  canvas: {
    right:20,
    top: 5
  },
  fab: {
    paddingBottom: 60,
    paddingRight: 10,
  },
  iconButton: {
    borderRadius: 100,
    padding: 5,
  },
  settings: {
    position: "absolute",
    top: 0,
    right: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 0.5
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1
  },
  bottomSheetScrollView: {
    marginBottom: 10,
    flexGrow: 0,
  },
  collectionBubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10%',
    height: '33%',
    
  },
  
  summaryStaticsGroup: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },
  collectionsView: { 

  },
  contentContainer:{
    flex:1,
   
  },
  callToActionWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  callToAction : {
    fontSize: 25,
    marginRight: 5, 
    marginLeft:5,
    textAlign: "center"

  }
})
