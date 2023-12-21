module Api
  module V1
    class TweetsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def index
        # 全てのツイート情報
        @tweets = Tweet.where(parent_id: nil).order(created_at: :desc)

        render_tweets_json
      end

      def user_tweets
        # 特定のユーザーが投稿しているツイート情報
        user = User.find(params[:id])
        @tweets = user.tweets.where(parent_id: nil).order(created_at: :desc)

        render_tweets_json
      end

      def user_bookmark_tweets
        # 特定のユーザーがブックマークしているツイート情報
        user = User.find(params[:id])
        @tweets = user.bookmarked_tweets_reordered

        render_tweets_json
      end

      def following_users_tweets
        # ログインユーザーがフォローしているユーザーのツイート情報
        user = User.find(params[:id])
        @tweets = user.following_users_tweets

        render_tweets_json
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
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @tweet.nil?
        end

        def render_tweets_json
          paginate_tweets
          fetch_replies_info

          render json: {
            tweets: @paginated_collection,
            pagination: @pagination_info,
            replies: @replies,
            replyCounts: @reply_counts
          }, include: %i[user tweet_likes tweet_bookmarks]
        end
  
        # ツイートのページネーション情報を取得（デフォルトは5件ずつの表示とする）
        def paginate_tweets(limit_value = 5)
          @paginated_collection = paginated_collection(@tweets, limit_value)
          @pagination_info = pagination_info(@paginated_collection)
        end
  
        # リプライ関連情報を取得
        def fetch_replies_info
          # 全ツイートのリプライ件数
          @reply_counts = Tweet.reply_count
          # 一覧ツイートへのリプライ
          ids = @paginated_collection.pluck(:id)
          @replies = Tweet.where(parent_id: ids)
        end
    end
  end
end
