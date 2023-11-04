module Api
  module V1
    class TweetBookmarksController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def create
        bookmark = current_user.tweet_bookmarks.build(tweet_id: params[:tweet_id])
        bookmark.save
        @tweet = Tweet.find(params[:tweet_id])
        count = @tweet.tweet_bookmarks.size
        bookmarked = @tweet.bookmarked_by?(current_user)
        render json: { status: 'success', count: count, bookmarked: bookmarked }
      end

      def destroy
        @bookmark.destroy
        @tweet = Tweet.find(params[:tweet_id])
        count = @tweet.tweet_bookmarks.size
        bookmarked = @tweet.bookmarked_by?(current_user)
        render json: { status: 'success', count: count, bookmarked: bookmarked }
      end

      private

        def correct_user
          @bookmark = current_user.tweet_bookmarks.find_by(tweet_id: params[:tweet_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @bookmark.nil?
        end
    end
  end
end
