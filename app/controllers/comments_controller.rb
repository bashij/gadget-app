class CommentsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: :destroy

  def create
    @gadget = Gadget.find(params[:gadget_id])
    @comment = current_user.comments.build(gadget_id: params[:gadget_id],
                                           content: params[:comment][:content],
                                           parent_id: params[:comment][:parent_id])
    @comment.save
    @reply_count = Comment.group(:parent_id).reorder(nil).count
    if @comment.parent_id.nil?
      @replies = []
      @parent_comment = []
    else
      @replies = Comment.where(parent_id: comments_params[:parent_id])
      @parent_comment = Comment.find(@comment.parent_id)
    end
    @comment_reply_form = current_user.comments.build
  end

  def destroy
    # コメントに対するリプライを全て削除
    @replies = Comment.where(parent_id: @comment.id)
    @replies.each(&:destroy)
    # コメントを削除
    @comment.destroy

    @parent_comment = if @comment.parent_id.nil?
                        []
                      else
                        Comment.find(@comment.parent_id)
                      end
    @reply_count = Comment.group(:parent_id).reorder(nil).count
  end

  private

    def comments_params
      params.require(:comment).permit(:content, :parent_id)
    end

    def correct_user
      @comment = current_user.comments.find_by(id: params[:id])
      redirect_to root_url if @comment.nil?
    end
end
