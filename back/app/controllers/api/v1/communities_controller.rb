class CommunitiesController < ApplicationController
  before_action :logged_in_user, only: %i[new create edit update destroy]
  before_action :correct_user,   only: %i[edit update destroy]

  def show
    @community = Community.find(params[:id])
    @users = @community.joined_members.page(params[:users_page]).per(10)
    respond_to do |format|
      format.html
      format.js
    end
  end

  def new
    @title = 'コミュニティ登録'
    @community = current_user.communities.build
  end

  def create
    @community = current_user.communities.build(communities_params)
    if @community.save
      flash[:success] = t 'communities.create.flash.success'
      redirect_to community_path(@community)
    else
      @title = 'コミュニティ登録'
      render 'new'
    end
  end

  def edit
    @title = 'コミュニティ編集'
  end

  def update
    if @community.update(communities_params)
      flash[:success] = t 'communities.update.flash.success'
      redirect_to community_url(params[:id])
    else
      @title = 'コミュニティ編集'
      render 'edit'
    end
  end

  def destroy
    @community.destroy
    flash[:success] = t 'communities.destroy.flash.success'
    redirect_to root_url
  end

  private

    def communities_params
      params.require(:community).permit(:name, :image)
    end

    def correct_user
      @community = current_user.communities.find_by(id: params[:id])
      redirect_to root_url if @community.nil?
    end
end
