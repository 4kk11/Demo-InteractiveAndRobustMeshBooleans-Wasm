#pragma once

#ifdef __EMSCRIPTEN__
    #include <emscripten.h>
    #define EXPORTED_FUNCTION EMSCRIPTEN_KEEPALIVE
#else
    #if defined(_WIN32) || defined(_WIN64)
        // #include <Windows.h>
        #define EXPORTED_FUNCTION __declspec(dllexport)
    #else
        #define EXPORTED_FUNCTION __attribute__ ((visibility ("default")))
    #endif
#endif