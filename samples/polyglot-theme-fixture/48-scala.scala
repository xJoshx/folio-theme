case class User(name: String, roles: Set[String] = Set.empty)

def activeNames(users: List[User]): List[String] =
  users.collect { case User(name, roles) if roles.contains("active") => name }
