class GadgetBookmarksController < ApplicationController
  def create
    bookmark = current_user.gadget_bookmarks.build(gadget_id: params[:gadget_id])
    bookmark.save
    redirect_to request.referer || root_url
  end

  def destroy
    bookmark = GadgetBookmark.find_by(gadget_id: params[:gadget_id], user_id: current_user.id)
    bookmark.destroy
    redirect_to request.referer || root_url
  end
end
