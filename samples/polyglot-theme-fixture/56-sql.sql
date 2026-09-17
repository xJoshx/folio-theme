WITH active_users AS (
  SELECT id, name FROM users WHERE status = 'active'
)
SELECT id, UPPER(name) AS display_name
FROM active_users
ORDER BY display_name;
