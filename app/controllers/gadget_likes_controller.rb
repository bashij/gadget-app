class GadgetLikesController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]

  def create
    like = current_user.gadget_likes.build(gadget_id: params[:gadget_id])
    like.save
    @gadget = Gadget.find(params[:gadget_id])
  end

  def destroy
    like = GadgetLike.find_by(gadget_id: params[:gadget_id], user_id: current_user.id)
    like.destroy
    @gadget = Gadget.find(params[:gadget_id])
  end
end
