import React, {useState} from 'react'
import { StyleSheet } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three';
import ExpoTHREE, { Renderer, TextureLoader } from 'expo-three';
import {ExpoWebRenderingContext, GLView} from 'expo-gl'


let speed = 0;

export default function BagModel() {
  const [object, setObject] = useState(null);

  const onSwipeLeft = () => {
    speed -= 0.009
  }

  const onSwipeRight = () => {
    speed += 0.009

  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };


  return (

    <GestureRecognizer
      onSwipeLeft={(state) => onSwipeLeft(state)}
      onSwipeRight={(state) => onSwipeRight(state)}
      config={config}
      style={[styles.container, styles.canvas]}
    >
      <GLView
        style={styles.container}
        onContextCreate={async (gl) => {
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

          const renderer = new Renderer({ gl });
          renderer.setSize(width, height);
          // renderer.setClearColor(0x668096);

          const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
          camera.position.setZ(55);
          camera.position.setY(22);
          // camera.position.setX(30);

          const scene = new Scene();

          const ambientLight = new AmbientLight(0x101010);
          scene.add(ambientLight);

          const pointLight = new PointLight(0xfcca47, 2, 1000, 1);
          pointLight.position.set(0, 400, 400);
          scene.add(pointLight);

          const spotLight = new SpotLight(0xfcca47, 0.8);
          spotLight.position.set(0, 500, 100);
          spotLight.lookAt(scene.position);
          scene.add(spotLight);

          // const axesHelper = new THREE.AxesHelper( 100 );
          // scene.add( axesHelper );

          const object = await ExpoTHREE.loadObjAsync({asset: require('./../assets/default_backpack.obj')})
          setObject(object)
          
          function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
            object.rotateX(THREE.Math.degToRad(degreeX));
            object.rotateY(THREE.Math.degToRad(degreeY));
            object.rotateZ(THREE.Math.degToRad(degreeZ));
          }

          rotateObject(object, -90, 0, 0);

          scene.add( object );
          // camera.lookAt(object.position)
          //animate rotation
          const update = () => {
            object.rotation.z += speed
          }
          
          const render = () => {
              timeout = requestAnimationFrame(render);
              update();
              renderer.render(scene, camera);
              gl.endFrameEXP();
            };
          render();
        }}
        />
      </GestureRecognizer>
     
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  canvas: {
    right:20,
    top: 5
  },
})