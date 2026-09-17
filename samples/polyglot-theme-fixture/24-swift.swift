struct User: Codable, Identifiable {
    let id: UUID
    var name: String
    var roles: Set<String> = []
}

let names = users.filter { $0.roles.contains("active") }.map(\.name)
