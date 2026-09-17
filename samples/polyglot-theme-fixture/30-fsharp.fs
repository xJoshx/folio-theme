type Result<'a> = Ok of 'a | Error of string

let describe = function
    | Ok value -> $"value: {value}"
    | Error message -> $"error: {message}"
