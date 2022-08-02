class UsersController < ApplicationController
  before_action :logged_in_user, only: %i[edit update destroy]
  before_action :correct_user,   only: %i[edit update destroy]

  def index
    @users = User.all.page(params[:users_page]).per(10)

    respond_to do |format|
      format.html
      format.js
    end
  end

  def show
    # ユーザー
    @user = User.includes(:tweets).find(params[:id])
    # ツイート
    @tweets = Tweet
              .includes(:tweet_likes, :tweet_bookmarks)
              .where(user_id: @user, reply_id: nil)
              .page(params[:own_tweets_page])
              .per(5)
    @tweet_bookmarks = @user.bookmarked_tweets
                            .includes(:tweet_likes, :tweet_bookmarks)
                            .reorder('tweet_bookmarks.created_at DESC')
                            .page(params[:bookmark_tweets_page]).per(5)
    # ツイートフォーム
    @tweet = if logged_in?
               current_user.tweets.build
             else
               User.new.tweets.build
             end
    @tweet_reply_form = @tweet # リプライフォーム作成用
    # リプライ
    parent_ids = @tweets.ids + @tweet_bookmarks.ids
    @replies = Tweet.includes(:tweet_likes, :tweet_bookmarks).where(reply_id: parent_ids)
    @reply_count = Tweet.group(:reply_id).reorder(nil).count
    # ガジェット
    @feed_gadgets = Gadget
                    .includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
                    .where(user_id: @user)
                    .page(params[:gadgets_page])
                    .per(5)
    @gadget_bookmarks = @user.bookmarked_gadgets
                             .includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
                             .reorder('gadget_bookmarks.created_at DESC')
                             .page(params[:bookmark_gadgets_page]).per(5)
    # コミュニティ
    @communities = @user.joining_communities.includes(:user, :memberships).page(params[:communities_page]).per(5)

    respond_to do |format|
      format.html
      format.js
    end
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      flash[:success] = t 'users.create.flash.success'
      redirect_to root_url
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @user.update(user_params)
      flash[:success] = t 'users.update.flash.success'
      redirect_to @user
    else
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

    # beforeアクション

    # 正しいユーザーかどうか確認
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end
end
