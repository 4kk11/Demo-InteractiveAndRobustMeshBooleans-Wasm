#include <IARMB/code/booleans.h>
#include "export_function.h"

extern "C"
{
    EXPORTED_FUNCTION void IRMB_boolean(
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

        std::cout << "operation: " << operation << std::endl;
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

        std::cout << "start boolean" << std::endl;
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

    

    EXPORTED_FUNCTION int IRMB_boolean_file(const char* operation, const char* input1, const char* input2, const char* output)
    {
        BoolOp op;
        std::string file_out;
        std::vector<std::string> files;

        std::cout << "operation: " << operation << std::endl;
        std::cout << "input1: " << input1 << std::endl;
        std::cout << "input2: " << input2 << std::endl;
        std::cout << "output: " << output << std::endl;

        if (strcmp(operation, "intersection") == 0)       op = INTERSECTION;
        else if (strcmp(operation, "union") == 0)         op = UNION;
        else if (strcmp(operation, "subtraction") == 0)   op = SUBTRACTION;
        else if (strcmp(operation, "xor") == 0)           op = XOR;
    

        files.emplace_back(input1);
        files.emplace_back(input2);

        file_out = output;

        std::vector<double> in_coords, bool_coords;
        std::vector<uint> in_tris, bool_tris;
        std::vector<uint> in_labels;
        std::vector<std::bitset<NBIT>> bool_labels;

        loadMultipleFiles(files, in_coords, in_tris, in_labels);

        auto start_time = std::chrono::system_clock::now();
        // Call the boolean pipeline
        booleanPipeline(in_coords, in_tris, in_labels, op, bool_coords, bool_tris, bool_labels);
        auto end_time = std::chrono::system_clock::now();
        std::chrono::duration<double> elapsed_seconds = end_time - start_time;
        std::cout << "elapsed time: " << elapsed_seconds.count() << "s\n";

        std::cout << "out_coords_len: " << bool_coords.size() << std::endl;
        std::cout << "out_tris_len: " << bool_tris.size() << std::endl;

        cinolib::write_OBJ(file_out.c_str(), bool_coords, bool_tris, {});

        return 0;
    }

    EXPORTED_FUNCTION void DeleteArrayDouble(double *arr)
    {
        delete[] arr;
    }

    EXPORTED_FUNCTION void DeleteArrayUint(uint *arr)
    {
        delete[] arr;
    }

}
