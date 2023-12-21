module Api
  module V1
    class CommentsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user, only: :destroy

      def index
        # ガジェットへの全てのコメント情報
        @gadget = Gadget.find(params[:gadget_id])
        @comments = @gadget.comments.where(parent_id: nil).order(created_at: :desc)

        render_comments_json
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
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @comment.nil?
        end

        def render_comments_json
          paginate_comments
          fetch_replies_info

          render json: {
            comments: @paginated_collection,
            pagination: @pagination_info,
            replies: @replies,
            replyCounts: @reply_counts
          }, include: [:user]
        end
  
        # コメントのページネーション情報を取得（デフォルトは10件ずつの表示とする）
        def paginate_comments(limit_value = 10)
          @paginated_collection = paginated_collection(@comments, limit_value)
          @pagination_info = pagination_info(@paginated_collection)
        end
  
        # リプライ関連情報を取得
        def fetch_replies_info
          # 全コメントのリプライ件数
          @reply_counts = Comment.reply_count
          # 一覧コメントへのリプライ
          ids = @paginated_collection.pluck(:id)
          @replies = Comment.where(parent_id: ids)
        end
    end
  end
end
