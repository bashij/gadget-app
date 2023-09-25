require 'rails_helper'

RSpec.describe 'Memberships', type: :request do
  let(:user) { create(:user) }
  let(:community) { create(:community, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_community) { create(:community, user_id: other_user.id) }

  describe 'GET #show' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # コミュニティに参加
      post "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/communities/#{community.id}/memberships"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/communities/#{community.id}/memberships"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(1)
      expect(json['users'][0]['name']).to eq(user.name)
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        post "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
      end

      context '成功の場合' do
        specify 'コミュニティの参加者数が１件増える' do
          expect do
            post "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
          end.to change(Membership.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
        post "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
      end

      context '成功の場合' do
        specify 'コミュニティの参加者数が１件減る' do
          expect do
            delete "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
          end.to change(Membership.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のコミュニティへの参加を削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/communities/#{other_community.id}/memberships", params: { community_id: other_community.id }
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end
end
