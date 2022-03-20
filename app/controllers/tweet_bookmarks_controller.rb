class TweetBookmarksController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]

  def create
    bookmark = current_user.tweet_bookmarks.build(tweet_id: params[:tweet_id])
    bookmark.save
    @tweet = Tweet.find(params[:tweet_id])
  end

  def destroy
    bookmark = TweetBookmark.find_by(tweet_id: params[:tweet_id], user_id: current_user.id)
    bookmark.destroy
    @tweet = Tweet.find(params[:tweet_id])
  end
end
