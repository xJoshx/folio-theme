data class User(val name: String, val roles: Set<String> = emptySet())

fun activeNames(users: List<User>): List<String> = users
    .filter { "active" in it.roles }
    .map(User::name)
