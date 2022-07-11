require 'rails_helper'

RSpec.describe 'Communities', type: :request do
  let(:user) { create(:user) }
  let(:community) { create(:community) }
  let(:other_community) { create(:community) }

  describe 'GET #show' do
    specify '詳細画面の表示が成功する' do
      get community_path(community)
      expect(response).to have_http_status :ok
    end

    describe '各コンテンツのヘッダが存在する' do
      specify 'コミュニティ名' do
        get community_path(community)
        expect(response.body).to include 'コミュニティ名'
      end

      specify '参加者一覧' do
        get community_path(community)
        expect(response.body).to include '参加者一覧'
      end
    end
  end

  describe 'GET #new' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        get new_community_path
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      specify '新規作成画面の表示が成功する' do
        get new_community_path
        expect(response).to have_http_status :ok
      end

      specify 'コンテンツのヘッダが存在する' do
        get new_community_path
        expect(response.body).to include 'コミュニティ登録'
      end
    end
  end

  describe 'GET #edit' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        get edit_community_path(community)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post communities_path, params: { community: { user_id: user.id, name: 'テストコミュニティ' } }
        @community = user.communities.first
      end

      specify '編集画面の表示が成功する' do
        get edit_community_path(@community)
        expect(response).to have_http_status :ok
      end

      specify 'コンテンツのヘッダが存在する' do
        get edit_community_path(@community)
        expect(response.body).to include 'コミュニティ編集'
      end

      specify 'ログインユーザー以外のコミュニティ編集画面を表示しようとするとホーム画面へリダイレクトされる' do
        get edit_community_path(community)
        expect(response).to redirect_to root_url
      end
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post communities_path, params: { community: { user_id: user.id, name: 'テストコミュニティ' } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'コミュニティ数が１件増える' do
          expect do
            post communities_path, params: { community: { user_id: user.id, name: 'テストコミュニティ' } }
          end.to change(Community.all, :count).by(1)
        end

        specify 'コミュニティ詳細画面が表示される' do
          post communities_path, params: { community: { user_id: user.id, name: 'テストコミュニティ' } }
          new_community = user.communities.last
          expect(response).to redirect_to community_path(new_community)
        end
      end

      context '失敗の場合' do
        specify 'コミュニティ数が増減しない' do
          expect do
            post communities_path, params: { community: { user_id: user.id, name: '' } }
          end.to change(Community.all, :count).by(0)
        end

        specify 'バリデーションメッセージが画面に表示される' do
          post communities_path, params: { community: { user_id: user.id, name: '' } }
          expect(response.body).to include 'コミュニティ名を入力してください'
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete community_path(community)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post communities_path, params: { community: { user_id: user.id, name: 'テストコミュニティ' } }
        @new_community = user.communities.last
        @user_id = @new_community.user_id
      end

      context '成功の場合' do
        specify 'コミュニティ数が１件減る' do
          expect do
            delete community_path(@new_community), params: { community: { user_id: @user_id } }
          end.to change(Community.all, :count).by(-1)
        end

        specify 'ユーザー詳細画面が表示される' do
          delete community_path(@new_community), params: { community: { user_id: @user_id } }
          expect(response).to redirect_to root_url
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のコミュニティを削除しようとするとホーム画面へリダイレクトされる' do
          delete community_path(other_community), params: { community: { user_id: user.id } }
          expect(response).to redirect_to root_url
        end
      end
    end
  end

  describe 'PATCH #update' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        patch community_path(community), params: { community: { name: "#{community.name} updateテスト" } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post communities_path, params: { community: { user_id: user.id, name: 'テストコミュニティ' } }
        @new_community = user.communities.last
      end

      context '更新成功の場合' do
        specify 'nameが更新される' do
          community_name = @new_community.name
          patch community_path(@new_community), params: { community: { name: "#{community_name} updateテスト" } }
          expect(@new_community.reload.name).not_to eq community_name
        end

        specify 'コミュニティ詳細画面へリダイレクトされる' do
          community_name = @new_community.name
          patch community_path(@new_community), params: { community: { name: "#{community_name} updateテスト" } }
          expect(response).to redirect_to community_path(@new_community)
        end
      end

      context '更新失敗の場合' do
        specify 'コミュニティ編集画面が再表示される' do
          community_name = ''
          patch community_path(@new_community), params: { community: { name: community_name } }
          expect(response.body).to include 'コミュニティ編集'
        end

        specify 'ログインユーザー以外のコミュニティを更新しようとするとホーム画面へリダイレクトされる' do
          patch community_path(other_community), params: { community: { name: 'updateテスト' } }
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
