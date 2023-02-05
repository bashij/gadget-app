require 'rails_helper'

RSpec.describe 'GadgetBookmarks', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_gadget) { create(:gadget, user_id: other_user.id) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post gadget_gadget_bookmarks_path(gadget)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'ガジェットへのブックマーク数が１件増える' do
          expect do
            post gadget_gadget_bookmarks_path(gadget), xhr: true
          end.to change(GadgetBookmark.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete gadget_gadget_bookmarks_path(gadget)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post gadget_gadget_bookmarks_path(gadget)
      end

      context '成功の場合' do
        specify 'ガジェットへのブックマーク数が１件減る' do
          expect do
            delete gadget_gadget_bookmarks_path(gadget), xhr: true
          end.to change(GadgetBookmark.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のガジェットへのブックマークを削除しようとするとホーム画面へリダイレクトされる' do
          delete gadget_gadget_bookmarks_path(other_gadget), xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
