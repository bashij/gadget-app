module Api
  module V1
    class GadgetLikesController < ApplicationController
      before_action :logged_in_user
      before_action :correct_user, only: :destroy
      before_action :load_resource

      def create
        like = current_user.gadget_likes.build(gadget_id: params[:gadget_id])
        like.save

        render_gadget_likes_status
      end

      def destroy
        @like.destroy

        render_gadget_likes_status
      end

      private

        def correct_user
          @like = current_user.gadget_likes.find_by(gadget_id: params[:gadget_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @like.nil?
        end

        def load_resource
          @gadget = Gadget.find(params[:gadget_id])
        end

        def render_gadget_likes_status
          count = @gadget.gadget_likes.size
          liked = @gadget.liked_by?(current_user)

          render json: { status: 'success', count: count, liked: liked }
        end
    end
  end
end
