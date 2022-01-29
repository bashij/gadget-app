class StaticPagesController < ApplicationController
  def home
    return unless logged_in?

    @tweet = current_user.tweets.build
    @feed_tweets = current_user.tweet_feed.includes(:user, :tweet_likes, :tweet_bookmarks)
    @replies = Tweet.where(reply_id: @feed_tweets)
    @feed_gadgets = current_user.gadget_feed.includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
    @communities = Community.includes(:user).all
  end

  def about
  end
end
