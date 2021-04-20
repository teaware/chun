import Head from "next/head";
import * as THREE from "three";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useTransition, a } from "react-spring";

// npx gltfjsx public/scene.gltf
const url = "/scenes/tie/scene.gltf";

function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(url);
  const { gl } = useThree();
  useEffect(() => void gl.setPixelRatio(window.devicePixelRatio || 2), []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[0, 0, -Math.PI / 24]}>
        <mesh
          material={materials.ScratchedMetalDark}
          geometry={nodes.mesh_0.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_1.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_2.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_3.geometry}
        />
        <mesh
          material={materials.RedEngineGlow}
          geometry={nodes.mesh_4.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_5.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_6.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_7.geometry}
        />
        <mesh material={materials.Glass} geometry={nodes.mesh_8.geometry} />
        <mesh
          material={materials.ScratchedMetalDark}
          geometry={nodes.mesh_9.geometry}
        />
        <mesh material={materials.Dark} geometry={nodes.mesh_10.geometry} />
        <mesh
          material={materials.ScratchedMetalOrange}
          geometry={nodes.mesh_11.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_12.geometry}
        />
        <mesh material={materials.Glass} geometry={nodes.mesh_13.geometry} />
        <mesh
          material={materials.ScratchedMetalDark}
          geometry={nodes.mesh_14.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_15.geometry}
        />
        <mesh
          material={materials.ScratchedMetal}
          geometry={nodes.mesh_16.geometry}
        />
        <mesh material={materials.Dark} geometry={nodes.mesh_17.geometry} />
        <mesh
          material={materials.ReflectiveGlass}
          geometry={nodes.mesh_18.geometry}
        />
      </group>
    </group>
  );
}

useGLTF.preload(url);

function Loading() {
  const [finished, set] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = () => set(true);
    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
      setWidth((itemsLoaded / itemsTotal) * 200);
  }, []);

  const props = useTransition(finished, null, {
    from: { opacity: 1, width: 0 },
    leave: { opacity: 0 },
    update: { width },
  });

  return props.map(
    ({ item: finished, key, props: { opacity, width } }) =>
      !finished && (
        <a.div
          className="w-full h-screen fixed top-0 left-0 flex justify-center items-center bg-white dark:bg-gray-600"
          key={key}
          style={{ opacity }}
        >
          <div className="w-40 lg:w-80 h-1 bg-gray-400 rounded-sm">
            <a.div
              className="h-1 bg-black dark:bg-white rounded-sm"
              style={{ width }}
            />
          </div>
        </a.div>
      )
  );
}

export default function TieFighter() {
  return (
    <>
      <Head>
        <title>帝国钛战机</title>
      </Head>

      <h1 className="absolute top-32 left-1/2 transform -translate-x-1/2 tracking-tighter leading-none text-center text-5xl lg:text-9xl font-extrabold">
        帝国
        <span className="block text-blue-200 dark:text-gray-600">钛战机</span>
      </h1>
      <div className="w-full h-screen">
        <Canvas shadowMap camera={{ position: [0, 0, 25] }}>
          <ambientLight intensity={0.75} />
          <pointLight intensity={1} position={[-10, -25, -10]} />
          <spotLight
            castShadow
            intensity={2.25}
            angle={0.2}
            penumbra={1}
            position={[25, 25, 25]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls
            autoRotate
            enablePan={true}
            enableZoom={true}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
        <Loading />
      </div>
    </>
  );
}
