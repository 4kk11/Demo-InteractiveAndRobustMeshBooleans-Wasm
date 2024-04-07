'use client'

import { Canvas } from "@react-three/fiber";
import { CameraControls, Center, ContactShadows, Environment, Grid, OrbitControls, PerspectiveCamera, PivotControls, Wireframe } from "@react-three/drei";
import { Color, Mesh } from "three";
import { Leva, useControls } from "leva";
import { Suspense, useRef, useState } from "react";
import { ObjModel } from "./ObjModel";
import { BooleanOperation } from "./BooleanOperation";

const Env = () => {
    return (
        <>
            <Environment preset="warehouse"/>
            <ambientLight intensity={4.0} />
            <directionalLight position={[10, 10, 10]} intensity={2.5} castShadow />
        </>
    )
}

const Things = () => {
    const {Test} = useControls({
        Test: {
            options: ["A", "B", "C"],
            value: "A"
        }
    });

    return (
        <>

        </>
    )
}

export const Viewer = () => {
    const objARef = useRef<Mesh>(null);
    const objBRef = useRef<Mesh>(null);

    const [objALoaded, setObjALoaded] = useState(false);
    const [objBLoaded, setObjBLoaded] = useState(false);

    const [trriggerRecalc, setTriggerRecalc] = useState(false);
    
    return (
        <>
            <Things />
            <Leva />
            <Canvas camera={{position: [-10, 10, 10], fov: 45}}>
                
                <OrbitControls makeDefault rotateSpeed={1} dampingFactor={0.15}/>
                <Env />
                
                <Grid cellSize={1} sectionSize={5} infiniteGrid cellColor={new Color(0.5, 0.5, 0.5)} sectionColor={new Color(0.5, 0.5, 0.5)} position={[0.0, -0.01, 0.0]}/>
                <pointLight position={[10, 10, 10]} />
                <ContactShadows opacity={0.3} blur={3}/>

                <Suspense fallback={null}>
                    <PivotControls anchor={[0, 0, 0]} depthTest={false} scale={2.0} lineWidth={2.0} onDrag={()=> setTriggerRecalc(prev => !prev)}>
                        <ObjModel ref={objARef} url = "/models/obj/bunny_4k.obj"  scale={10.0} onLoad={() => setObjALoaded(true)} castShadow={false}>
                            <Wireframe
                                thickness={0.015}
                                stroke={"#000000"}
                            />
                        </ObjModel>
                    </PivotControls>
                    <ObjModel ref={objBRef} url = "/models/obj/armadillo_15k.obj"  scale={10.0} onLoad={() => setObjBLoaded(true)} castShadow={false}>
                        <Wireframe
                            thickness={0.015}
                            stroke={"#000000"}
                        />
                    </ObjModel>
                    {objALoaded && objBLoaded &&(
                        <BooleanOperation objARef={objARef} objBRef={objBRef} operation="difference" reculc={trriggerRecalc}>
                            <Wireframe
                                thickness={0.02}
                                stroke={"#000000"}
                            />
                        </BooleanOperation>
                    )}
                </Suspense>
            </Canvas>
        </>
    )
}