defmodule Fixture do
  @moduledoc "A small Elixir sample."

  def active_names(users) do
    for %{name: name, active: true} <- users, do: String.upcase(name)
  end
end
