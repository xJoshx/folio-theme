User = Data.define(:name, :roles)

def active_names(users)
  users.filter { |user| user.roles.include?(:active) }.map(&:name)
end
