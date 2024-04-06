"use client";
import { createRoot } from "react-dom/client";
import { Viewer } from "@/components/Viewer";

export default function Home() {
    return (
        <div id="canvas-container" className="relative h-screen w-screen">
            <Viewer />
        </div>
    )
}