module Api
  module V1
    class UsersController < ApplicationController
      include Pagination
      before_action :logged_in_user, only: %i[edit update destroy]
      before_action :correct_user,   only: %i[edit update destroy]
    
      def index
        # 全てのユーザー情報
        @users = User.order(created_at: :desc)
        # ユーザーのページネーション情報（デフォルトは5件ずつの表示とする）
        paged = params[:paged]
        per = params[:per].present? ? params[:per] : 5
        @users_paginated = @users.page(paged).per(per)
        @pagination = pagination(@users_paginated)

        render json: { users: @users_paginated, pagination: @pagination }
      end

      def show
        # 表示対象ユーザー
        @user = User.includes(:tweets).find(params[:id])
        # 自身のツイート、ブックマークしたツイート
        @tweets = Tweet.own_tweet(@user, params[:own_tweets_page])
        @tweet_bookmarks = @user.show_bookmark_tweets(params[:bookmark_tweets_page])
        # ツイート、リプライフォーム
        @tweet = logged_in? ? current_user.tweets.build : User.new.tweets.build
        @tweet_reply = @tweet
        # リプライ
        parent_ids = @tweets.ids + @tweet_bookmarks.ids
        @replies = Tweet.find_all_replies(parent_id: parent_ids)
        @reply_count = Tweet.reply_count
        # 自身のガジェット、ブックマークしたガジェット
        @feed_gadgets = Gadget.own_gadget(@user, params[:gadgets_page])
        @gadget_bookmarks = @user.show_bookmark_gadgets(params[:bookmark_gadgets_page])
        # 参加中のコミュニティ
        @communities = @user.joining_communities.includes(:user, :memberships).page(params[:communities_page])
    
        respond_to do |format|
          format.html
          format.js
        end
      end
    
      def new
        @title = 'ユーザー登録'
        @user = User.new
      end
    
      def create
        @user = User.new(user_params)
        if @user.save
          log_in @user
          flash[:welcome] = t 'users.create.flash.success'
          redirect_to root_url
        else
          @title = 'ユーザー登録'
          render 'new'
        end
      end
    
      def edit
        @title = 'ユーザー情報編集'
      end
    
      def update
        if @user.update(user_params)
          flash[:success] = t 'users.update.flash.success'
          redirect_to @user
        else
          @title = 'ユーザー情報編集'
          render 'edit'
        end
      end
    
      def destroy
        User.find(params[:id]).destroy
        flash[:success] = t 'users.destroy.flash.success'
        redirect_to root_url
      end
    
      def following
        @title = 'フォロー'
        @user  = User.find(params[:id])
        @users = @user.following.page(params[:users_page]).per(10)
        respond_to do |format|
          format.html { render 'show_follow' }
          format.js
        end
      end
    
      def followers
        @title = 'フォロワー'
        @user  = User.find(params[:id])
        @users = @user.followers.page(params[:users_page]).per(10)
        respond_to do |format|
          format.html { render 'show_follow' }
          format.js
        end
      end
    
      private
    
        def user_params
          params.require(:user).permit(:name, :email, :job, :image, :password, :password_confirmation)
        end
    
        # 正しいユーザーかどうか確認
        def correct_user
          @user = User.find(params[:id])
          redirect_to(root_url) unless current_user?(@user)
        end
    end    
  end
end
