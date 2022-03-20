class StaticPagesController < ApplicationController
  def home
    @displayed_feed = ''
    # ログイン状態に応じてフォームを切り替える
    @tweet = if logged_in?
               current_user.tweets.build
             else
               User.new.tweets.build # 非ログイン時はダミーのフォームとする
             end
    @tweet_reply_form = @tweet
    # ツイート
    # フォロー中のみ表示
    if params[:displayed_feed] == 'following_tweet' && logged_in?
      feed_tweets = current_user.tweet_feed.includes(:user, :tweet_likes, :tweet_bookmarks)
      @feed_tweets = Kaminari.paginate_array(feed_tweets).page(params[:tweets_page]).per(5)
      @displayed_feed = params[:displayed_feed]
    else
      # 全てのユーザーを表示
      @feed_tweets = Tweet.where(reply_id: nil).page(params[:tweets_page]).per(5)
      @displayed_feed = params[:displayed_feed] if params[:displayed_feed] == 'all_tweet'
    end
    # ガジェット
    # フォロー中のみ表示
    if params[:displayed_feed] == 'following_gadget' && logged_in?
      feed_gadgets = current_user.gadget_feed.includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
      @feed_gadgets = Kaminari.paginate_array(feed_gadgets).page(params[:gadgets_page]).per(5)
      @displayed_feed = params[:displayed_feed]
    else
      # 全てのユーザーを表示
      @feed_gadgets = Gadget.all.order(updated_at: :DESC).page(params[:gadgets_page]).per(5)
      @displayed_feed = params[:displayed_feed] if params[:displayed_feed] == 'all_gadget'
    end
    # コミュニティ
    @communities = Community.includes(:user, :memberships).all.page(params[:communities_page]).per(5)
    # リプライ
    ids = @feed_tweets.pluck(:id)
    @replies = Tweet.where(reply_id: ids)
    @reply_count = Tweet.group(:reply_id).reorder(nil).count
    # ページネーション
    @page_type = params[:page_type]
    @tweets_page_params = params[:tweets_page]

    respond_to do |format|
      format.html
      format.js
    end
  end

  def about
  end
end
