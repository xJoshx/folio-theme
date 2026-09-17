#include <algorithm>
#include <vector>

template <typename T>
auto active(const std::vector<T>& values) {
    std::vector<T> result;
    std::copy_if(values.begin(), values.end(), std::back_inserter(result), [](const T& value) { return value.active; });
    return result;
}
