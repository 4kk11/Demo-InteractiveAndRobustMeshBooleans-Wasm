FROM ubuntu:latest

RUN apt-get update

RUN apt install -y tzdata
ENV TZ=Asia/Tokyo

# 開発環境のシステムインストール
RUN apt install -y wget \
  g++ \
  cmake \
  git \
  clang-format

# emscriptenのインストール
RUN apt-get install -y emscripten

# ファイルのコピー
WORKDIR /workspace
COPY ./src ./src
COPY ./lib ./lib
COPY ./CMakeLists.txt ./CMakeLists.txt
COPY ./assets/armadillo.obj ./build/armadillo.obj
COPY ./assets/bunny.obj ./build/bunny.obj

# # emscriptenでビルド
WORKDIR /workspace/build
RUN emcmake cmake ..
RUN emmake make