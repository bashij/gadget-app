class TweetBookmarksController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    bookmark = current_user.tweet_bookmarks.build(tweet_id: params[:tweet_id])
    bookmark.save
    @tweet = Tweet.find(params[:tweet_id])
  end

  def destroy
    @bookmark.destroy
    @tweet = Tweet.find(params[:tweet_id])
  end

  private

    def correct_user
      @bookmark = current_user.tweet_bookmarks.find_by(tweet_id: params[:tweet_id])
      redirect_to root_url if @bookmark.nil?
    end
end
