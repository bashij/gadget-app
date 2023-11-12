require 'rails_helper'

RSpec.describe 'Sessions', type: :request do
  let(:user) { create(:user) }
  let(:unregistered_user) { build(:user) }
  let(:guest_user) { create(:user, email: 'sample1@example.com') }

  describe 'POST #create' do
    context '存在するユーザー' do
      specify 'ログインが成功する' do
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
        expect(response).to have_http_status :ok
      end

      specify 'セッションの永続化が成功する' do
        session_params = { email: user.email, password: user.password, remember_me: 1 }
        post '/api/v1/login', params: { session: session_params }
        expect(cookies[:remember_token]).to be_truthy
      end
    end

    context '存在しないユーザー' do
      specify 'ログインが失敗する' do
        session_params = { email: unregistered_user.email, password: unregistered_user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('failure')
        expect(json['message']).to eq(['無効なメールアドレスまたはパスワードです'])
      end
    end
  end

  describe 'DELETE #destroy' do
    specify 'ログアウトが成功する' do
      # 一度ログインする
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログアウトする
      delete '/api/v1/logout'
      json = JSON.parse(response.body)

      expect(response).to have_http_status :ok
      expect(json['status']).to eq('justLoggedOut')
      expect(json['message']).to eq(['ログアウトしました'])
    end
  end

  describe 'GET #check_session' do
    specify 'ログイン中のユーザー情報を返す' do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # リクエスト実行
      get '/api/v1/check'
      json = JSON.parse(response.body)

      expect(response).to have_http_status :ok
      expect(json['user']['name']).to eq(user.name)
    end
  end

  describe 'POST #guest_login' do
    context 'ゲストユーザーとして利用可能なサンプルユーザーが存在する場合' do
      specify 'ログインが成功する' do
        guest_user
        post '/api/v1/guest_login'
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('success')
        expect(json['message']).to eq(['ゲストユーザーとしてログインしました'])
      end
    end

    context 'ゲストユーザーとして利用可能なサンプルユーザーが存在しない場合' do
      specify 'ログインが失敗する' do
        post '/api/v1/guest_login'
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('failure')
        expect(json['message']).to eq(['現在ゲストログインはご利用いただけません。通常ログインまたは新規登録をご利用ください。'])
      end
    end
  end
end
