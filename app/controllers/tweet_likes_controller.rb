class TweetLikesController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]

  def create
    like = current_user.tweet_likes.build(tweet_id: params[:tweet_id])
    like.save
    @tweet = Tweet.find(params[:tweet_id])
  end

  def destroy
    like = TweetLike.find_by(tweet_id: params[:tweet_id], user_id: current_user.id)
    like.destroy
    @tweet = Tweet.find(params[:tweet_id])
  end
end
