
export default class WasmModuleHolder {
    static wasmModule: any = null;

    static async loadWasm() {
        if (!this.wasmModule) {
            this.wasmModule = await createModule();
        }
    }

    static getModule() {
        return this.wasmModule;
    }
}