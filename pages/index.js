import Head from "next/head";
import Link from "next/link";
import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";
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
          // 10 - Math.random() * 20,
          // 10 - Math.random() * 20,
          // 10 - Math.random() * 20
          30 - 60 * Math.random(),
          -5,
          10 - 20 * Math.random()
        );
        const points = new Array(30).fill().map(() =>
          pos
            .add(
              new THREE.Vector3(
                // 4 - Math.random() * 8,
                // 4 - Math.random() * 8,
                // 2 - Math.random() * 4
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

function Rig({ mouse }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.current[0] / 50 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current[1] / 50 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Page() {
  let mouse = useRef([0, 0]);
  return (
    <>
      <Head>
        <title>線條之美</title>
      </Head>

      <div className="w-full h-screen">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          onMouseMove={(e) =>
            (mouse.current = [
              e.clientX - window.innerWidth / 2,
              e.clientY - window.innerHeight / 2,
            ])
          }
        >
          <Lines
            count={80}
            colors={[
              "#A2CCB6",
              "#FCEEB5",
              "#EE786E",
              "#e0feff",
              "lightpink",
              "lightblue",
            ]}
          />
          <Rig mouse={mouse} />
        </Canvas>
        <h1 className="absolute top-1/2 transform -translate-y-1/2 text-7xl xl:text-9xl vertical-rl left-8 xl:left-24">
          線
        </h1>
        <Link href="/fox">
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
      </div>
    </>
  );
}
