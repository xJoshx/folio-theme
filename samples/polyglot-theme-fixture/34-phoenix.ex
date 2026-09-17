defmodule FixtureWeb.HealthController do
  use FixtureWeb, :controller

  def show(conn, _params), do: json(conn, %{service: "phoenix", healthy: true})
end
