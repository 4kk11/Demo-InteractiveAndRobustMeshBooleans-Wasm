import { useLoader } from "@react-three/fiber"
import { forwardRef, useEffect, useRef, useState } from "react"
import { OBJLoader } from "three/examples/jsm/Addons.js"
import { Mesh, BufferGeometry } from "three"

const useObjLoader = (url: string, onLoad: () => void) => {
    const obj = useLoader(OBJLoader, url);
    const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

    useEffect(() => {
        if (obj) {
            const mesh = obj.children[0] as Mesh;
            const geometry = mesh.geometry;
            
            // 底面を原点に合わせる
            geometry.computeBoundingBox();
            const box = geometry.boundingBox;
            if(box) {
                const bottom = box.min.y;
                geometry.translate(0, -bottom, 0);
                geometry.computeBoundingBox();
            }

            setGeometry(mesh.geometry);
            onLoad();
        }
    }, [obj]);

    return geometry;
}

type ObjModelProps = JSX.IntrinsicElements['mesh'] & {
    url: string,
    onLoad?: () => void,
    children?: React.ReactNode
}

export const ObjModel = forwardRef<Mesh, ObjModelProps>((props: ObjModelProps, ref) => {
    const { url, onLoad, children, ...meshProps } = props;
    const geometry = useObjLoader(url, onLoad || (() => {}));

    if (!geometry) {
        return null;
    }

    return (
        <mesh ref={ref} geometry={geometry} {...meshProps} renderOrder={2}>
            <meshStandardMaterial transparent={true} opacity={0.1}/>
            {children}
        </mesh>
    )
});