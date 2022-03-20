class ReviewRequestsController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]

  def show
    @users = Gadget.find(params[:gadget_id]).requesting_users.page(params[:users_page]).per(10)

    respond_to do |format|
      format.html
      format.js
    end
  end

  def create
    review_request = current_user.review_requests.build(gadget_id: params[:gadget_id])
    review_request.save
    @gadget = Gadget.find(params[:gadget_id])
  end

  def destroy
    review_request = ReviewRequest.find_by(gadget_id: params[:gadget_id], user_id: current_user.id)
    review_request.destroy
    @gadget = Gadget.find(params[:gadget_id])
  end
end
