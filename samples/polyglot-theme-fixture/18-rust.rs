#[derive(Debug, Clone)]
pub struct User<'a> { pub name: &'a str, pub active: bool }

pub fn active_names(users: &[User<'_>]) -> Vec<&str> {
    users.iter().filter_map(|user| user.active.then_some(user.name)).collect()
}
