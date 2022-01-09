class TweetsController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    @tweet = current_user.tweets.build(tweets_params)
    if @tweet.save
      flash[:success] = '投稿が完了しました'
      redirect_to request.referer || root_url
    else
      @feed_items = current_user.feed
      @replies = Tweet.where(reply_id: @feed_items)
      render 'static_pages/home'
    end
  end

  def destroy
    @tweet.destroy
    flash[:success] = '投稿が削除されました'
    redirect_to request.referer || root_url
  end

  private

    def tweets_params
      params.require(:tweet).permit(:content, :reply_id)
    end

    def correct_user
      @tweet = current_user.tweets.find_by(id: params[:id])
      redirect_to root_url if @tweet.nil?
    end
end
