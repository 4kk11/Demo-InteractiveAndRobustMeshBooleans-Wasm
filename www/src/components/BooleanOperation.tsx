import { BooleanOp } from "@/wasm/boolean_op/BooleanOp";
import { useEffect, useState } from "react";
import { BufferGeometry, Mesh } from "three";

type BooleanOperationProps = {
    objARef: React.RefObject<Mesh>;
    objBRef: React.RefObject<Mesh>;
    operation: "union" | "difference" | "intersection";
    reculc?: boolean;
    children?: React.ReactNode;
};

export const BooleanOperation: React.FC<BooleanOperationProps> = (props: BooleanOperationProps) => {
    const { objARef, objBRef, operation, reculc } = props;
    const [resultGeometry, setResultGeometry] = useState<BufferGeometry | null>(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const objAMesh = objARef.current;
        const objBMesh = objBRef.current;
        
        if (!objAMesh || !objBMesh) {
            return;
        }
        
        const geometryA = objAMesh.geometry.clone();
        const geometryB = objBMesh.geometry.clone();

        geometryA.applyMatrix4(objAMesh.matrixWorld);
        geometryB.applyMatrix4(objBMesh.matrixWorld);
        
        const result = BooleanOp(geometryA, geometryB, operation).toNonIndexed();
        
        setResultGeometry(result);
        setKey(prev => prev + 1);

        return () => {
            geometryA.dispose();
            geometryB.dispose();
            result.dispose();
            console.log("dispose")
        };

    }, [objARef, objBRef, operation, reculc])

    if (!resultGeometry) {
        return null;
    }

    return (
        <mesh geometry={resultGeometry} renderOrder={1} key={key}>
            <meshStandardMaterial />
            {props.children}
        </mesh>
    )
}