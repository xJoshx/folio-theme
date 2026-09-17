struct User
    name::String
    active::Bool
end

active_names(users::Vector{User}) = [user.name for user in users if user.active]
