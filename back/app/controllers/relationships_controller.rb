class RelationshipsController < ApplicationController
  before_action :logged_in_user
  before_action :correct_user, only: :destroy

  def create
    @user = User.find(params[:followed_id])
    current_user.follow(@user)
  end

  def destroy
    @user = @relationship.followed
    current_user.unfollow(@user)
  end

  private

    def correct_user
      @relationship = current_user.active_relationships.find_by(id: params[:id])
      redirect_to root_url if @relationship.nil?
    end
end
