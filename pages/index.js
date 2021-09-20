import Head from "next/head";
import * as THREE from "three";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useTransition, a } from "react-spring";

// npx gltfjsx public/scene.gltf
const url = "/scenes/moon/scene.gltf";

function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(url);
  const { gl } = useThree();
  useEffect(() => void gl.setPixelRatio(window.devicePixelRatio || 2), []);
  useFrame(() => {
    group.current.children[0].position.x = THREE.MathUtils.lerp(
      group.current.children[0].position.x,
      10,
      0.03
    );
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <sphereGeometry args={[2, 64, 64]} />
      <group>
        <group
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-10, 5, 5]}
          scale={[6, 6, 6]}
        >
          <mesh
            geometry={nodes.Sphere_Material002_0.geometry}
            material={materials["Material.002"]}
          />
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
          className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-gray-900"
          key={key}
          style={{ opacity }}
        >
          <div className="w-40 lg:w-80 h-1 bg-gray-500 rounded-sm">
            <a.div className="h-1 bg-white rounded-sm" style={{ width }} />
          </div>
        </a.div>
      )
  );
}

// function Zoom() {
//   const vec = new THREE.Vector3(0, 0, 100);
//   return useFrame((state) => {
//     state.camera.position.lerp(vec, 0.075);
//     state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 20, 0.075);
//     state.camera.lookAt(0, 0, 0);
//     state.camera.updateProjectionMatrix();
//   });
// }

function Rig({ children }) {
  const outer = useRef();
  // const inner = useRef<THREE.Group>
  useFrame(({ camera, clock }) => {
    // outer.current.position.y = THREE.MathUtils.lerp(
    //   outer.current.position.y,
    //   0,
    //   0.05
    // );
    outer.current.rotation.y = Math.sin(clock.getElapsedTime() / 8) * Math.PI;
    outer.current.position.z = 5 + -Math.sin(clock.getElapsedTime() / 2) * 5;
    outer.current.position.y = -5 + Math.sin(clock.getElapsedTime() / 2) * 2;
  });
  return (
    <group position={[0, -100, 0]} ref={outer}>
      <group>{children}</group>
    </group>
  );
}

export default function Moon() {
  return (
    <>
      <Head>
        <title>Moon</title>
      </Head>

      <h1 className="absolute top-40 left-1/2 transform -translate-x-1/2 tracking-tighter leading-none text-center text-5xl lg:text-9xl">
        <span className="block font-serif font-thin text-3xl lg:text-8xl">
          中秋快乐
        </span>
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
            <Rig>
              <Model />
              {/* <Zoom /> */}
            </Rig>
          </Suspense>
          {/* <OrbitControls
            autoRotate
            enablePan={true}
            enableZoom={true}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={1}
            maxPolarAngle={Math.PI / 2.3}
            minPolarAngle={Math.PI / 2.3}
          /> */}
        </Canvas>
        <Loading />
      </div>
    </>
  );
}
