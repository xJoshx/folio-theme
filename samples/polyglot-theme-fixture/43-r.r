library(dplyr)

users <- tibble(name = c("Ada", "Grace"), active = c(TRUE, FALSE))
users |> filter(active) |> pull(name)
