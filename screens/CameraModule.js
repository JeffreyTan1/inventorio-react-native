import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera';
import globalStyles from '../styles/globalStyles';
import IconButton from '../components/IconButton';


export default function CameraModule({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)

  const takePicture = async () => {
    if(camera) {
      const data = await camera.takePictureAsync(null);
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex: 1}}>
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
          color='#fff'
        /> 
        <IconButton
          style={styles.cameraIcon}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={takePicture}
          iconName="circle"
          size={60}
          color='#fff'
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
          color='#fff'
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

const styles = StyleSheet.create({
  iconButton: {
    borderRadius: 100,
    padding: 10
  },
  cameraIcon: {
    borderRadius: 100,
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  cameraButtons: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  cameraContainer: {
    flexDirection: 'row',
  },
  fixedRatio: {
    width: '100%',
    height: 1.33 * 450
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
})
