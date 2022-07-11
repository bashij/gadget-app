class TweetLikesController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    like = current_user.tweet_likes.build(tweet_id: params[:tweet_id])
    like.save
    @tweet = Tweet.find(params[:tweet_id])
  end

  def destroy
    @like.destroy
    @tweet = Tweet.find(params[:tweet_id])
  end

  private

    def correct_user
      @like = current_user.tweet_likes.find_by(tweet_id: params[:tweet_id])
      redirect_to root_url if @like.nil?
    end
end
