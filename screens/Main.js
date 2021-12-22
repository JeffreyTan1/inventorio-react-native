import React, { useRef, useState, useMemo, useEffect } from "react";
import { View, StyleSheet } from 'react-native'
import SummaryStatistic from '../components/SummaryStatistic';
import { ScrollView } from "react-native-gesture-handler";
import CustomText from "../components/CustomText";
import globalStyles from "../styles/globalStyles";
import SortBy from "../components/SortBy";
import CollectionBubble from "../components/CollectionBubble";
import BagModel from "../components/BagModel";
import IconButton from "../components/IconButton";
import Animated, { useAnimatedStyle, interpolate, useSharedValue, withTiming, withDelay } from "react-native-reanimated";
import BottomSheet, {useBottomSheet, useBottomSheetSpringConfigs} from '@gorhom/bottom-sheet';
import GraphBubble from "../components/GraphBubble";
import Carousel from 'react-native-reanimated-carousel';
import { Provider, Dialog, Portal, TextInput, Button } from "react-native-paper";

export default function Main({navigation}) {
  const [visible, setVisible] = useState(false)
  const [collectionInput, setCollectionInput] = useState('')
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['13%', '60%'], []);

  const showDialog = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setCollectionInput('')
    setVisible(false)
  }

  const handleSave = () => {
    console.log(collectionInput)
    setCollectionInput('')
    setVisible(false)
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
        opacity: bottomSheetDataSHARED.value,
      }
    })
    return (
      <View style={styles.contentContainer}>
          <View style={styles.bottomSheetTitle}>
            <CustomText style={globalStyles.headingText}>Collections</CustomText>
            <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>5</CustomText>
            <IconButton
              style={[styles.iconButton, styles.plus]}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={()=>showDialog()}
              iconName="add"
              size={43}
            />
          </View>
          <Animated.View
            style={[styles.bottomSheet, animBottomSheet]}
          >
            <SortBy style={{right: 30}}/>
            <Carousel
              width={450}
              data={[{ data: {} }, { data: {} }, { data: {} }]}
              renderItem={({ data }) => {
                return (
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent:'center', flex:1}}>
                    <CollectionBubble navigation={navigation}/>
                    <CollectionBubble navigation={navigation}/>
                    <CollectionBubble navigation={navigation}/>
                    <CollectionBubble navigation={navigation}/>
                  </View>
                );
              }}
            />
          </Animated.View>
      </View >
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Animated.View style={[styles.summaryStaticsGroup, animStats]}>
          <SummaryStatistic
            title='Total Value'
            value='$1500'
          />
          <SummaryStatistic
            title='Total Value'
            value='$1500'
          />
          <SummaryStatistic
            title='Total Value'
            value='$1500'
          />
        </Animated.View>
        <Animated.View style={[styles.container, animBag, animScaleIn]}>
          <BagModel/>
        </Animated.View>
      </View>

      <Animated.View style={[{alignItems: 'center'}, animGraph]}>
        <Carousel
            style={{height: 350}}
            width={390}
            data={[{ stat: 'Total Value' }, { stat: 'Items' }, { stat: 'Collections' }]}
            renderItem={({ stat }) => {
              return <GraphBubble stat={stat}/>;
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
        animationConfigs={useBottomSheetSpringConfigs({
          damping: 80,
          overshootClamping: true,
          restDisplacementThreshold: 0.1,
          restSpeedThreshold: 0.1,
          stiffness: 500,
        })}
      >
        <BottomSheetContent />
      </BottomSheet>
   
      <IconButton
        style={[styles.iconButton, styles.settings]}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={()=>navigation.navigate('Settings')}
        iconName="settings"
        size={43}
      />

      <Provider>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={handleCancel}>
            <Dialog.Title>Add Collection</Dialog.Title>
            <Dialog.Content>
              <TextInput value={collectionInput} onChangeText={val=>setCollectionInput(val)}/>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleCancel}>Cancel</Button>
              <Button onPress={handleSave}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </View>
      </Provider>
      
    </View>  
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    right:20,
    top: 5
  },

  iconButton: {
    borderRadius: 100,
    padding: 5,
  },
  settings: {
    position: 'absolute',
    top: 20,
    right: 20,
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
    height: '100%'
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
    height: '33%'
  },
  
  summaryStaticsGroup: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  }
})
