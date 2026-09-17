module Fixture where

data User = User { name :: String, active :: Bool }

activeNames :: [User] -> [String]
activeNames = map name . filter active
