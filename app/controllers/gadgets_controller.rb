class GadgetsController < ApplicationController
  before_action :logged_in_user, only: %i[new create edit update destroy]
  before_action :correct_user,   only: %i[edit update destroy]

  def show
    # 表示対象ガジェット
    @gadget = Gadget.find(params[:id])
    # コメント、リプライフォーム
    @comment = logged_in? ? current_user.comments.build : User.new.comments.build
    @comment_reply = @comment
    # ガジェットへの親コメント
    parent_comments = @gadget.parent_comments
    @comments = Kaminari.paginate_array(parent_comments).page(params[:comments_page])
    # 親コメントへのリプライコメント
    @replies = Comment.where(parent_id: @comments)
    @reply_count = Comment.group(:parent_id).reorder(nil).count
    # ページネーション
    @comments_page_params = params[:comments_page]

    respond_to do |format|
      format.html
      format.js
    end
  end

  def new
    @title = 'ガジェット登録'
    @gadget = current_user.gadgets.build
  end

  def create
    @gadget = current_user.gadgets.build(gadgets_params)
    if @gadget.save
      flash[:success] = t 'gadgets.create.flash.success'
      redirect_to gadget_path(@gadget)
    else
      @title = 'ガジェット登録'
      render 'new'
    end
  end

  def edit
    @title = 'ガジェット編集'
  end

  def update
    if @gadget.update(gadgets_params)
      flash[:success] = t 'gadgets.update.flash.success'
      redirect_to gadget_path(@gadget)
    else
      @title = 'ガジェット編集'
      render 'edit'
    end
  end

  def destroy
    @user = @gadget.user
    @gadget.destroy
    flash[:success] = t 'gadgets.destroy.flash.success'
    redirect_to user_path(@user)
  end

  private

    def gadgets_params
      params.require(:gadget)
            .permit(:name, :category, :model_number, :manufacturer, :price, :other_info, :image, :review)
    end

    def correct_user
      @gadget = current_user.gadgets.find_by(id: params[:id])
      redirect_to root_url if @gadget.nil?
    end
end
