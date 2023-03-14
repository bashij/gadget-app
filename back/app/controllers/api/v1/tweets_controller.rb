module Api
  module V1
    class TweetsController < ApplicationController
      include Pagination
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def create
        # 入力されたツイート
        @tweet = current_user.tweets.build(tweets_params)
        if @tweet.save
          # 親ツイート
          @parent_tweet = Tweet.find_parent(@tweet.parent_id)
          # 親ツイートへのリプライ件数
          @reply_count = Tweet.where(parent_id: @tweet.parent_id).count
          
          message = ['']
          render json: { status: 'success', message: message, tweet: @tweet, replyCount: @reply_count }, include: [:user, :tweet_likes, :tweet_bookmarks]
        else
          message = @tweet.errors.full_messages
          render json: { status: 'failure', message: message, tweet: @tweet}
        end
      end

      def destroy
        # ツイートに対するリプライを全て削除
        @replies = Tweet.where(parent_id: @tweet.id)
        @replies.each(&:destroy)
        # ツイートを削除
        @tweet.destroy
        # 親ツイートへのリプライ件数
        @reply_count = Tweet.where(parent_id: @tweet.parent_id).count
        
        render json: { status: 'success', replyCount: @reply_count }
      end

      def index
        # 全てのユーザー情報
        @tweets = Tweet.where(parent_id: nil).order(created_at: :desc)
        # ツイートのページネーション情報（デフォルトは5件ずつの表示とする）
        paged = params[:paged]
        per = params[:per].present? ? params[:per] : 5
        @tweets_paginated = @tweets.page(paged).per(per)
        @pagination = pagination(@tweets_paginated)
        # 全ツイートのリプライ件数情報
        @reply_counts = Tweet.reply_count
        ids = @tweets_paginated.pluck(:id)
        @replies = Tweet.where(parent_id: ids)

        render json: { tweets: @tweets_paginated, pagination: @pagination, replies: @replies, replyCounts: @reply_counts }, include: [:user, :tweet_likes, :tweet_bookmarks]
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
  end
end