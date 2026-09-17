type User = object
  name: string
  active: bool

proc activeNames(users: seq[User]): seq[string] =
  for user in users:
    if user.active: result.add user.name
