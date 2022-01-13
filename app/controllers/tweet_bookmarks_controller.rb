class TweetBookmarksController < ApplicationController
  def create
    bookmark = current_user.tweet_bookmarks.build(tweet_id: params[:tweet_id])
    bookmark.save
    redirect_to request.referer || root_url
  end

  def destroy
    bookmark = TweetBookmark.find_by(tweet_id: params[:tweet_id], user_id: current_user.id)
    bookmark.destroy
    redirect_to request.referer || root_url
  end
end
