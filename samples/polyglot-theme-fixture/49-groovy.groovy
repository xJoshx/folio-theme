class User {
    String name
    Set<String> roles = []
}

def activeNames(List<User> users) { users.findAll { it.roles.contains('active') }*.name }
