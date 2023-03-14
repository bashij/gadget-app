class TweetsController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    # リプライフォーム
    @tweet_reply = current_user.tweets.build
    # 入力されたツイート
    @tweet = current_user.tweets.build(tweets_params)
    @tweet.save
    # 親ツイート
    @parent_tweet = Tweet.find_parent(@tweet.parent_id)
    # 親ツイートへのリプライツイート
    @replies = Tweet.find_all_replies(parent_id: tweets_params[:parent_id])
    @reply_count = Tweet.reply_count
  end

  def destroy
    # ツイートに対するリプライを全て削除
    @replies = Tweet.where(parent_id: @tweet.id)
    @replies.each(&:destroy)
    # ツイートを削除
    @tweet.destroy
    # 親ツイート
    @parent_tweet = Tweet.find_parent(@tweet.parent_id)
    # 親ツイートへのリプライツイート
    @reply_count = Tweet.reply_count
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
