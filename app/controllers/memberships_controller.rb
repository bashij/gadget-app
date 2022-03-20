class MembershipsController < ApplicationController
  before_action :logged_in_user, only: %i[create destroy]

  def create
    membership = current_user.memberships.build(community_id: params[:community_id])
    membership.save
    @community = Community.find(params[:community_id])
    @users = @community.joined_members.page(params[:users_page]).per(10)
  end

  def destroy
    membership = Membership.find_by(community_id: params[:community_id], user_id: current_user.id)
    membership.destroy
    @community = Community.find(params[:community_id])
    @users = @community.joined_members.page(params[:users_page]).per(10)
  end
end
