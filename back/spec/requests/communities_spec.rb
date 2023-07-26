require 'rails_helper'

RSpec.describe 'Communities', type: :request do
  let(:user) { create(:user) }
  let(:community) { create(:community) }
  let(:other_community) { create(:community) }

  describe 'GET #index' do
    before do
      # 2件のcommunityを新規作成
      @community1 = create(:community)
      @community2 = create(:community)
    end

    specify 'リクエストが成功する' do
      get '/api/v1/communities'
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get '/api/v1/communities'
      json = JSON.parse(response.body)

      expect(json['communities'].length).to eq(2)
    end
  end

  describe 'GET #user_communities' do
    before do
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/user_communities"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      # 2件のコミュニティに参加する
      post "/api/v1/communities/#{community.id}/memberships", params: { community_id: community.id }
      post "/api/v1/communities/#{other_community.id}/memberships", params: { community_id: other_community.id }

      get "/api/v1/users/#{user.id}/user_communities"
      json = JSON.parse(response.body)

      expect(json['communities'].length).to eq(2)
    end
  end

  describe 'GET #show' do
    specify 'リクエストが成功する' do
      get "/api/v1/communities/#{community.id}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/communities/#{community.id}"
      json = JSON.parse(response.body)

      expect(json['community']['name']).to eq(community.name)
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        valid_params = { user_id: user.id, name: 'テストコミュニティ' }
        post '/api/v1/communities', params: { community: valid_params }
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
        specify 'コミュニティ数が１件増える' do
          valid_params = { user_id: user.id, name: 'テストコミュニティ' }
          expect do
            post '/api/v1/communities', params: { community: valid_params }
          end.to change(Community.all, :count).by(1)
        end

        specify '新規作成したコミュニティ情報を返す' do
          valid_params = { user_id: user.id, name: 'テストコミュニティ' }
          post '/api/v1/communities', params: { community: valid_params }
          new_community = user.communities.last
          json = JSON.parse(response.body)

          expect(json['status']).to eq('success')
          expect(json['id']).to eq(new_community.id)
        end
      end

      context '失敗の場合' do
        specify 'コミュニティ数が増減しない' do
          valid_params = { user_id: user.id, name: '' }
          expect do
            post '/api/v1/communities', params: { community: valid_params }
          end.not_to change(Community.all, :count)
        end

        specify '処理失敗の情報を返す' do
          valid_params = { user_id: user.id, name: '' }
          post '/api/v1/communities', params: { community: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('failure')
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/communities/#{community.id}"
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        # ログイン
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
        # 新規コミュニティ作成
        valid_params = { user_id: user.id, name: 'テストコミュニティ' }
        post '/api/v1/communities', params: { community: valid_params }
        @new_community = user.communities.last
        @user_id = @new_community.user_id
      end

      context '成功の場合' do
        specify 'コミュニティ数が１件減る' do
          expect do
            delete "/api/v1/communities/#{@new_community.id}"
          end.to change(Community.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のコミュニティを削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/communities/#{other_community.id}"
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end

  describe 'PATCH #update' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        valid_params = { user_id: user.id, name: "#{community.name} updateテスト" }
        patch "/api/v1/communities/#{community.id}", params: { community: valid_params }
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        # ログイン
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
        # 新規コミュニティ作成
        valid_params = { user_id: user.id, name: 'テストコミュニティ' }
        post '/api/v1/communities', params: { community: valid_params }
        @new_community = user.communities.last
      end

      context '更新成功の場合' do
        specify 'nameが更新される' do
          valid_params = { user_id: user.id, name: "#{@new_community.name} updateテスト" }
          patch "/api/v1/communities/#{@new_community.id}", params: { community: valid_params }
          updated_name = Community.find(@new_community.id).name
          expect(updated_name).to eq("#{@new_community.name} updateテスト")
        end

        specify '更新したコミュニティ情報を返す' do
          valid_params = { user_id: user.id, name: "#{@new_community.name} updateテスト" }
          patch "/api/v1/communities/#{@new_community.id}", params: { community: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('success')
          expect(json['id']).to eq(@new_community.id)
        end
      end

      context '更新失敗の場合' do
        specify '処理失敗の情報を返す' do
          valid_params = { user_id: user.id, name: '' }
          patch "/api/v1/communities/#{@new_community.id}", params: { community: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('failure')
        end

        specify 'ログインユーザー以外のコミュニティを更新しようとすると操作失敗の情報を返す' do
          valid_params = { user_id: user.id, name: 'updateテスト' }
          patch "/api/v1/communities/#{other_community.id}", params: { community: valid_params }
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end
end
