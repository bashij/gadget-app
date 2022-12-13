class Api::HealthCheckController < ApplicationController
  def index
    logger.info '============================================================'
    logger.info "ReuqestUrl: #{request.url}"
    render json: { status: 200 }, status: 200
  end
end
