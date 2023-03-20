module Api
  module V1
    class MembershipsController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

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
          redirect_to root_url if @membership.nil?
        end
    end
  end
end
