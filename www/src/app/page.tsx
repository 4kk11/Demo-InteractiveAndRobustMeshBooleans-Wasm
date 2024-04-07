"use client";
import { createRoot } from "react-dom/client";
import { Viewer } from "@/components/Viewer";
import { WasmLoader } from "@/wasm/boolean_op/WasmLoader";

export default function Home() {
    return (
        <div id="canvas-container" className="relative h-screen w-screen">
            <WasmLoader/>
            <Viewer />
        </div>
    )
}