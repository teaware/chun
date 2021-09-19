import Head from "next/head";
import * as THREE from "three";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useTransition, a } from "react-spring";

// npx gltfjsx public/scene.gltf
const url = "/scenes/moon/scene.gltf";

function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(url);
  const { gl } = useThree();
  useEffect(() => void gl.setPixelRatio(window.devicePixelRatio || 2), []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]} scale={[6, 6, 6]}>
            <mesh
              geometry={nodes.Sphere_Material002_0.geometry}
              material={materials["Material.002"]}
            />
          </group>
        </group>
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

export default function Moon() {
  return (
    <>
      <Head>
        <title>Moon</title>
      </Head>

      <h1 className="absolute top-32 left-1/2 transform -translate-x-1/2 tracking-tighter leading-none text-center text-5xl lg:text-9xl">
        月
        <span className="block font-serif font-thin text-3xl lg:text-8xl">
          中秋愉快
        </span>
      </h1>
      <div className="w-full h-screen">
        <Canvas shadowMap camera={{ position: [0, 0, 25] }}>
          <ambientLight intensity={0.75} />
          {/* <pointLight intensity={1} position={[-10, -25, -10]} /> */}
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
            maxPolarAngle={Math.PI / 4}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
        <Loading />
      </div>
    </>
  );
}
