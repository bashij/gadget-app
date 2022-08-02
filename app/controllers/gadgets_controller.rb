class GadgetsController < ApplicationController
  before_action :logged_in_user, only: %i[new create edit update destroy]
  before_action :correct_user,   only: %i[edit update destroy]

  def show
    @comment = if logged_in?
                 current_user.comments.build
               else
                 User.new.comments.build
               end

    @gadget = Gadget.find(params[:id])
    @user = @gadget.user
    comments = @gadget.comments.where(reply_id: nil).includes(:user)
    @comments = Kaminari.paginate_array(comments).page(params[:comments_page]).per(5)
    @comment_reply_form = @comment
    @replies = Comment.where(reply_id: @comments)
    @reply_count = Comment.group(:reply_id).reorder(nil).count

    # ページネーション
    @comments_page_params = params[:comments_page]

    respond_to do |format|
      format.html
      format.js
    end
  end

  def new
    @gadget = current_user.gadgets.build
  end

  def create
    @gadget = current_user.gadgets.build(gadgets_params)
    if @gadget.save
      flash[:success] = t 'gadgets.create.flash.success'
      redirect_to gadget_path(@gadget)
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @gadget.update(gadgets_params)
      flash[:success] = t 'gadgets.update.flash.success'
      redirect_to gadget_path(@gadget)
    else
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
