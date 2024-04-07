import { useEffect } from "react";
import WasmModuleHolder from "./WasmModuleHolder";

export const WasmLoader = () => {
    useEffect(() => {
        const loadWasm = async () => {
            await WasmModuleHolder.loadWasm();
        };

        const script = document.createElement("script");
        script.src = "/wasm/boolean_op.js";
        script.onload = loadWasm;
        document.body.appendChild(script);
    }, [])

    return null;
}