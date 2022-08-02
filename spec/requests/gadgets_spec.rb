require 'rails_helper'

RSpec.describe 'Gadgets', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget) }
  let(:other_gadget) { create(:gadget) }

  describe 'GET #show' do
    specify '詳細画面の表示が成功する' do
      get gadget_path(gadget)
      expect(response).to have_http_status :ok
    end

    describe '各コンテンツのヘッダが存在する' do
      specify 'レビュー' do
        get gadget_path(gadget)
        expect(response.body).to include 'レビュー'
      end

      specify 'コメント' do
        get gadget_path(gadget)
        expect(response.body).to include 'コメント'
      end
    end
  end

  describe 'GET #new' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        get new_gadget_path
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      specify '新規作成画面の表示が成功する' do
        get new_gadget_path
        expect(response).to have_http_status :ok
      end

      specify 'コンテンツのヘッダが存在する' do
        get new_gadget_path
        expect(response.body).to include 'ガジェット登録'
      end
    end
  end

  describe 'GET #edit' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        get edit_gadget_path(gadget)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post gadgets_path, params: { gadget: { user_id: user.id, name: 'テストガジェット', category: 'PC本体' } }
        @gadget = user.gadgets.first
      end

      specify '編集画面の表示が成功する' do
        get edit_gadget_path(@gadget)
        expect(response).to have_http_status :ok
      end

      specify 'コンテンツのヘッダが存在する' do
        get edit_gadget_path(@gadget)
        expect(response.body).to include 'ガジェット編集'
      end

      specify 'ログインユーザー以外のガジェット編集画面を表示しようとするとホーム画面へリダイレクトされる' do
        get edit_gadget_path(gadget)
        expect(response).to redirect_to root_url
      end
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post gadgets_path, params: { gadget: { user_id: user.id, name: 'テストガジェット', category: 'PC本体' } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'ガジェット数が１件増える' do
          expect do
            post gadgets_path, params: { gadget: { user_id: user.id, name: 'テストガジェット', category: 'PC本体' } }
          end.to change(Gadget.all, :count).by(1)
        end

        specify 'ガジェット詳細画面が表示される' do
          post gadgets_path, params: { gadget: { user_id: user.id, name: 'テストガジェット', category: 'PC本体' } }
          new_gadget = user.gadgets.last
          expect(response).to redirect_to gadget_path(new_gadget)
        end
      end

      context '失敗の場合' do
        specify 'ガジェット数が増減しない' do
          expect do
            post gadgets_path, params: { gadget: { user_id: user.id, name: '', category: 'PC本体' } }
          end.not_to change(Gadget.all, :count)
        end

        specify 'バリデーションメッセージが画面に表示される' do
          post gadgets_path, params: { gadget: { user_id: user.id, name: '', category: 'PC本体' } }
          expect(response.body).to include 'ガジェット名を入力してください'
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete gadget_path(gadget)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post gadgets_path, params: { gadget: { user_id: user.id, name: 'テストガジェット', category: 'PC本体' } }
        @new_gadget = user.gadgets.last
        @user_id = @new_gadget.user_id
      end

      context '成功の場合' do
        specify 'ガジェット数が１件減る' do
          expect do
            delete gadget_path(@new_gadget), params: { gadget: { user_id: @user_id } }
          end.to change(Gadget.all, :count).by(-1)
        end

        specify 'ユーザー詳細画面が表示される' do
          delete gadget_path(@new_gadget), params: { gadget: { user_id: @user_id } }
          expect(response).to redirect_to  user_path(@user_id)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のガジェットを削除しようとするとホーム画面へリダイレクトされる' do
          delete gadget_path(other_gadget), params: { gadget: { user_id: user.id } }
          expect(response).to redirect_to root_url
        end
      end
    end
  end

  describe 'PATCH #update' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        patch gadget_path(gadget), params: { gadget: { name: "#{gadget.name} updateテスト" } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post gadgets_path, params: { gadget: { user_id: user.id, name: 'テストガジェット', category: 'PC本体' } }
        @new_gadget = user.gadgets.last
      end

      context '更新成功の場合' do
        specify 'nameが更新される' do
          gadget_name = @new_gadget.name
          patch gadget_path(@new_gadget), params: { gadget: { name: "#{gadget_name} updateテスト" } }
          expect(@new_gadget.reload.name).not_to eq gadget_name
        end

        specify 'ガジェット詳細画面へリダイレクトされる' do
          gadget_name = @new_gadget.name
          patch gadget_path(@new_gadget), params: { gadget: { name: "#{gadget_name} updateテスト" } }
          expect(response).to redirect_to gadget_path(@new_gadget)
        end
      end

      context '更新失敗の場合' do
        specify 'ガジェット編集画面が再表示される' do
          gadget_name = ''
          patch gadget_path(@new_gadget), params: { gadget: { name: gadget_name } }
          expect(response.body).to include 'ガジェット編集'
        end

        specify 'ログインユーザー以外のガジェットを更新しようとするとホーム画面へリダイレクトされる' do
          patch gadget_path(other_gadget), params: { gadget: { name: 'updateテスト' } }
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
