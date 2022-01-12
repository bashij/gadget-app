class TweetLikesController < ApplicationController
  def create
    like = current_user.tweet_likes.build(tweet_id: params[:tweet_id])
    like.save
    redirect_to request.referer || root_url
  end

  def destroy
    like = TweetLike.find_by(tweet_id: params[:tweet_id], user_id: current_user.id)
    like.destroy
    redirect_to request.referer || root_url
  end
end
