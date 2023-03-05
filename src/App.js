import React, {useRef, useState, Suspense} from 'react';
import './App.css';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import Roboto from './assets/Roboto_Bold.json';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import { useVideoTexture } from '@react-three/drei';

extend({TextGeometry})

function Button(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const font = new FontLoader().parse(Roboto);

  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked)
    console.log(mesh.current.position)
  }
  useFrame(state => {
    if(clicked){
      state.camera.lookAt(mesh.current.position)
      state.camera.position.lerp(new THREE.Vector3(14.5,5,0), .02)
      state.camera.updateProjectionMatrix()
    }
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={.5}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
      onPointerUp={(e) => handleClick()}
    >
      <textGeometry attach="geometry" args={['Click Here', {font, size:1, height:.3}]} />
      <meshStandardMaterial color={hovered ? '#CC5500' : 'orange'} />
    </mesh>
  )
}

function Desk(props) {
  const mesh = useRef()
  return (
    <mesh {...props} ref={mesh}>
      <boxBufferGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
  );
}

function MonitorStand(props) {
  return (
    <group {...props}>
      <mesh position={[0,.15,0]}>
        <boxBufferGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh>
        <boxBufferGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </group>
  );
}

function PowerButton({position, isOn, setIsOn}) {
  const buttonColor = !isOn ? 'red' : 'green';
  const handleClick = () => {
    setIsOn(!isOn);
  };

  
  return (
    <mesh
      position={position}
      onClick={handleClick}
    >
      <circleBufferGeometry args={[0.02, 100]} />    
      <meshStandardMaterial color={buttonColor} />
    </mesh>
  );
}

function Computer({position}) {
  const [isOn, setIsOn] = useState(false)
  var a = new Audio('video.mp4');
  if(isOn) {
    a.play();
  } else {
    a.pause();
  }
  return (
    <group position={position} rotation={[0,1.5,0]}>
      <mesh position={[0, 0.15, 0]}>
        <boxBufferGeometry args={[1, 0.05, 0.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[0.46, -0.2, 0]}>
        <boxBufferGeometry args={[0.08, 0.7, 0.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[-0.46, -0.2, 0]}>
        <boxBufferGeometry args={[0.08, 0.7, 0.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={[0, -0.2, 0.25]}>
        <Suspense fallback={<FallbackMaterial url="10.jpg" />}>

          <boxBufferGeometry args={[0.9, 0.7, 0.01]} />
          {
            isOn ?           
              
              <VideoMaterial url="video.mp4" />
              : 
              <meshStandardMaterial color="black" />
          }

        </Suspense>

      </mesh>

      <mesh position={[0, -0.55, 0]}>
        <boxBufferGeometry args={[1, 0.05, 0.6]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <PowerButton position={[0.45, -0.54, .31]} isOn={isOn} setIsOn={setIsOn} />
    </group>
  );
}

function App() {
  return (
    <Canvas style={{display: "flex", height:"100vh", backgroundColor:"#A7C7E7"}}>
      <ambientLight />
      <pointLight position={[0, 10, 10]} />
      <Button position={[-1.6,0,0]} />
      <Desk position={[12.5,4,0]} />
      <MonitorStand position={[12.5,4.25,0]}/>
      <Computer position={[12.5,5,0]} />
      {/* <PowerButton position={[12.84,4.48,-0.43]} isOn={isOn} setIsOn={setIsOn} /> */}
    </Canvas>
  );
}

function VideoMaterial({ url }) {
  const texture = useVideoTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

function FallbackMaterial({ url }) {
  return <meshStandardMaterial color="black" />
}

export default App;
