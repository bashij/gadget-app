class ReviewRequestsController < ApplicationController
  def show
    @users = Gadget.find(params[:gadget_id]).requesting_users
  end

  def create
    review_request = current_user.review_requests.build(gadget_id: params[:gadget_id])
    review_request.save
    redirect_to request.referer || root_url
  end

  def destroy
    review_request = ReviewRequest.find_by(gadget_id: params[:gadget_id], user_id: current_user.id)
    review_request.destroy
    redirect_to request.referer || root_url
  end
end
