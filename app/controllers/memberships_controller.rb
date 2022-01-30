class MembershipsController < ApplicationController
  def create
    membership = current_user.memberships.build(community_id: params[:community_id])
    membership.save
    redirect_to request.referer || root_url
  end

  def destroy
    membership = Membership.find_by(community_id: params[:community_id], user_id: current_user.id)
    membership.destroy
    redirect_to request.referer || root_url
  end
end
