module Api
  module V1
    class RelationshipsController < ApplicationController
      before_action :logged_in_user
      before_action :correct_user, only: :destroy

      def create
        @user = User.find(params[:followed_id])
        current_user.follow(@user)

        render_relationship_status('create')
      end

      def destroy
        @user = @relationship.followed
        current_user.unfollow(@user)

        render_relationship_status('destroy')
      end

      private

        def correct_user
          @relationship = current_user.active_relationships.find_by(followed_id: params[:id])
          return unless @relationship.nil?

          message = ['フォローしていないユーザーのフォロー解除はできません']
          render json: { status: 'failure', message: message }
        end

        def render_relationship_status(action)
          count = @user.followers.size
          following = current_user.following?(@user)
          message = [I18n.t("relationships.#{action}.flash.success")]

          render json: { status: 'success', message: message, count: count, following: following }
        end
    end
  end
end
