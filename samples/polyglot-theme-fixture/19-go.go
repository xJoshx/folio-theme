package main

import ("context"; "fmt")

func greet(ctx context.Context, name string) (string, error) {
    if err := ctx.Err(); err != nil { return "", err }
    return fmt.Sprintf("hello, %s", name), nil
}
