class StaticPagesController < ApplicationController
  def home
    return unless logged_in?

    @tweet = current_user.tweets.build
    @feed_items = current_user.feed
  end

  def about
  end
end
