from dataclasses import dataclass
from collections.abc import Iterable

@dataclass(slots=True)
class User:
    name: str
    roles: tuple[str, ...] = ()

def active_names(users: Iterable[User]) -> list[str]:
    return [user.name for user in users if "active" in user.roles]
