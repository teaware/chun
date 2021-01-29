import Head from "next/head";
import React, {
  Suspense,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import lerp from "lerp";
import Text from "../components/text";
import Sparks from "../components/sparks";

function Number({ mouse, hover }) {
  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = lerp(
        ref.current.position.x,
        mouse.current[0] / aspect / 10,
        0.1
      );
      ref.current.rotation.x = lerp(
        ref.current.rotation.x,
        0 + mouse.current[1] / aspect / 50,
        0.1
      );
      ref.current.rotation.y = 0.6;
    }
  });
  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <Text
          size={10}
          // onPointerOver={() => hover(true)}
          // onPointerOut={() => hover(false)}
        >
          4
        </Text>
      </group>
    </Suspense>
  );
}

export default function Home() {
  const [hovered, hover] = useState(false);
  const [down, set] = useState(false);
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  useEffect(() => {
    document.body.style.cursor = hovered
      ? "pointer"
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto";
  }, [hovered]);
  return (
    <>
      <Head>
        <title>四季如春</title>
      </Head>
      <div className="w-full h-screen">
        <Canvas
          camera={{ fov: 100, position: [0, 0, 30] }}
          onMouseMove={onMouseMove}
          onMouseUp={() => set(false)}
          onMouseDown={() => set(true)}
        >
          <fog attach="fog" args={["white", 50, 190]} />
          <pointLight distance={100} intensity={4} color="white" />
          <Number mouse={mouse} hover={hover} />
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
        </Canvas>

        <h1 className="absolute top-1/2 transform -translate-y-1/2 text-7xl xl:text-9xl vertical-rl left-4 xl:left-24">
          四季如春
        </h1>
      </div>
    </>
  );
}
