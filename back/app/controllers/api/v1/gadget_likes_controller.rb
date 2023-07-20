module Api
  module V1
    class GadgetLikesController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def create
        like = current_user.gadget_likes.build(gadget_id: params[:gadget_id])
        like.save
        @gadget = Gadget.find(params[:gadget_id])
        count = @gadget.gadget_likes.size
        liked = @gadget.liked_by?(current_user)
        render json: { status: 'success', count: count, liked: liked }
      end

      def destroy
        @like.destroy
        @gadget = Gadget.find(params[:gadget_id])
        count = @gadget.gadget_likes.size
        liked = @gadget.liked_by?(current_user)
        render json: { status: 'success', count: count, liked: liked }
      end

      private

        def correct_user
          @like = current_user.gadget_likes.find_by(gadget_id: params[:gadget_id])
          render json: { status: 'failure', message: ['この操作は実行できません'] } if @like.nil?
        end
    end
  end
end
