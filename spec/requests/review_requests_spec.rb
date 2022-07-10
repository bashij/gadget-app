require 'rails_helper'

RSpec.describe 'ReviewRequests', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_gadget) { create(:gadget, user_id: other_user.id) }

  describe 'GET #show' do
    specify '詳細画面の表示が成功する' do
      get gadget_review_requests_path(gadget)
      expect(response).to have_http_status :ok
    end

    specify 'コンテンツのヘッダが存在する' do
      get gadget_review_requests_path(gadget)
      expect(response.body).to include 'レビューをリクエストしているユーザー'
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post gadget_review_requests_path(gadget)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'ガジェットへのレビューリクエスト数が１件増える' do
          expect do
            post gadget_review_requests_path(gadget), xhr: true
          end.to change(ReviewRequest.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete gadget_review_requests_path(gadget)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post gadget_review_requests_path(gadget), xhr: true
      end

      context '成功の場合' do
        specify 'ガジェットへのレビューリクエスト数が１件減る' do
          expect do
            delete gadget_review_requests_path(gadget), xhr: true
          end.to change(ReviewRequest.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のガジェットへのレビューリクエストを削除しようとするとホーム画面へリダイレクトされる' do
          delete gadget_review_requests_path(other_gadget), xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
