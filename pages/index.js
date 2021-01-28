import Head from "next/head";
import * as THREE from "three";
import { Suspense, useState, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import Sparks from "../components/sparks";

function Ellipse(props) {
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 10, 3, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(50);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <line geometry={geometry} {...props}>
      <meshBasicMaterial attach="material" />
    </line>
  );
}

// function ReactAtom(props) {
//   return (
//     <group {...props}>
//       <Ellipse />
//       <Ellipse rotation={[0, 0, Math.PI / 3]} />
//       <Ellipse rotation={[0, 0, -Math.PI / 3]} />
//       <mesh>
//         <sphereBufferGeometry attach="geometry" args={[0.5, 32, 32]} />
//         <meshBasicMaterial attach="material" color="red" />
//       </mesh>
//     </group>
//   );
// }

// function Number({ mouse, hover }) {
//   const ref = useRef();
//   const { size, viewport } = useThree();
//   const aspect = size.width / viewport.width;
//   useFrame((state) => {
//     if (ref.current) {
//       ref.current.position.x = lerp(
//         ref.current.position.x,
//         mouse.current[0] / aspect / 10,
//         0.1
//       );
//       ref.current.rotation.x = lerp(
//         ref.current.rotation.x,
//         0 + mouse.current[1] / aspect / 50,
//         0.1
//       );
//       ref.current.rotation.y = 0.8;
//     }
//   });
//   return (
//     <Suspense fallback={null}>
//       <group ref={ref}>
//         <Text
//           size={10}
//           onPointerOver={() => hover(true)}
//           onPointerOut={() => hover(false)}
//         >
//           4
//         </Text>
//         <ReactAtom position={[35, -20, 0]} scale={[1, 0.5, 1]} />
//       </group>
//     </Suspense>
//   );
// }

export default function Home() {
  const [hovered, hover] = useState(false);
  const mouse = useRef([0, 0]);
  return (
    <>
      <Head>
        <title>新年快乐</title>
      </Head>
      <div className="w-full h-screen">
        <Canvas shadowMap camera={{ position: [0, 0, 100], fov: 100 }}>
          <Sparks
            count={20}
            mouse={mouse}
            colors={[
              "#A2CCB6",
              "#FCEEB5",
              "#EE786E",
              "#e0feff",
              "lightpink",
              "lightblue",
            ]}
          />
          {/* <Number mouse={mouse} hover={hover} /> */}
        </Canvas>

        <h1 className="absolute top-1/2 transform -translate-y-1/2 text-7xl xl:text-9xl vertical-rl left-4 xl:left-24">
          新年快乐
        </h1>
      </div>
    </>
  );
}
