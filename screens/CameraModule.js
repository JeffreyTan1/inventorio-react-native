import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Camera } from 'expo-camera';
import IconButton from '../components/IconButton';


export default function CameraModule({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)

  const takePicture = async () => {
    if(camera) {
      const data = await camera.takePictureAsync({
        skipProcessing: true
      });
      navigation.navigate('Item', {
        uri: data.uri,
      })
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false || hasPermission === null) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.positionIndicator}/>
      <View style={styles.cameraContainer}>
        <Camera 
          ref={ref=>setCamera(ref)}
          style={styles.fixedRatio} 
          type={type}
          flashMode={flashMode}
          ratio={'4:3'}
        />
      </View>
      
      <View style={styles.cameraButtons}>
        <IconButton
          style={styles.cameraIcon}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => {
            setFlashMode(
              flashMode === Camera.Constants.FlashMode.on
                ? Camera.Constants.FlashMode.off
                : Camera.Constants.FlashMode.on
            );
          }}
          iconName={flashMode === Camera.Constants.FlashMode.on ? "flash-on" : "flash-off"}
          size={40}
          color='#000'
        /> 
        <IconButton
          style={styles.cameraIcon}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={takePicture}
          iconName="circle"
          size={60}
          color='#000'
        /> 
        <IconButton
          style={styles.cameraIcon}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
          iconName="flip-camera-android"
          size={40}
          color='#000'
        /> 
      </View>
      
      <IconButton
        style={[styles.iconButton, styles.back]}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={()=>navigation.goBack()}
        iconName="arrow-back-ios"
        size={35}
        color="#fff"
      /> 
    </View>
  )
}

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  iconButton: {
    borderRadius: 100,
    padding: 10
  },
  cameraIcon: {
    borderRadius: 100,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000'
  },
  cameraButtons: {
    flex: 1,
    backgroundColor: '#fcca47',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  cameraContainer: {
    flexDirection: 'row',
  },
  fixedRatio: {
    width: deviceWidth,
    height: 1.33 * deviceWidth
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
})
