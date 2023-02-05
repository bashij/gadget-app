class MembershipsController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]
  before_action :correct_user,   only: :destroy

  def create
    membership = current_user.memberships.build(community_id: params[:community_id])
    membership.save
    @community = Community.find(params[:community_id])
    @users = @community.joined_members.page(params[:users_page]).per(10)
  end

  def destroy
    @membership.destroy
    @community = Community.find(params[:community_id])
    @users = @community.joined_members.page(params[:users_page]).per(10)
  end

  private

    def correct_user
      @membership = current_user.memberships.find_by(community_id: params[:community_id])
      redirect_to root_url if @membership.nil?
    end
end
