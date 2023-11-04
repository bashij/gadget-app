module Api
  module V1
    class TweetLikesController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def create
        like = current_user.tweet_likes.build(tweet_id: params[:tweet_id])
        like.save
        @tweet = Tweet.find(params[:tweet_id])
        count = @tweet.tweet_likes.size
        liked = @tweet.liked_by?(current_user)
        render json: { status: 'success', count: count, liked: liked }
      end

      def destroy
        @like.destroy
        @tweet = Tweet.find(params[:tweet_id])
        count = @tweet.tweet_likes.size
        liked = @tweet.liked_by?(current_user)
        render json: { status: 'success', count: count, liked: liked }
      end

      private

        def correct_user
          @like = current_user.tweet_likes.find_by(tweet_id: params[:tweet_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @like.nil?
        end
    end
  end
end
