module Api
  module V1
    class CommentsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user, only: :destroy

      def index
        # ガジェットへの全てのコメント情報
        @gadget = Gadget.find(params[:gadget_id])
        @comments = @gadget.comments.where(parent_id: nil).order(created_at: :desc)
        # ページネーション情報（デフォルトは10件ずつの表示とする）
        paged = params[:paged]
        per = params[:per].present? ? params[:per] : 10
        @comments_paginated = @comments.page(paged).per(per)
        @pagination = pagination(@comments_paginated)
        # 全コメントのリプライ件数情報
        @reply_counts = Comment.reply_count
        ids = @comments_paginated.pluck(:id)
        @replies = Comment.where(parent_id: ids)

        render json: { comments: @comments_paginated, pagination: @pagination, replies: @replies, replyCounts: @reply_counts }, include: [:user]
      end

      def create
        # 表示対象ガジェット
        @gadget = Gadget.find(params[:gadget_id])
        # 入力されたコメント
        @comment = current_user.comments.build(gadget_id: params[:gadget_id],
                                              content: params[:comment][:content],
                                              parent_id: params[:comment][:parent_id])
        if @comment.save
          # 親コメント
          @parent_comment = Comment.find_parent(@comment.parent_id)
          # 親コメントへのリプライ件数
          @reply_count = Comment.where(parent_id: @comment.parent_id).count
          
          message = @comment.parent_id ? ['リプライが投稿されました'] : ['コメントが投稿されました']
          render json: { status: 'success', message: message, comment: @comment, replyCount: @reply_count }, include: [:user, :gadget]
        else
          message = @comment.errors.full_messages
          render json: { status: 'failure', message: message, comment: @comment}
        end
      end

      def destroy
        # コメントに対するリプライを全て削除
        @replies = Comment.where(parent_id: @comment.id)
        @replies.each(&:destroy)
        # コメントを削除
        @comment.destroy
        # 親コメントへのリプライ件数
        @reply_count = Comment.where(parent_id: @comment.parent_id).count

        message = @comment.parent_id ? ['リプライが削除されました'] : ['コメントが削除されました']
        render json: { status: 'success', message: message, replyCount: @reply_count }
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
  end
end
