require 'rails_helper'

RSpec.describe 'UsersRecommend', type: :request do
  let(:user) { create(:user) }
  let(:user_a) { create(:user, name: 'ユーザーA') }
  let(:user_b) { create(:user, name: 'ユーザーB') }
  let(:user_c) { create(:user, name: 'ユーザーC') }
  let(:user_d) { create(:user, name: 'ユーザーD') }
  let(:user_e) { create(:user, name: 'ユーザーE') }
  let(:gadget_a) { create(:gadget, user_id: user_a.id, name: 'ガジェットa') }
  let(:gadget_b) { create(:gadget, user_id: user_b.id, name: 'ガジェットb') }

  describe 'GET #recommend' do
    before do
      # ユーザーA
      user_a.follow(user_b)
      user_a.follow(user_c)
      # ユーザーB
      user_b.follow(user_a)
      user_b.follow(user_c)
      # ユーザーC
      user_c.follow(user_a)
      user_c.follow(user_b)
      user_c.follow(user_e)
      # ユーザーD
      user_d.follow(user_a)
      user_d.follow(user_b)
      # ユーザーE
      user_e.follow(user_c)
      user_e.follow(user_d)
      # userでログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
    end

    context '軸ガジェットがガジェットa' do
      before do
        # ログインユーザーがgadget_aへいいね
        user.gadget_likes.build(gadget_id: gadget_a.id).save
        # ログインユーザーがuser_cをフォロー
        user.follow(user_c)

        # これにより、ログインユーザーのmost_interested_gadget_idはgadget_aとなり、
        # most_interested_user_idはgadget_aを登録したuser_aとなる。
        # relation_scoresは{b=>50.00, c=>25.00, e=>25.00}となっている想定。
        # また、scoreに関係なく、most_interested_user_idは先頭に表示される。
        # cは既にフォロー済みのため、おすすめ対象は全3件となり、
        # 1ページ目はa,b、2ページ目はeのみ、という順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_users"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=1"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーA')
        expect(json['users'][1]['name']).to include('ユーザーB')
        expect(json['searchResultCount']).to eq(3)
      end

      specify '要求通りの情報を返す（2ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=2"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーE')
        expect(json['searchResultCount']).to eq(3)
      end
    end

    context '軸ガジェットがガジェットb' do
      before do
        # ログインユーザーがgadget_bへいいね
        user.gadget_likes.build(gadget_id: gadget_b.id).save
        # ログインユーザーがuser_eをフォロー
        user.follow(user_e)

        # これにより、ログインユーザーのmost_interested_gadget_idはgadget_bとなり、
        # most_interested_user_idはgadget_bを登録したuser_bとなる。
        # relation_scoresは{a=>50.00, c=>25.00, e=>25.00}となっている想定。
        # また、scoreに関係なく、most_interested_user_idは先頭に表示される。
        # eは既にフォロー済みのため、おすすめ対象は全3件となり、
        # 1ページ目はb,a、2ページ目はcのみ、という順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_users"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=1"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーB')
        expect(json['users'][1]['name']).to include('ユーザーA')
        expect(json['searchResultCount']).to eq(3)
      end

      specify '要求通りの情報を返す（2ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=2"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーC')
        expect(json['searchResultCount']).to eq(3)
      end
    end

    context '軸ガジェットがガジェットaからガジェットbに更新（単体アクション）' do
      before do
        # ログインユーザーがgadget_aとbへいいね
        user.gadget_likes.build(gadget_id: gadget_a.id).save
        user.gadget_likes.build(gadget_id: gadget_b.id).save
        # ログインユーザーがuser_eをフォロー
        user.follow(user_e)

        # これにより、ログインユーザーのmost_interested_gadget_idはgadget_bとなり、
        # most_interested_user_idはgadget_bを登録したuser_bとなる。
        # relation_scoresは{a=>50.00, c=>25.00, e=>25.00}となっている想定。
        # また、scoreに関係なく、most_interested_user_idは先頭に表示される。
        # eは既にフォロー済みのため、おすすめ対象は全3件となり、
        # 1ページ目はb,a、2ページ目はcのみ、という順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_users"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=1"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーB')
        expect(json['users'][1]['name']).to include('ユーザーA')
        expect(json['searchResultCount']).to eq(3)
      end

      specify '要求通りの情報を返す（2ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=2"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーC')
        expect(json['searchResultCount']).to eq(3)
      end
    end

    context '軸ガジェットがガジェットaからガジェットbに更新（複数アクション）' do
      before do
        # ログインユーザーが各ガジェットへアクション
        user.gadget_likes.build(gadget_id: gadget_a.id).save
        user.gadget_likes.build(gadget_id: gadget_b.id).save
        user.gadget_bookmarks.build(gadget_id: gadget_a.id).save
        user.review_requests.build(gadget_id: gadget_a.id).save
        user.review_requests.build(gadget_id: gadget_b.id).save
        user.comments.build(gadget_id: gadget_b.id, content: 'test').save
        # ログインユーザーがuser_eをフォロー
        user.follow(user_e)

        # これにより、ログインユーザーのmost_interested_gadget_idはgadget_bとなり、
        # most_interested_user_idはgadget_bを登録したuser_bとなる。
        # relation_scoresは{a=>50.00, c=>25.00, e=>25.00}となっている想定。
        # また、scoreに関係なく、most_interested_user_idは先頭に表示される。
        # eは既にフォロー済みのため、おすすめ対象は全3件となり、
        # 1ページ目はb,a、2ページ目はcのみ、という順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_users"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=1"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーB')
        expect(json['users'][1]['name']).to include('ユーザーA')
        expect(json['searchResultCount']).to eq(3)
      end

      specify '要求通りの情報を返す（2ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_users?paged=2"
        json = JSON.parse(response.body)

        expect(json['users'][0]['name']).to include('ユーザーC')
        expect(json['searchResultCount']).to eq(3)
      end
    end
  end
end
