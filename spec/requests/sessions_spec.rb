require 'rails_helper'

RSpec.describe 'Sessions', type: :request do
  let(:user) { create(:user) }
  let(:unregistered_user) { build(:user) }

  describe 'GET #new' do
    specify 'ログイン画面の表示が成功する' do
      get login_path
      expect(response).to have_http_status :ok
    end
  end

  describe 'POST #create' do
    context '存在するユーザー' do
      specify 'ログインが成功する' do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        expect(response).to redirect_to root_path
      end

      specify 'セッションの永続化が成功する' do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 1 } }
        expect(cookies[:remember_token]).to be_truthy
      end
    end

    context '存在しないユーザー' do
      specify 'ログインが失敗する' do
        post login_path, params: { session:
                                 { email: unregistered_user.email,
                                   password: unregistered_user.password,
                                   remember_me: 0 } }
        expect(response.body).to include '無効なメールアドレスまたはパスワードです'
      end
    end
  end

  describe 'DELETE #destroy' do
    specify 'ログアウトが成功する' do
      post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      delete logout_path
      expect(response).to redirect_to root_path
    end
  end
end
