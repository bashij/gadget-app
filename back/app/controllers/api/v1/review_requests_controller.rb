module Api
  module V1
    class ReviewRequestsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy
      before_action :load_resource

      def show
        # 全てのレビューリクエストしているユーザー情報
        @users = @gadget.requesting_users

        render_users_json
      end

      def create
        review_request = current_user.review_requests.build(gadget_id: params[:gadget_id])
        review_request.save

        render_requesting_users_status
      end

      def destroy
        @review_request.destroy

        render_requesting_users_status
      end

      private

        def correct_user
          @review_request = current_user.review_requests.find_by(gadget_id: params[:gadget_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @review_request.nil?
        end

        def load_resource
          @gadget = Gadget.find(params[:gadget_id])
        end

        def render_users_json
          paginate_users

          render json: { users: @paginated_collection, pagination: @pagination_info }
        end

        # レビューリクエストユーザーのページネーション情報を取得（デフォルトは10件ずつの表示とする）
        def paginate_users(limit_value = 10)
          @paginated_collection = paginated_collection(@users, limit_value)
          @pagination_info = pagination_info(@paginated_collection)
        end

        def render_requesting_users_status
          count = @gadget.requesting_users.size
          requested = @gadget.requested_by?(current_user)

          render json: { status: 'success', count: count, requested: requested }
        end
    end
  end
end
