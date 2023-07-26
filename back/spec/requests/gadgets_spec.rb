require 'rails_helper'

RSpec.describe 'Gadgets', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_gadget) { create(:gadget, user_id: other_user.id) }

  describe 'GET #index' do
    before do
      # 2件のgadgetを新規作成
      @gadget1 = create(:gadget)
      @gadget2 = create(:gadget)
    end

    specify 'リクエストが成功する' do
      get '/api/v1/gadgets/'
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get '/api/v1/gadgets/'
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
    end
  end

  describe 'GET #user_gadgets' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログインユーザーで3件のgadgetを新規作成
      @gadget1 = create(:gadget, user: user)
      @gadget2 = create(:gadget, user: user)
      @gadget3 = create(:gadget, user: user)
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/user_gadgets/"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/user_gadgets/"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(3)
    end
  end

  describe 'GET #user_bookmark_gadgets' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 2件のgadgetを新規作成
      @gadget1 = create(:gadget)
      @gadget2 = create(:gadget)
      # 上記のgadgetをブックマーク
      post "/api/v1/gadgets/#{@gadget1.id}/gadget_bookmarks", params: { gadget_id: @gadget1.id }
      post "/api/v1/gadgets/#{@gadget2.id}/gadget_bookmarks", params: { gadget_id: @gadget2.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/user_bookmark_gadgets/"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/user_bookmark_gadgets/"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1)
      @gadget2 = create(:gadget, user: @other_user1)
      @gadget3 = create(:gadget, user: @other_user2)
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets/"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets/"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(3)
    end
  end

  describe 'GET #show' do
    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/#{gadget.id}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/#{gadget.id}"
      json = JSON.parse(response.body)

      expect(json['gadget']['name']).to eq(gadget.name)
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        valid_params = { user_id: user.id, name: 'テストガジェット', category: 'PC本体' }
        post '/api/v1/gadgets', params: { gadget: valid_params }
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
        specify 'ガジェット数が１件増える' do
          valid_params = { user_id: user.id, name: 'テストガジェット', category: 'PC本体' }
          expect do
            post '/api/v1/gadgets', params: { gadget: valid_params }
          end.to change(Gadget.all, :count).by(1)
        end

        specify '新規作成したガジェット情報を返す' do
          valid_params = { user_id: user.id, name: 'テストガジェット', category: 'PC本体' }
          post '/api/v1/gadgets', params: { gadget: valid_params }
          new_gadget = user.gadgets.last
          json = JSON.parse(response.body)

          expect(json['status']).to eq('success')
          expect(json['id']).to eq(new_gadget.id)
        end
      end

      context '失敗の場合' do
        specify 'ガジェット数が増減しない' do
          valid_params = { user_id: user.id, name: '', category: 'PC本体' }
          expect do
            post '/api/v1/gadgets', params: { gadget: valid_params }
          end.not_to change(Gadget.all, :count)
        end

        specify '処理失敗の情報を返す' do
          valid_params = { user_id: user.id, name: '', category: 'PC本体' }
          post '/api/v1/gadgets', params: { gadget: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('failure')
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/gadgets/#{gadget.id}"
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
        # 新規ガジェット作成
        valid_params = { user_id: user.id, name: 'テストガジェット', category: 'PC本体' }
        post '/api/v1/gadgets', params: { gadget: valid_params }
        @new_gadget = user.gadgets.last
        @user_id = @new_gadget.user_id
      end

      context '成功の場合' do
        specify 'ガジェット数が１件減る' do
          expect do
            delete "/api/v1/gadgets/#{@new_gadget.id}"
          end.to change(Gadget.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のガジェットを削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/gadgets/#{other_gadget.id}"
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
        valid_params = { user_id: user.id, name: "#{gadget.name} updateテスト" }
        patch "/api/v1/gadgets/#{gadget.id}", params: { gadget: valid_params }
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
        # 新規ガジェット作成
        valid_params = { user_id: user.id, name: 'テストガジェット', category: 'PC本体' }
        post '/api/v1/gadgets', params: { gadget: valid_params }
        @new_gadget = user.gadgets.last
      end

      context '更新成功の場合' do
        specify 'nameが更新される' do
          valid_params = { user_id: user.id, name: "#{@new_gadget.name} updateテスト" }
          patch "/api/v1/gadgets/#{@new_gadget.id}", params: { gadget: valid_params }
          updated_name = Gadget.find(@new_gadget.id).name
          expect(updated_name).to eq("#{@new_gadget.name} updateテスト")
        end

        specify '更新したガジェット情報を返す' do
          valid_params = { user_id: user.id, name: "#{@new_gadget.name} updateテスト" }
          patch "/api/v1/gadgets/#{@new_gadget.id}", params: { gadget: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('success')
          expect(json['id']).to eq(@new_gadget.id)
        end
      end

      context '更新失敗の場合' do
        specify '処理失敗の情報を返す' do
          valid_params = { user_id: user.id, name: '' }
          patch "/api/v1/gadgets/#{gadget.id}", params: { gadget: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('failure')
        end

        specify 'ログインユーザー以外のガジェットを更新しようとすると操作失敗の情報を返す' do
          valid_params = { user_id: user.id, name: 'updateテスト' }
          patch "/api/v1/gadgets/#{other_gadget.id}", params: { gadget: valid_params }
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end
end
