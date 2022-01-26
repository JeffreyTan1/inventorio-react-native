import React, { useRef, useState, useMemo, useEffect } from "react";
import { View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native'
import SummaryStatistic from '../components/SummaryStatistic';
import CustomText from "../components/CustomText";
import globalStyles from "../styles/globalStyles";
import CollectionBubble from "../components/CollectionBubble";
import IconButton from "../components/IconButton";
import Animated, { useAnimatedStyle, interpolate, useSharedValue, withTiming, withDelay, Extrapolate } from "react-native-reanimated";
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import GraphBubble from "../components/GraphBubble";
import { getAllCollections, getItemsCount, getCollectionsCount, getItemsQuantitySum, getItemsTotalSum, getHistory } from "../utils/DAO";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import {abbreviate} from './../utils/utils'
import Logo from './../assets/INVENTORIO.svg';
import SortBy from "../components/SortBy";
import { MotiView } from "moti";

const sortingLabels = [
  {label: 'A-Z', value: 'A-Z'},
  {label: 'Z-A', value: 'Z-A'},
  {label: 'Newest', value: 'Newest'},
  {label: 'Oldest', value: 'Oldest'},
]

const { width, height } = Dimensions.get('window');
const reservedCollection = 'Items Without Collections'

export default function Main({navigation, initCollections}) {
  // data from navigation
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '100%'], []);
  const [collections, setCollections] = useState(initCollections);

  // sorting
  const [option, setOption] = useState('Newest')

  // statistics
  const [itemCount, setItemCount] = useState(null);
  const [collectionCount, setCollectionCount] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(null);
  const [totalValue, setTotalValue] = useState(null);
  const fields = ['Total Value', 'Items', 'Collections', 'Total Quantity'];
  const values = [abbreviate(totalValue, 2, 2), abbreviate(itemCount), abbreviate(collectionCount), abbreviate(itemQuantity)];
  const [graphIndex, setGraphIndex] = useState(0);

  useEffect(() => {
    if(isFocused){
      getAllCollections(setCollections)
      getItemsCount(setItemCount)
      getCollectionsCount(setCollectionCount)
      getItemsQuantitySum(setItemQuantity)
      getItemsTotalSum(setTotalValue)
    }
  }, [isFocused])
  

  useEffect(() => {
    if(collections) {
      let tempCollections = collections
      switch (option) {
        case 'A-Z':
          setCollections(tempCollections.sort(compareAlpha))
          break;
        case 'Z-A':
          setCollections(tempCollections.sort(compareAlpha).reverse())
          break;
        case 'Newest':
          setCollections(tempCollections.sort(compareCreated))
          break;
        case 'Oldest':
          setCollections(tempCollections.sort(compareCreated).reverse())
          break;
        default:
          break;
      }
    }
  }, [option])
  
  const bottomSheetDataSHARED = useSharedValue(0)
  const scaleIn = useSharedValue(0)

  useEffect(() => {
    scaleIn.value = withDelay(1000, withTiming(1, {duration: 500}))
  }, [])

  const animStats = useAnimatedStyle(()=> {
    return {
      transform: [{translateY: interpolate(bottomSheetDataSHARED.value, [0,1], [0 + height * 0.02, height * 1], Extrapolate.CLAMP)}],
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
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetTitle}>
              <CustomText style={globalStyles.headingText}>Collections</CustomText>
              <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>{collections && collections.length}</CustomText>
              <IconButton
                style={[styles.iconButton, styles.plus]}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={()=>navigation.navigate('Collection')}
                iconName="add"
                size={40}
              />  
            </View>
            <View style={styles.optionsContainer}>
              <MotiView
                from={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{
                  type: 'timing',
                  duration: 500,
                  delay: 500,
                }}
              >
                <SortBy value={option} setValue={setOption} labels={sortingLabels}/>
              </MotiView>
              <View>
                <TouchableHighlight
                  style={styles.reservedBubble}
                  activeOpacity={0.9}
                  underlayColor="#f2f2f2"
                  onPress={()=>navigation.navigate('Collection', {collection: reservedCollection})}>
                    <CustomText style={styles.reservedText}>🗑️</CustomText>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          
          <View
            style={styles.container}
          >
            {
              collections &&
              <ScrollView style={styles.container} contentContainerStyle={collections.length === 0 && {justifyContent: 'center', flex: 1, }}
              >
                {
                  collections.length === 0 ?
                  <View style={styles.callToActionWrapper}>
                    <CustomText style={styles.callToActionEmoji}>☝🏼</CustomText>
                    <CustomText style={styles.callToAction}>It's a little lonely here... {'\n'} add a collection!</CustomText>
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
                    
                  </View>
                }
              </ScrollView>
            }  
          </View>
      </View >
    )
  }

  return (
    <View style={[styles.container, {backgroundColor: '#ffffff'}]}>
      <View style={styles.header}>
        <Logo width={width * 0.6}/>
        <View style={styles.headerOptions}>
          <IconButton
            style={[styles.headerOptionButton, styles.mr]}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('Search')}
            iconName="search"
            size={33} 
          />
          <IconButton
            style={styles.headerOptionButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>navigation.navigate('Settings')}
            iconName="settings"
            size={33} 
          />
        </View>

      </View>

      <Animated.View style={[styles.summaryStatisticsWrapper, animStats]}>
        <CustomText style={[globalStyles.headingText, styles.ml]}>Analytics</CustomText>
        <View style={styles.summaryStatisticsGroup}>
          {
            fields.map((field, index) => (
              <View key={field} style={styles.summaryStatisticItem}>
                <SummaryStatistic
                title={field}
                value={values[index]}
                onPress={() => {setGraphIndex(index)}}
                index={index}
                />
              </View>
            )) 
          }
        </View>
        <GraphBubble graphIndex={graphIndex}/>
      </Animated.View>

      <View style={styles.bottomSheet}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          containerStyle={styles.container}
          overDragResistanceFactor={1}
          backgroundStyle={{backgroundColor: '#fcca47', borderTopRightRadius: 25, borderTopLeftRadius: 25}}
          handleStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25, height: 15}}
          handleIndicatorStyle={{width: '10%', height: 4}}
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
  headerOptionButton: {
    padding: 3,
    borderRadius: 9,
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
  bottomSheetHeader: {
    marginLeft: 20,
    marginRight: 20,
  },
  bottomSheetTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
  summaryStatisticsGroup: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
    height: '29%'
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
    marginHorizontal: 10,
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
  mr: {
    marginRight: 10
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
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  reservedText: {
    fontSize: 17,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  bottomSheet: {
    flex: 1,
    elevation: 50,
  },
  header: {
    flexDirection: 'row',
    height: '15%',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20
  },
  headerText: {
    fontSize: 40
  },
  headerOptions: {
    flexDirection: 'row',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    paddingBottom: 10
  }
})

const compareAlpha = (a,b) => {
  if(a.name > b.name) { return -1 }
  if(b.name > a.name) { return 1 }
  return 0
}

const compareCreated = (a,b) => {
  if(a.created > b.created) { return -1 }
  if(b.created > a.created) { return 1 }
  return 0
}




