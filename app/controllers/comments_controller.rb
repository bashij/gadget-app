class CommentsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: :destroy

  def create
    @gadget = Gadget.find(params[:gadget_id])
    @comment = current_user.comments.build(gadget_id: params[:gadget_id],
                                           content: params[:comment][:content],
                                           reply_id: params[:comment][:reply_id])
    @comment.save
    @reply_count = Comment.group(:reply_id).reorder(nil).count
    if @comment.reply_id.nil?
      @replies = []
      @parent_comment = []
    else
      @replies = Comment.where(reply_id: comments_params[:reply_id])
      @parent_comment = Comment.find(@comment.reply_id)
    end
    @comment_reply_form = current_user.comments.build
  end

  def destroy
    # コメントに対するリプライを全て削除
    @replies = Comment.where(reply_id: @comment.id)
    @replies.each(&:destroy)
    # コメントを削除
    @comment.destroy

    @parent_comment = if @comment.reply_id.nil?
                        []
                      else
                        Comment.find(@comment.reply_id)
                      end
    @reply_count = Comment.group(:reply_id).reorder(nil).count
  end

  private

    def comments_params
      params.require(:comment).permit(:content, :reply_id)
    end

    def correct_user
      @comment = current_user.comments.find_by(id: params[:id])
      redirect_to root_url if @comment.nil?
    end
end
