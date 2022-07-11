require 'rails_helper'

RSpec.describe 'Comments', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget, user_id: user.id) }
  let(:comment) { create(:comment, user_id: user.id, gadget_id: gadget.id) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post gadget_comments_path(gadget), params: { comment: { content: 'テストコメント' } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'ガジェットへのコメント数が１件増える' do
          expect do
            post gadget_comments_path(gadget), params: { comment: { content: 'テストコメント' } }, xhr: true
          end.to change(Comment.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete gadget_comment_path(gadget, comment)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post gadget_comments_path(gadget), params: { comment: { content: 'テストコメント' } }, xhr: true
        @comment = Comment.last
      end

      context '成功の場合' do
        specify 'ガジェットへのコメント数が１件減る' do
          expect do
            delete gadget_comment_path(gadget, @comment), xhr: true
          end.to change(Comment.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        let(:other_user) { create(:user) }
        let(:other_gadget) { create(:gadget, user_id: other_user.id) }
        let(:other_comment) { create(:comment, user_id: other_user.id, gadget_id: other_gadget.id) }

        specify 'ログインユーザー以外のガジェットへのコメントを削除しようとするとホーム画面へリダイレクトされる' do
          delete gadget_comment_path(other_gadget, other_comment), xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
