class GadgetBookmarksController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]

  def create
    bookmark = current_user.gadget_bookmarks.build(gadget_id: params[:gadget_id])
    bookmark.save
    @gadget = Gadget.find(params[:gadget_id])
  end

  def destroy
    bookmark = GadgetBookmark.find_by(gadget_id: params[:gadget_id], user_id: current_user.id)
    bookmark.destroy
    @gadget = Gadget.find(params[:gadget_id])
  end
end
