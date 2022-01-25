class CommentsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: :destroy

  def create
    @comment = current_user.comments.build(gadget_id: params[:gadget_id], content: params[:comment][:content])
    if @comment.save
      flash[:success] = 'コメントが完了しました'
      redirect_to request.referer || gadget_path(params[:gadget_id])
    else
      redirect_to request.referer || gadget_path(params[:gadget_id]), flash: { error: @comment.errors.full_messages }
    end
  end

  def destroy
    @comment.destroy
    flash[:success] = 'コメントを削除しました'
    redirect_to request.referer || rgadget_path(params[:gadget_id])
  end

  private

    def comments_params
      params.require(:comment).permit(:content)
    end

    def correct_user
      @comment = current_user.comments.find_by(id: params[:id])
      redirect_to root_url if @comment.nil?
    end
end
