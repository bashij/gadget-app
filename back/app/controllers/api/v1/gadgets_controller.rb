module Api
  module V1
    class GadgetsController < ApplicationController
      before_action :logged_in_user, only: %i[create update destroy]
      before_action :correct_user,   only: %i[update destroy]

      def index
        # 全てのガジェット情報(検索条件があれば一致するもののみ)
        @gadgets = Gadget.filter_by(params)

        render_gadgets_json
      end

      def user_gadgets
        # 特定のユーザーが登録しているガジェット情報
        user = User.find(params[:id])
        @gadgets = user.gadgets.order(updated_at: :desc)

        render_gadgets_json(include_search_result_count: false)
      end

      def user_bookmark_gadgets
        # 特定のユーザーがブックマークしているガジェット情報
        user = User.find(params[:id])
        @gadgets = user.bookmarked_gadgets_reordered

        render_gadgets_json(include_search_result_count: false)
      end

      def following_users_gadgets
        # ログインユーザーがフォローしているユーザーのガジェット情報(検索条件があれば一致するもののみ)
        user = User.find(params[:id])
        @gadgets = user.following_users_gadgets(params)

        render_gadgets_json
      end

      def recommend
        # ログインユーザーへのおすすめガジェット情報(検索条件があれば一致するもののみ)
        @gadgets = Gadget.recommend_gadgets(User.find(params[:id])).filter_by(params)

        render_gadgets_json(limit_value: 2)
      end

      def show
        @gadget = Gadget.find(params[:id])
        render json: { gadget: @gadget },
               include: %i[user comments review_requests gadget_likes gadget_bookmarks]
      end

      def create
        @gadget = current_user.gadgets.build(gadgets_params)
        if @gadget.save
          message = [I18n.t('gadgets.create.flash.success')]
          render json: { status: 'success', message: message, id: @gadget.id }
        else
          message = @gadget.errors.full_messages
          render json: { status: 'failure', message: message, id: @gadget.id }
        end
      end

      def update
        if @gadget.update(gadgets_params)
          message = [I18n.t('gadgets.update.flash.success')]
          render json: { status: 'success', message: message, id: @gadget.id }
        else
          message = @gadget.errors.full_messages
          render json: { status: 'failure', message: message, id: @gadget.id }
        end
      end

      def destroy
        @gadget.destroy
        message = [I18n.t('gadgets.destroy.flash.success')]
        render json: { status: 'success', message: message, isPageDeleted: true }
      end

      private

        def gadgets_params
          params.require(:gadget)
                .permit(:name, :category, :model_number, :manufacturer, :price, :other_info, :image, :review)
        end

        def correct_user
          @gadget = current_user.gadgets.find_by(id: params[:id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @gadget.nil?
        end

        def render_gadgets_json(include_search_result_count: true, limit_value: 5)
          paginate_gadgets(limit_value)

          response_data = {
            gadgets: @paginated_collection,
            pagination: @pagination_info
          }

          response_data[:searchResultCount] = @gadgets.count if include_search_result_count

          render json: response_data,
                 include: %i[user gadget_likes gadget_bookmarks review_requests]
        end

        # ガジェットのページネーション情報（デフォルトは5件ずつの表示とする）
        def paginate_gadgets(limit_value)
          @paginated_collection = paginated_collection(@gadgets, limit_value)
          @pagination_info = pagination_info(@paginated_collection)
        end
    end
  end
end
