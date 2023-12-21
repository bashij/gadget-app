module Api
  module V1
    class TweetLikesController < ApplicationController
      before_action :logged_in_user
      before_action :correct_user, only: :destroy
      before_action :load_resource

      def create
        like = current_user.tweet_likes.build(tweet_id: params[:tweet_id])
        like.save

        render_tweet_likes_status
      end

      def destroy
        @like.destroy

        render_tweet_likes_status
      end

      private

        def correct_user
          @like = current_user.tweet_likes.find_by(tweet_id: params[:tweet_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @like.nil?
        end

        def load_resource
          @tweet = Tweet.find(params[:tweet_id])
        end

        def render_tweet_likes_status
          count = @tweet.tweet_likes.size
          liked = @tweet.liked_by?(current_user)

          render json: { status: 'success', count: count, liked: liked }
        end
    end
  end
end
