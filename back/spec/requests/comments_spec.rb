require 'rails_helper'

RSpec.describe 'Comments', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget, user_id: user.id) }
  let(:comment) { create(:comment, user_id: user.id, gadget_id: gadget.id) }

  describe 'GET #index' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ツイートへのコメントを2件作成
      valid_params = { gadget_id: gadget.id, content: 'テストコメント1' }
      post "/api/v1/gadgets/#{gadget.id}/comments", params: { comment: valid_params }
      valid_params = { gadget_id: gadget.id, content: 'テストコメント2' }
      post "/api/v1/gadgets/#{gadget.id}/comments", params: { comment: valid_params }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/#{gadget.id}/comments"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/#{gadget.id}/comments"
      json = JSON.parse(response.body)

      expect(json['comments'].length).to eq(2)
      expect(json['comments'][1]['content']).to eq('テストコメント1')
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        valid_params = { gadget_id: gadget.id, content: 'テストコメント' }
        post "/api/v1/gadgets/#{gadget.id}/comments", params: { comment: valid_params }
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
        specify 'ガジェットへのコメント数が１件増える' do
          valid_params = { gadget_id: gadget.id, content: 'テストコメント' }
          expect do
            post "/api/v1/gadgets/#{gadget.id}/comments", params: { comment: valid_params }
          end.to change(Comment.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/gadgets/#{gadget.id}/comments/#{comment.id}"
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
        # 新規コメント作成
        valid_params = { gadget_id: gadget.id, content: 'テストコメント' }
        post "/api/v1/gadgets/#{gadget.id}/comments", params: { comment: valid_params }
        @comment = Comment.last
      end

      context '成功の場合' do
        specify 'ガジェットへのコメント数が１件減る' do
          expect do
            delete "/api/v1/gadgets/#{gadget.id}/comments/#{@comment.id}"
          end.to change(Comment.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        # 別のユーザー作成
        let(:other_user) { create(:user) }
        let(:other_gadget) { create(:gadget, user_id: other_user.id) }
        let(:other_comment) { create(:comment, user_id: other_user.id, gadget_id: other_gadget.id) }

        specify 'ログインユーザー以外のガジェットへのコメントを削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/gadgets/#{other_gadget.id}/comments/#{other_comment.id}"
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end
end
