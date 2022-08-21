class TweetsController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    @tweet = current_user.tweets.build(tweets_params)
    @tweet.save
    @reply_count = Tweet.group(:parent_id).reorder(nil).count
    if @tweet.parent_id.nil?
      @replies = []
      @parent_tweet = []
    else
      @replies = Tweet.where(parent_id: tweets_params[:parent_id])
      @parent_tweet = Tweet.find(@tweet.parent_id)
    end

    @tweet_reply_form = current_user.tweets.build
  end

  def destroy
    # ツイートに対するリプライを全て削除
    @replies = Tweet.where(parent_id: @tweet.id)
    @replies.each(&:destroy)
    # ツイートを削除
    @tweet.destroy

    @parent_tweet = if @tweet.parent_id.nil?
                      []
                    else
                      Tweet.find(@tweet.parent_id)
                    end
    @reply_count = Tweet.group(:parent_id).reorder(nil).count
  end

  private

    def tweets_params
      params.require(:tweet).permit(:content, :parent_id)
    end

    def correct_user
      @tweet = current_user.tweets.find_by(id: params[:id])
      redirect_to root_url if @tweet.nil?
    end
end
