FROM ubuntu:latest

RUN apt-get update

RUN apt install -y tzdata
ENV TZ=Asia/Tokyo

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

# emscriptenでビルド
WORKDIR /workspace/build
RUN emcmake cmake ..
RUN emmake make