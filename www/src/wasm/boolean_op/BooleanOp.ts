import { BufferAttribute, BufferGeometry, Float32BufferAttribute, Uint32BufferAttribute } from "three";
import WasmModuleHolder from "./WasmModuleHolder";

type Operation = "union" | "difference" | "intersection";

export const BooleanOp = (geoA: BufferGeometry, geoB: BufferGeometry, operation: Operation): BufferGeometry => {

    // ジオメトリの頂点座標を取得
    const posA = Array.from(geoA.attributes.position.array as Float32Array);
    const posB = Array.from(geoB.attributes.position.array as Float32Array);

    // 三角形インデックスを取得（インデックスが存在しない場合は連番を生成）
    const idxA = Array.from(geoA.index ? geoA.index.array as Uint32Array : new Uint32Array(posA.length / 3).map((_, i) => i));
    const idxB = Array.from(geoB.index ? geoB.index.array as Uint32Array : new Uint32Array(posB.length / 3).map((_, i) => i));

    // 入力データを結合
    const inCoords = new Float64Array([...posA, ...posB]);
    const inTris = new Uint32Array([...idxA, ...idxB.map(i => i + posA.length / 3)]);
    const inLabels = new Uint32Array(Array(idxA.length / 3).fill(0).concat(Array(idxB.length / 3).fill(1)));

    // 入力用のポインタを確保
    const inCoordsPtr = WasmModuleHolder.wasmModule._malloc(inCoords.byteLength);
    WasmModuleHolder.wasmModule.HEAPF64.set(inCoords, inCoordsPtr / 8);
    const inTrisPtr = WasmModuleHolder.wasmModule._malloc(inTris.byteLength);
    WasmModuleHolder.wasmModule.HEAPU32.set(inTris, inTrisPtr / 4);
    const inLabelsPtr = WasmModuleHolder.wasmModule._malloc(inLabels.byteLength);
    WasmModuleHolder.wasmModule.HEAPU32.set(inLabels, inLabelsPtr / 4);

    // 出力用のポインタを確保
    const outCoordsPtrPtr = WasmModuleHolder.wasmModule._malloc(4);
    const outCoordsLenPtr = WasmModuleHolder.wasmModule._malloc(4);
    const outTrisPtrPtr = WasmModuleHolder.wasmModule._malloc(4);
    const outTrisLenPtr = WasmModuleHolder.wasmModule._malloc(4);

    // ブール演算の種類を数値に変換
    const opNum = operation === "union" ? 0 : operation === "difference" ? 1 : 2;

    console.log(inCoords.length, inTris.length, inLabels.length)
    
    // ブール演算を実行
    WasmModuleHolder.wasmModule._IRMB_boolean(
        // input
        opNum,
        inCoordsPtr,
        inCoords.length,
        inTrisPtr,
        inTris.length,
        inLabelsPtr,
        inLabels.length,
        // output
        outCoordsPtrPtr,
        outCoordsLenPtr,
        outTrisPtrPtr,
        outTrisLenPtr
    );

    // 出力データを取得
    const buffer32 = WasmModuleHolder.wasmModule.HEAPU32.buffer;
    const buffer64 = WasmModuleHolder.wasmModule.HEAPF64.buffer;

    const outCoordsLen = new Uint32Array(buffer32, outCoordsLenPtr, 1)[0];
    const outTrisLen = new Uint32Array(buffer32, outTrisLenPtr, 1)[0];

    const outCoordsPtr = new Uint32Array(buffer32, outCoordsPtrPtr, 1)[0];
    const outTrisPtr = new Uint32Array(buffer32, outTrisPtrPtr, 1)[0];

    // console.log(outCoordsLen, outTrisLen);
    const outCoords = Float32Array.from(new Float64Array(buffer64, outCoordsPtr, outCoordsLen));
    const outTris = Uint32Array.from(new Uint32Array(buffer32, outTrisPtr, outTrisLen));

    // 出力データをThree.jsの形式に変換
    const resultGeo = new BufferGeometry();
    resultGeo.setAttribute("position", new Float32BufferAttribute(outCoords,3));
    resultGeo.setIndex(new Uint32BufferAttribute(outTris, 3));
    
    // メモリの解放
    WasmModuleHolder.wasmModule._free(inCoordsPtr);
    WasmModuleHolder.wasmModule._free(inTrisPtr);
    WasmModuleHolder.wasmModule._free(inLabelsPtr);
    
    WasmModuleHolder.wasmModule._DeleteArrayDouble(outCoordsPtr);
    WasmModuleHolder.wasmModule._DeleteArrayUint(outTrisPtr);
    
    WasmModuleHolder.wasmModule._free(outCoordsPtrPtr);
    WasmModuleHolder.wasmModule._free(outCoordsLenPtr);
    WasmModuleHolder.wasmModule._free(outTrisPtrPtr);
    WasmModuleHolder.wasmModule._free(outTrisLenPtr);


    return resultGeo;
}
