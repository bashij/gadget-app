module Api
  module V1
    class CommunitiesController < ApplicationController
      before_action :logged_in_user, only: %i[create update destroy]
      before_action :correct_user,   only: %i[update destroy]

      def index
        # 全てのコミュニティ情報
        @communities = Community.order(created_at: :desc)

        render_communities_json
      end

      def user_communities
        # 特定のユーザーが参加しているコミュニティ情報
        user = User.find(params[:id])
        @communities = user.joining_communities_reordered

        render_communities_json
      end

      def show
        @community = Community.find(params[:id])
        render json: { community: @community }, include: %i[user memberships]
      end

      def create
        @community = current_user.communities.build(communities_params)
        if @community.save
          message = [I18n.t('communities.create.flash.success')]
          render json: { status: 'success', message: message, id: @community.id }
        else
          message = @community.errors.full_messages
          render json: { status: 'failure', message: message, id: @community.id }
        end
      end

      def update
        if @community.update(communities_params)
          message = [I18n.t('communities.update.flash.success')]
          render json: { status: 'success', message: message, id: @community.id }
        else
          message = @community.errors.full_messages
          render json: { status: 'failure', message: message, id: @community.id }
        end
      end

      def destroy
        @community.destroy
        message = [I18n.t('communities.destroy.flash.success')]
        render json: { status: 'success', message: message }
      end

      private

        def communities_params
          params.require(:community).permit(:name, :image)
        end

        def correct_user
          @community = current_user.communities.find_by(id: params[:id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @community.nil?
        end

        def render_communities_json
          paginate_communities

          render json: {
            communities: @paginated_collection,
            pagination: @pagination_info
          }, include: %i[user memberships]
        end
  
        # コミュニティのページネーション情報を取得（デフォルトは10件ずつの表示とする）
        def paginate_communities(limit_value = 10)
          @paginated_collection = paginated_collection(@communities, limit_value)
          @pagination_info = pagination_info(@paginated_collection)
        end
    end
  end
end
