-module(fixture).
-export([greet/1]).

greet(Name) when is_list(Name) -> io_lib:format("Hello, ~s", [Name]).
