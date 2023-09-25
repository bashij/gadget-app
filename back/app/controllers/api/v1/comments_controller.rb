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
        per = params[:per].presence || 10
        @comments_paginated = @comments.page(paged).per(per)
        @pagination = pagination(@comments_paginated)
        # 全コメントのリプライ件数情報
        @reply_counts = Comment.reply_count
        ids = @comments_paginated.pluck(:id)
        @replies = Comment.where(parent_id: ids)

        render json: {
          comments: @comments_paginated,
          pagination: @pagination,
          replies: @replies,
          replyCounts: @reply_counts
        }, include: [:user]
      end

      def create
        # 入力されたコメント
        @comment = current_user.comments.build(gadget_id: params[:gadget_id],
                                               content: params[:comment][:content],
                                               parent_id: params[:comment][:parent_id])
        if @comment.save
          message = [I18n.t('comments.create.flash.success')]
          render json: { status: 'success', message: message }
        else
          message = @comment.errors.full_messages
          render json: { status: 'failure', message: message }
        end
      end

      def destroy
        # コメントに対するリプライを全て削除
        @replies = Comment.where(parent_id: @comment.id)
        @replies.each(&:destroy)
        # コメントを削除
        @comment.destroy

        message = [I18n.t('comments.destroy.flash.success')]
        render json: { status: 'success', message: message }
      end

      private

        def comments_params
          params.require(:comment).permit(:content, :parent_id, :gadget_id)
        end

        def correct_user
          @comment = current_user.comments.find_by(id: params[:id])
          render json: { status: 'failure', message: ['この操作は実行できません'] } if @comment.nil?
        end
    end
  end
end
