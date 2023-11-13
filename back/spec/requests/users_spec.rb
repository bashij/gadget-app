require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:guest_user) { create(:user, email: 'sample1@example.com') }

  describe 'GET #index' do
    before do
      # 2件のuserを新規作成
      @user1 = create(:user)
      @user2 = create(:user)
    end

    specify 'リクエストが成功する' do
      get '/api/v1/users/'
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get '/api/v1/users/'
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
    end
  end

  describe 'GET #show' do
    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}"
      json = JSON.parse(response.body)

      expect(json['user']['name']).to eq(user.name)
    end
  end

  describe 'GET #following' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログインユーザーで別のユーザーをフォロー
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
    end
  end

  describe 'GET #followers' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログインユーザーで別のユーザーをフォロー
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{@other_user1.id}/followers"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{@other_user1.id}/followers"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(1)
    end
  end

  describe 'POST #create' do
    context '成功の場合' do
      specify 'ユーザー数が１件増える' do
        valid_params = { name: 'テストユーザー',
                         email: 'example@gmail.com',
                         job: 'IT系',
                         password: 'password' }
        expect do
          post '/api/v1/users', params: { user: valid_params }
        end.to change(User.all, :count).by(1)
      end

      specify '成功した情報を返す' do
        valid_params = { name: 'テストユーザー',
                         email: 'example@gmail.com',
                         job: 'IT系',
                         password: 'password' }
        post '/api/v1/users', params: { user: valid_params }
        json = JSON.parse(response.body)

        expect(json['status']).to eq('success')
        expect(json['message']).to eq(['GadgetLinkへようこそ！'])
      end
    end

    context '失敗の場合' do
      specify 'ユーザー数が増減しない' do
        valid_params = { name: '',
                         email: 'example@gmail.com',
                         job: 'IT系',
                         password: 'password' }
        expect do
          post '/api/v1/users', params: { user: valid_params }
        end.not_to change(User.all, :count)
      end

      specify '処理失敗の情報を返す' do
        valid_params = { name: '',
                         email: 'example@gmail.com',
                         job: 'IT系',
                         password: 'password' }
        post '/api/v1/users', params: { user: valid_params }
        json = JSON.parse(response.body)

        expect(json['status']).to eq('failure')
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/users/#{user.id}"
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
        specify 'ユーザー数が１件減る' do
          expect { delete "/api/v1/users/#{user.id}" }.to change(User.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外を削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/users/#{other_user.id}"
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end

    context 'ゲストユーザーでログインしている状態' do
      before do
        session_params = { email: guest_user.email, password: guest_user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
      end

      context '失敗の場合' do
        specify '操作失敗の情報を返す' do
          delete "/api/v1/users/#{guest_user.id}"
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['ゲストユーザーの編集・削除はできません'])
        end
      end
    end
  end

  describe 'PATCH #update' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        valid_params = { user_id: user.id, name: "#{user.name} updateテスト" }
        patch "/api/v1/users/#{user.id}", params: { user: valid_params }
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

      context '更新成功の場合' do
        specify 'nameが更新される' do
          user_name = user.name
          valid_params = { user_id: user.id, name: "#{user.name} updateテスト" }
          patch "/api/v1/users/#{user.id}", params: { user: valid_params }
          expect(user.reload.name).to eq("#{user_name} updateテスト")
        end

        specify '更新したユーザー情報を返す' do
          valid_params = { user_id: user.id, name: "#{user.name} updateテスト" }
          patch "/api/v1/users/#{user.id}", params: { user: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('success')
          expect(json['id']).to eq(user.id)
        end
      end

      context '更新失敗の場合' do
        specify '処理失敗の情報を返す' do
          valid_params = { user_id: user.id, name: '' }
          patch "/api/v1/users/#{user.id}", params: { user: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('failure')
        end

        specify 'ログインユーザー以外を更新しようとすると操作失敗の情報を返す' do
          valid_params = { user_id: user.id, name: "#{user.name} updateテスト" }
          patch "/api/v1/users/#{other_user.id}", params: { user: valid_params }
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end

    context 'ゲストユーザーでログインしている状態' do
      before do
        session_params = { email: guest_user.email, password: guest_user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
      end

      context '失敗の場合' do
        specify '操作失敗の情報を返す' do
          patch "/api/v1/users/#{guest_user.id}"
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['ゲストユーザーの編集・削除はできません'])
        end
      end
    end
  end
end
