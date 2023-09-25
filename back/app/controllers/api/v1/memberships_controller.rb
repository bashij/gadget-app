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
        paged = params[:paged]
        per = params[:per].presence || 10
        @members_paginated = @members.page(paged).per(per)
        @pagination = pagination(@members_paginated)

        render json: { users: @members_paginated, pagination: @pagination }
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
          render json: { status: 'failure', message: ['この操作は実行できません'] } if @membership.nil?
        end
    end
  end
end
