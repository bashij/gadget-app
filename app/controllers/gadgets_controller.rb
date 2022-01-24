class GadgetsController < ApplicationController
  before_action :logged_in_user, only: %i[new create edit update destroy]
  before_action :correct_user,   only: %i[edit update destroy]

  def show
    @gadget = Gadget.find(params[:id])
    @user = @gadget.user
    # @comment = Gadget.comments(予定)
  end

  def new
    @gadget = current_user.gadgets.build
  end

  def create
    @gadget = current_user.gadgets.build(gadgets_params)
    if @gadget.save
      flash[:success] = '登録が完了しました'
      redirect_to user_path(current_user)
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @gadget.update(gadgets_params)
      flash[:success] = '更新されました'
      redirect_to user_path(current_user) # showに返す場合：@gadget
    else
      render 'edit'
    end
  end

  def destroy
    @gadget.destroy
    flash[:success] = 'ガジェットが削除されました'
    redirect_to request.referer || root_url
  end

  private

    def gadgets_params
      params.require(:gadget).permit(:name, :category, :model_number, :manufacturer, :price, :other_info, :image)
    end

    def correct_user
      @gadget = current_user.gadgets.find_by(id: params[:id])
      redirect_to root_url if @gadget.nil?
    end
end
