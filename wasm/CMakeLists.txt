cmake_minimum_required(VERSION 3.15)

project(boolean_op VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_subdirectory(lib/IARMB)

add_executable(${PROJECT_NAME} ./src/main.cpp)

set_target_properties(${PROJECT_NAME} PROPERTIES
    LINK_FLAGS "-s EXPORTED_RUNTIME_METHODS=['ccall'] -s NO_DISABLE_EXCEPTION_CATCHING -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s DEMANGLE_SUPPORT=1 -s MODULARIZE=1 -s EXPORT_NAME='MyModule' -s ENVIRONMENT=web --bind"
)

target_include_directories(${PROJECT_NAME} PRIVATE lib)
target_link_libraries(${PROJECT_NAME} PRIVATE mesh_booleans)

