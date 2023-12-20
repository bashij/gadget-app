module Api
  module V1
    class ReviewRequestsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def show
        # 全てのレビューリクエストしているユーザー情報
        @gadget = Gadget.find(params[:gadget_id])
        @users = @gadget.requesting_users
        # ページネーション情報（デフォルトは10件ずつの表示とする）
        @paginated_collection = paginated_collection(@users, 10)
        @pagination_info = pagination_info(@paginated_collection)

        render json: { users: @paginated_collection, pagination: @pagination_info }
      end

      def create
        review_request = current_user.review_requests.build(gadget_id: params[:gadget_id])
        review_request.save
        @gadget = Gadget.find(params[:gadget_id])
        count = @gadget.requesting_users.size
        requested = @gadget.requested_by?(current_user)
        render json: { status: 'success', count: count, requested: requested }
      end

      def destroy
        @review_request.destroy
        @gadget = Gadget.find(params[:gadget_id])
        count = @gadget.requesting_users.size
        requested = @gadget.requested_by?(current_user)
        render json: { status: 'success', count: count, requested: requested }
      end

      private

        def correct_user
          @review_request = current_user.review_requests.find_by(gadget_id: params[:gadget_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @review_request.nil?
        end
    end
  end
end
