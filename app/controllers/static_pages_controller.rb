class StaticPagesController < ApplicationController
  def home
    @title = 'HOME'
    @displayed_feed = ''

    # ツイート、リプライフォーム (ログイン状態に応じてフォームを切り替える。非ログイン時はダミーのフォームとする)
    @tweet = logged_in? ? current_user.tweets.build : User.new.tweets.build
    @tweet_reply = @tweet
    # ツイート
    # フォロー中のみ表示
    if params[:displayed_feed] == 'following_tweet' && logged_in?
      feed_tweets = current_user.tweet_feed
      @feed_tweets = Kaminari.paginate_array(feed_tweets).page(params[:tweets_page])
      @displayed_feed = params[:displayed_feed]
    else
      # 全てのユーザーを表示
      @feed_tweets = Tweet.where(parent_id: nil).page(params[:tweets_page])
      @displayed_feed = params[:displayed_feed] if params[:displayed_feed] == 'all_tweet'
    end
    # ガジェット
    # フォロー中のみ表示
    if params[:displayed_feed] == 'following_gadget' && logged_in?
      feed_gadgets = current_user.gadget_feed
      @feed_gadgets = Kaminari.paginate_array(feed_gadgets).page(params[:gadgets_page])
      @displayed_feed = params[:displayed_feed]
    else
      # 全てのユーザーを表示
      @feed_gadgets = Gadget.all.order(updated_at: :DESC).page(params[:gadgets_page])
      @displayed_feed = params[:displayed_feed] if params[:displayed_feed] == 'all_gadget'
    end
    # コミュニティ
    @communities = Community.includes(:user, :memberships).all.page(params[:communities_page])
    # リプライ
    ids = @feed_tweets.pluck(:id)
    @replies = Tweet.where(parent_id: ids)
    @reply_count = Tweet.reply_count
    # ページネーション
    @page_type = params[:page_type]
    @tweets_page_params = params[:tweets_page]

    respond_to do |format|
      format.html
      format.js
    end
  end

  def help
    @title = 'HELP'
  end
end
