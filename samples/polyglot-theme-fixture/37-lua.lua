local M = {}

function M.greet(name)
  local message = string.format("hello, %s", name or "world")
  return { message = message, ready = true }
end

return M
