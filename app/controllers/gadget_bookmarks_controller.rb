class GadgetBookmarksController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    bookmark = current_user.gadget_bookmarks.build(gadget_id: params[:gadget_id])
    bookmark.save
    @gadget = Gadget.find(params[:gadget_id])
  end

  def destroy
    @bookmark.destroy
    @gadget = Gadget.find(params[:gadget_id])
  end

  private

    def correct_user
      @bookmark = current_user.gadget_bookmarks.find_by(gadget_id: params[:gadget_id])
      redirect_to root_url if @bookmark.nil?
    end
end
