module Api
  module V1
    class CommunitiesController < ApplicationController
      before_action :logged_in_user, only: %i[new create edit update destroy]
      before_action :correct_user,   only: %i[edit update destroy]

      def index
        # 全てのコミュニティ情報
        @communities = Community.order(created_at: :desc)
        # コミュニティのページネーション情報（デフォルトは10件ずつの表示とする）
        paged = params[:paged]
        per = params[:per].present? ? params[:per] : 10
        @communities_paginated = @communities.page(paged).per(per)
        @pagination = pagination(@communities_paginated)

        render json: { communities: @communities_paginated, pagination: @pagination }, include: [:user, :memberships]
      end

      def user_communities
        # 特定のユーザーが参加しているコミュニティ情報
        user = User.find(params[:id])
        @communities = user.joining_communities_reordered
        # コミュニティのページネーション情報（デフォルトは10件ずつの表示とする）
        paged = params[:paged]
        per = params[:per].present? ? params[:per] : 10
        @communities_paginated = @communities.page(paged).per(per)
        @pagination = pagination(@communities_paginated)

        render json: { communities: @communities_paginated, pagination: @pagination }, include: [:user, :memberships]
      end

      def show
        @community = Community.find(params[:id])
        render json: { community: @community }, include: [:user, :memberships]
      end

      def create
        @community = current_user.communities.build(communities_params)
        if @community.save
          message = [I18n.t('communities.create.flash.success')]
          render json: { status: 'success', message: message, id: @community.id}
        else
          message = @community.errors.full_messages
          render json: { status: 'failure', message: message, id: @community.id }
        end
      end

      def update
        if @community.update(communities_params)
          message = [I18n.t('communities.update.flash.success')]
          render json: { status: 'success', message: message, id: @community.id}
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
          redirect_to root_url if @community.nil?
        end
    end
  end
end
