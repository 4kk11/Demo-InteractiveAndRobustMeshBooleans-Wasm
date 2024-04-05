#!/bin/bash
set -e

# イメージの名前を設定
IMAGE_NAME="boolean_wasm"
CONTAINER_NAME="boolean_wasm_container"
TARGET_NAME="boolean_op"

# buildディレクトリが存在しない場合は作成
[ ! -d "./build" ] && mkdir -p build

# dockerイメージをビルド
docker build -t $IMAGE_NAME .
if [ $? -ne 0 ]; then
    echo "Failed to build docker image."
    exit 1
fi

# 既存のコンテナがあれば削除
docker rm -f $CONTAINER_NAME 2> /dev/null || true

# 新しいコンテナをデタッチモードで起動
docker run --name $CONTAINER_NAME  -d $IMAGE_NAME
if [ $? -ne 0 ]; then
    echo "Failed to run docker container."
    exit 1
fi

# コンテナからホストにファイルをコピー
docker cp $CONTAINER_NAME:/workspace/build/$TARGET_NAME.js ./build/$TARGET_NAME.js
docker cp $CONTAINER_NAME:/workspace/build/$TARGET_NAME.wasm ./build/$TARGET_NAME.wasm
# $TARGET_NAME.dataが存在する場合のみコピー
docker cp $CONTAINER_NAME:/workspace/build/$TARGET_NAME.data ./build/$TARGET_NAME.data 2> /dev/null || true

# コンテナの停止と削除
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME

echo "Build files copied to the host machine."
 
 
