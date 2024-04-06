'use client'

import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment, Grid, OrbitControls, PerspectiveCamera, PivotControls, Wireframe } from "@react-three/drei";
import { Color } from "three";

const Env = () => {
    return (
        <>
            <Environment preset="warehouse"/>
            <ambientLight intensity={4.0} />
            <directionalLight position={[10, 10, 10]} intensity={2.5} castShadow />
        </>
    )
}

export const Viewer = () => {
    return (
        <Canvas camera={{position: [-10, 10, 10], fov: 45}}>
            
            <OrbitControls makeDefault rotateSpeed={1} dampingFactor={0.15}/>
            <Env />
            
            <Grid cellSize={1} sectionSize={5} infiniteGrid cellColor={new Color(0.5, 0.5, 0.5)} sectionColor={new Color(0.5, 0.5, 0.5)} position={[0.0, -0.01, 0.0]}/>
            <pointLight position={[10, 10, 10]} />
            <ContactShadows opacity={0.3} blur={3}/>
            <mesh position={[0.0, 0.5, 0.0]}>
                <Wireframe
                    thickness={0.005}
                    stroke={"#000000"}
                />
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={new Color(0.3, 0.3, 0.3)} />
            </mesh>
        </Canvas>
    )
}