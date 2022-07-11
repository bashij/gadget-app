require 'rails_helper'

RSpec.describe 'Memberships', type: :request do
  let(:user) { create(:user) }
  let(:community) { create(:community, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_community) { create(:community, user_id: other_user.id) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post community_memberships_path(community)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'コミュニティの参加者数が１件増える' do
          expect do
            post community_memberships_path(community), xhr: true
          end.to change(Membership.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete community_memberships_path(community)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post community_memberships_path(community), xhr: true
      end

      context '成功の場合' do
        specify 'コミュニティの参加者数が１件減る' do
          expect do
            delete community_memberships_path(community), xhr: true
          end.to change(Membership.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のコミュニティへの参加を削除しようとするとホーム画面へリダイレクトされる' do
          delete community_memberships_path(other_community), xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
