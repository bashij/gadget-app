class GadgetLikesController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    like = current_user.gadget_likes.build(gadget_id: params[:gadget_id])
    like.save
    @gadget = Gadget.find(params[:gadget_id])
  end

  def destroy
    @like.destroy
    @gadget = Gadget.find(params[:gadget_id])
  end

  private

    def correct_user
      @like = current_user.gadget_likes.find_by(gadget_id: params[:gadget_id])
      redirect_to root_url if @like.nil?
    end
end
