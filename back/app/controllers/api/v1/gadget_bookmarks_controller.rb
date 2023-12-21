module Api
  module V1
    class GadgetBookmarksController < ApplicationController
      before_action :logged_in_user
      before_action :correct_user, only: :destroy
      before_action :load_resource

      def create
        bookmark = current_user.gadget_bookmarks.build(gadget_id: params[:gadget_id])
        bookmark.save

        render_gadget_bookmarks_status
      end

      def destroy
        @bookmark.destroy

        render_gadget_bookmarks_status
      end

      private

        def correct_user
          @bookmark = current_user.gadget_bookmarks.find_by(gadget_id: params[:gadget_id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } if @bookmark.nil?
        end

        def load_resource
          @gadget = Gadget.find(params[:gadget_id])
        end

        def render_gadget_bookmarks_status
          count = @gadget.gadget_bookmarks.size
          bookmarked = @gadget.bookmarked_by?(current_user)

          render json: { status: 'success', count: count, bookmarked: bookmarked }
        end
    end
  end
end
