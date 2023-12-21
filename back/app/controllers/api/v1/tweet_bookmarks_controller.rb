module Api
  module V1
    class TweetBookmarksController < ApplicationController
      before_action :logged_in_user
      before_action :correct_user, only: :destroy
      before_action :load_resource

      def create
        bookmark = current_user.tweet_bookmarks.build(tweet_id: params[:tweet_id])
        bookmark.save

        render_tweet_bookmarks_status
      end

      def destroy
        @bookmark.destroy

        render_tweet_bookmarks_status
      end

      private

        def correct_user
          @bookmark = current_user.tweet_bookmarks.find_by(tweet_id: params[:tweet_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @bookmark.nil?
        end

        def load_resource
          @tweet = Tweet.find(params[:tweet_id])
        end

        def render_tweet_bookmarks_status
          count = @tweet.tweet_bookmarks.size
          bookmarked = @tweet.bookmarked_by?(current_user)

          render json: { status: 'success', count: count, bookmarked: bookmarked }
        end
    end
  end
end
