class UsersController < ApplicationController
  before_action :logged_in_user, only: %i[index edit update destroy following followers]
  before_action :correct_user,   only: %i[edit update destroy]

  def index
    @users = User.all
  end

  def show
    @user = User.includes(:tweets).find(params[:id])
    @tweets = Tweet.includes(:tweet_likes, :tweet_bookmarks).where(user_id: @user)
    @tweet_bookmarks = @user.bookmarked_tweets
                            .includes(:tweet_likes, :tweet_bookmarks)
                            .reorder('tweet_bookmarks.created_at DESC')
    @replies = Tweet.where(reply_id: @tweets)
    @tweet = current_user.tweets.build
    @gadgets = Gadget.includes(:user, :gadget_likes, :gadget_bookmarks).where(user_id: @user)
    @gadget_bookmarks = @user.bookmarked_gadgets
                             .includes(:user, :gadget_likes, :gadget_bookmarks)
                             .reorder('gadget_bookmarks.created_at DESC')
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      flash[:success] = 'Gadget-appへようこそ！'
      redirect_to @user
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @user.update(user_params)
      flash[:success] = '更新されました'
      redirect_to @user
    else
      render 'edit'
    end
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = '退会処理が完了しました。ご利用ありがとうございました。'
    redirect_to root_url
  end

  def following
    @title = 'フォロー'
    @user  = User.find(params[:id])
    @users = @user.following
    render 'show_follow'
  end

  def followers
    @title = 'フォロワー'
    @user  = User.find(params[:id])
    @users = @user.followers
    render 'show_follow'
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :image, :password, :password_confirmation)
    end

    # beforeアクション

    # 正しいユーザーかどうか確認
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end
end
