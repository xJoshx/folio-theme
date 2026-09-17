class HealthController < ApplicationController
  def show
    render json: { service: "rails", healthy: true }, status: :ok
  end
end
