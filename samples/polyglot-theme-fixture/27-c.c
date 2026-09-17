#include <stdio.h>

typedef struct { const char *name; int active; } User;

int main(void) {
    User user = {.name = "C", .active = 1};
    printf("%s: %s\n", user.name, user.active ? "ready" : "paused");
    return 0;
}
