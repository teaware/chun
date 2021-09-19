import Head from "next/head";
import Link from "next/link";
import * as THREE from "three";
import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useTransition, a } from "react-spring";
import * as meshline from "threejs-meshline";

extend(meshline);

function Fatline({ curve, width, color, speed, ratio }) {
  const material = useRef();
  const { gl } = useThree();
  useEffect(() => void gl.setPixelRatio(window.devicePixelRatio || 2), []);
  useFrame(() => (material.current.uniforms.dashOffset.value -= speed));
  return (
    <mesh>
      <meshLine attach="geometry" vertices={curve} />
      <meshLineMaterial
        attach="material"
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.1}
        dashRatio={ratio}
      />
    </mesh>
  );
}

function Lines({ count, colors }) {
  const lines = useMemo(
    () =>
      new Array(count).fill().map(() => {
        let pos = new THREE.Vector3(
          30 - 60 * Math.random(),
          -5,
          10 - 20 * Math.random()
        );
        const points = new Array(30)
          .fill()
          .map(() =>
            pos
              .add(
                new THREE.Vector3(
                  2 - Math.random() * 4,
                  4 - Math.random() * 2,
                  5 - Math.random() * 10
                )
              )
              .clone()
          );
        const curve = new THREE.CatmullRomCurve3(points).getPoints(1000);
        return {
          color: colors[parseInt(colors.length * Math.random())],
          width: Math.max(0.1, 0.5 * Math.random()),
          speed: Math.max(0.0001, 0.0005 * Math.random()),
          ratio: Math.max(0.8, 0.9 * Math.random()),
          curve,
        };
      }),
    [colors, count]
  );
  return lines.map((props, index) => <Fatline key={index} {...props} />);
}

// npx gltfjsx public/scene.gltf
const url = "/scenes/fox/scene.gltf";

function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(url);
  const { gl } = useThree();
  useEffect(() => void gl.setPixelRatio(window.devicePixelRatio || 2), []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group
          position={[0.56, -2.48, 1.05]}
          rotation={[0.06, -0.03, -0.1]}
          scale={[1, 1, 1]}
        >
          <mesh
            material={materials["Material.001"]}
            geometry={nodes["Fox_by_vladhad22@gmailcom_0"].geometry}
          />
        </group>
        <group scale={[8.4, 8.4, 8.4]}>
          <mesh
            material={materials["Material.002"]}
            geometry={nodes.Plane_0.geometry}
          />
        </group>
        <group
          position={[0.23, 6.99, 0.63]}
          rotation={[0, 0, -1.07]}
          scale={[0.91, 0.91, 0.91]}
        >
          <mesh
            material={materials.Material}
            geometry={nodes.Cylinder001_0.geometry}
          />
        </group>
        <group position={[1.07, 8.22, 7.47]} scale={[6.28, 6.28, 3.58]}>
          <mesh
            material={materials["Material.003"]}
            geometry={nodes.Icosphere_0.geometry}
          />
        </group>
        <group position={[-69.61, 16.05, 18.23]} scale={[5.95, 5.95, 5.95]}>
          <mesh
            material={materials["Material.007"]}
            geometry={nodes.Icosphere001_0.geometry}
          />
        </group>
        <group
          position={[-30.24, 20.07, -0.92]}
          rotation={[0, 0, 0.58]}
          scale={[9.61, 9.61, 9.61]}
        >
          <mesh
            material={materials["Material.009"]}
            geometry={nodes.Plane001_0.geometry}
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

export default function Fox() {
  let mouse = useRef([0, 0]);
  return (
    <>
      <Head>
        <title>春</title>
      </Head>

      <h1 className="absolute top-32 left-1/2 transform -translate-x-1/2 tracking-tighter leading-none text-center text-8xl lg:text-9xl font-extrabold">
        春
      </h1>
      <div className="w-full h-screen">
        <Canvas shadowMap camera={{ position: [0, 0, 16] }}>
          <ambientLight intensity={0.75} />
          <pointLight intensity={1} position={[-40, 10, -20]} />
          {/* <spotLight
            castShadow
            intensity={2.25}
            angle={0.2}
            penumbra={1}
            position={[15, 15, 15]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          /> */}
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls
            autoRotate
            enablePan={true}
            enableZoom={false}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Lines
            count={40}
            colors={[
              "#A2CCB6",
              "#FCEEB5",
              "#EE786E",
              "#e0feff",
              "lightpink",
              "lightblue",
            ]}
          />
        </Canvas>
        <Link href="/boxes">
          <a className="absolute right-4 bottom-4 h-6 leading-none">
            next
            <svg
              className="w-6 h-6 inline-block ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </Link>
        {/* <Loading /> */}
      </div>
    </>
  );
}
