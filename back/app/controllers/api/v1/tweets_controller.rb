module Api
  module V1
    class TweetsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def index
        # 全てのツイート情報
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

      def user_tweets
        # 特定のユーザーが投稿しているツイート情報
        user = User.find(params[:id])
        @tweets = user.tweets.where(parent_id: nil).order(created_at: :desc)
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

      def user_bookmark_tweets
        # 特定のユーザーがブックマークしているツイート情報
        user = User.find(params[:id])
        @tweets = user.bookmarked_tweets_reordered
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

      def following_users_tweets
        # ログインユーザーがフォローしているユーザーのツイート情報
        user = User.find(params[:id])
        @tweets = user.following_users_tweets
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

      def create
        # 入力されたツイート
        @tweet = current_user.tweets.build(tweets_params)
        if @tweet.save
          message = [I18n.t('tweets.create.flash.success')]
          render json: { status: 'success', message: message }
        else
          message = @tweet.errors.full_messages
          render json: { status: 'failure', message: message }
        end
      end

      def destroy
        # ツイートに対するリプライを全て削除
        @replies = Tweet.where(parent_id: @tweet.id)
        @replies.each(&:destroy)
        # ツイートを削除
        @tweet.destroy
        
        message = [I18n.t('tweets.destroy.flash.success')]
        render json: { status: 'success', message: message }
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