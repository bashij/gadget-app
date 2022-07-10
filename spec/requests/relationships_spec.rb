require 'rails_helper'

RSpec.describe 'Relationships', type: :request do
  let(:user) { create(:user) }
  let(:target_user) { create(:user) }
  let(:other_user) { create(:user) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post relationships_path, params: { followed_id: target_user.id }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'フォローフォロワーの関係の数が１件増える' do
          expect do
            post relationships_path, params: { followed_id: target_user.id }, xhr: true
          end.to change(Relationship.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        relationship = Relationship.new(follower_id: user.id, followed_id: target_user.id)
        relationship.save
        delete relationship_path(relationship.followed_id)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post relationships_path, params: { followed_id: target_user.id }, xhr: true
        @relationship = Relationship.last
      end

      context '成功の場合' do
        specify 'フォローフォロワーの関係の数が１件減る' do
          expect do
            delete relationship_path(@relationship), xhr: true
          end.to change(Relationship.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のフォロー関係を削除しようとするとホーム画面へリダイレクトされる' do
          other_relationship = Relationship.new(follower_id: other_user.id, followed_id: target_user.id)
          other_relationship.save
          delete relationship_path(other_relationship), xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
