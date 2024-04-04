#include <IARMB/code/booleans.h>
#include "export_function.h"

extern "C"
{
    EXPORTED_FUNCTION void IRMB_Boolean(
        // input
        int operation,
        const double *in_coords,
        size_t in_coords_len,
        const uint *in_tris,
        size_t in_tris_len,
        const uint *in_labels,
        size_t in_labels_len,
        // output
        double **out_coords,
        size_t *out_coords_len,
        uint **out_tris,
        size_t *out_tris_len)
    {
        // Convert input to std::vector
        std::vector<double> in_coords_vec(in_coords, in_coords + in_coords_len);
        std::vector<uint> in_tris_vec(in_tris, in_tris + in_tris_len);
        std::vector<uint> in_labels_vec(in_labels, in_labels + in_labels_len);

        BoolOp op;
        switch (operation)
        {
        case 0:
            op = UNION;
            break;
        case 1:
            op = SUBTRACTION;
            break;
        case 2:
            op = INTERSECTION;
            break;
        default:
            op = UNION;
            break;
        }

        // Define output
        std::vector<double> bool_coords;
        std::vector<uint> bool_tris;
        std::vector<std::bitset<NBIT>> bool_labels;

        auto start_time = std::chrono::system_clock::now();
        // Call the boolean pipeline
        booleanPipeline(in_coords_vec, in_tris_vec, in_labels_vec, op, bool_coords, bool_tris, bool_labels);
        auto end_time = std::chrono::system_clock::now();
        std::chrono::duration<double> elapsed_seconds = end_time - start_time;
        std::cout << "elapsed time: " << elapsed_seconds.count() << "s\n";

        // Convert output to double* and uint*
        *out_coords_len = bool_coords.size();
        *out_tris_len = bool_tris.size();
        
        std::cout << "out_coords_len: " << *out_coords_len << std::endl;
        std::cout << "out_tris_len: " << *out_tris_len << std::endl;

        // Allocate memory for output
        *out_coords = new double[*out_coords_len];
        *out_tris = new uint[*out_tris_len];
        std::copy(bool_coords.begin(), bool_coords.end(), *out_coords);
        std::copy(bool_tris.begin(), bool_tris.end(), *out_tris);

    }

    EXPORTED_FUNCTION void DeleteArray(double *arr)
    {
        delete[] arr;
    }

}
