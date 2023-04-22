module Api
  module V1
    class GadgetBookmarksController < ApplicationController
      before_action :logged_in_user, only: %i[create destroy]
      before_action :correct_user,   only: :destroy

      def create
        bookmark = current_user.gadget_bookmarks.build(gadget_id: params[:gadget_id])
        bookmark.save
        @gadget = Gadget.find(params[:gadget_id])
        count = @gadget.gadget_bookmarks.size
        bookmarked = @gadget.bookmarked_by?(current_user)
        render json: { status: 'success', count: count, bookmarked: bookmarked }
      end

      def destroy
        @bookmark.destroy
        @gadget = Gadget.find(params[:gadget_id])
        count = @gadget.gadget_bookmarks.size
        bookmarked = @gadget.bookmarked_by?(current_user)
        render json: { status: 'success', count: count, bookmarked: bookmarked }
      end

      private

        def correct_user
          @bookmark = current_user.gadget_bookmarks.find_by(gadget_id: params[:gadget_id])
          render json: { status: 'failure', message: ['この操作は実行できません'] } if @bookmark.nil?
        end
    end
  end
end
