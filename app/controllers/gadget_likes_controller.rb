class GadgetLikesController < ApplicationController
  def create
    like = current_user.gadget_likes.build(gadget_id: params[:gadget_id])
    like.save
    redirect_to request.referer || root_url
  end

  def destroy
    like = GadgetLike.find_by(gadget_id: params[:gadget_id], user_id: current_user.id)
    like.destroy
    redirect_to request.referer || root_url
  end
end
