type user = { name : string; active : bool }

let active_names users =
  users |> List.filter (fun user -> user.active) |> List.map (fun user -> user.name)
