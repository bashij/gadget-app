class CommentsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: :destroy

  def create
    # 表示対象ガジェット
    @gadget = Gadget.find(params[:gadget_id])
    # リプライフォーム
    @comment_reply = current_user.comments.build
    # 入力されたコメント
    @comment = current_user.comments.build(gadget_id: params[:gadget_id],
                                           content: params[:comment][:content],
                                           parent_id: params[:comment][:parent_id])
    @comment.save
    # 親コメント
    @parent_comment = Comment.find_parent(@comment.parent_id)
    # 親コメントへのリプライコメント
    @replies = Comment.find_all_replies(parent_id: comments_params[:parent_id])
    @reply_count = Comment.reply_count
  end

  def destroy
    # コメントに対するリプライを全て削除
    @replies = Comment.where(parent_id: @comment.id)
    @replies.each(&:destroy)
    # コメントを削除
    @comment.destroy
    # 親コメント
    @parent_comment = Comment.find_parent(@comment.parent_id)
    # 親コメントへのリプライコメント
    @reply_count = Comment.reply_count
  end

  private

    def comments_params
      params.require(:comment).permit(:content, :parent_id, :gadget_id)
    end

    def correct_user
      @comment = current_user.comments.find_by(id: params[:id])
      redirect_to root_url if @comment.nil?
    end
end
