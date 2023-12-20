module Api
  module V1
    class MembershipsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def show
        # 全てのコミュニティ参加者情報
        @community = Community.find(params[:community_id])
        @members = @community.joined_members
        # ページネーション情報（デフォルトは10件ずつの表示とする）
        @paginated_collection = paginated_collection(@members, 10)
        @pagination_info = pagination_info(@paginated_collection)

        render json: { users: @paginated_collection, pagination: @pagination_info }
      end

      def create
        membership = current_user.memberships.build(community_id: params[:community_id])
        membership.save
        @community = Community.find(params[:community_id])
        count = @community.memberships.size
        joined = @community.joined_by?(current_user)
        render json: { status: 'success', count: count, joined: joined }
      end

      def destroy
        @membership.destroy
        @community = Community.find(params[:community_id])
        count = @community.memberships.size
        joined = @community.joined_by?(current_user)
        render json: { status: 'success', count: count, joined: joined }
      end

      private

        def correct_user
          @membership = current_user.memberships.find_by(community_id: params[:community_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @membership.nil?
        end
    end
  end
end
