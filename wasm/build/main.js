const fs = require('fs');
const createModule = require('./boolean_op.js')

// 検証用
// node.jsで実行するので、CMakeLists.txtでENVIRONMENT=nodeを指定する
// 実行する時は以下のコマンドを使う
// node --no-experimental-fetch main.js

createModule().then((module) => {
    const operation = "intersection";
    const file1 = "armadillo.obj";
    const file2 = "bunny.obj";
    const output = "output.obj";

    console.log("hello")
    const result = module.ccall('IRMB_boolean_file', 'number', ['string', 'string', 'string', 'string'], [ operation, file1, file2, output]);
    console.log(result);

    // wasmモジュールからファイルを読み込む 
    const fileContent = module.FS.readFile(output, { encoding: 'utf8' });

    // ローカルに保存
    const localFilePath = `./output.obj`;
    fs.writeFileSync(localFilePath, fileContent);
    console.log("File saved to", localFilePath);
});

