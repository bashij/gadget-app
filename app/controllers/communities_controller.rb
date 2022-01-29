class CommunitiesController < ApplicationController
  before_action :logged_in_user, only: %i[new create edit update destroy]
  before_action :correct_user,   only: %i[edit update destroy]

  def new
    @community = current_user.communities.build
  end

  def create
    @community = current_user.communities.build(communities_params)
    if @community.save
      flash[:success] = '作成が完了しました'
      redirect_to root_url
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @community.update(communities_params)
      flash[:success] = '更新されました'
      redirect_to root_url
    else
      render 'edit'
    end
  end

  def destroy
    @community.destroy
    flash[:success] = 'コミュニティが削除されました'
    redirect_to request.referer || root_url
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
