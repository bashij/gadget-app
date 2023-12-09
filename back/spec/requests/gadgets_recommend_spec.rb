require 'rails_helper'

RSpec.describe 'GadgetsRecommend', type: :request do
  let(:user) { create(:user) }
  let(:user_a) { create(:user, name: 'ユーザーA') }
  let(:user_b) { create(:user, name: 'ユーザーB') }
  let(:user_c) { create(:user, name: 'ユーザーC') }
  let(:user_d) { create(:user, name: 'ユーザーD') }
  let(:gadget_a) { create(:gadget, user_id: user_a.id, name: 'ガジェットa') }
  let(:gadget_b) { create(:gadget, user_id: user_a.id, name: 'ガジェットb') }
  let(:gadget_c) { create(:gadget, user_id: user_a.id, name: 'ガジェットc') }
  let(:gadget_d) { create(:gadget, user_id: user_a.id, name: 'ガジェットd') }
  let(:gadget_e) { create(:gadget, user_id: user_a.id, name: 'ガジェットe') }

  describe 'GET #recommend' do
    before do
      # ユーザーA
      user_a.gadget_likes.build(gadget_id: gadget_a.id).save
      user_a.gadget_likes.build(gadget_id: gadget_c.id).save
      user_a.gadget_likes.build(gadget_id: gadget_d.id).save
      user_a.gadget_likes.build(gadget_id: gadget_e.id).save
      user_a.gadget_bookmarks.build(gadget_id: gadget_a.id).save
      user_a.gadget_bookmarks.build(gadget_id: gadget_c.id).save
      user_a.gadget_bookmarks.build(gadget_id: gadget_d.id).save
      user_a.gadget_bookmarks.build(gadget_id: gadget_e.id).save
      user_a.review_requests.build(gadget_id: gadget_a.id).save
      user_a.review_requests.build(gadget_id: gadget_b.id).save
      user_a.comments.build(gadget_id: gadget_a.id, content: 'test').save
      user_a.comments.build(gadget_id: gadget_b.id, content: 'test').save
      user_a.comments.build(gadget_id: gadget_d.id, content: 'test').save
      # ユーザーB
      user_b.gadget_likes.build(gadget_id: gadget_b.id).save
      user_b.gadget_likes.build(gadget_id: gadget_d.id).save
      user_b.gadget_bookmarks.build(gadget_id: gadget_b.id).save
      user_b.gadget_bookmarks.build(gadget_id: gadget_d.id).save
      user_b.review_requests.build(gadget_id: gadget_c.id).save
      user_b.review_requests.build(gadget_id: gadget_e.id).save
      user_b.comments.build(gadget_id: gadget_b.id, content: 'test').save
      user_b.comments.build(gadget_id: gadget_c.id, content: 'test').save
      # ユーザーC
      user_c.gadget_likes.build(gadget_id: gadget_a.id).save
      user_c.gadget_likes.build(gadget_id: gadget_c.id).save
      user_c.gadget_bookmarks.build(gadget_id: gadget_c.id).save
      user_c.gadget_bookmarks.build(gadget_id: gadget_e.id).save
      user_c.review_requests.build(gadget_id: gadget_a.id).save
      user_c.review_requests.build(gadget_id: gadget_c.id).save
      user_c.review_requests.build(gadget_id: gadget_e.id).save
      user_c.comments.build(gadget_id: gadget_a.id, content: 'test').save
      user_c.comments.build(gadget_id: gadget_c.id, content: 'test').save
      user_c.comments.build(gadget_id: gadget_d.id, content: 'test').save
      # ユーザーD
      user_d.gadget_likes.build(gadget_id: gadget_a.id).save
      user_d.gadget_likes.build(gadget_id: gadget_b.id).save
      user_d.gadget_likes.build(gadget_id: gadget_c.id).save
      user_d.gadget_likes.build(gadget_id: gadget_d.id).save
      user_d.gadget_bookmarks.build(gadget_id: gadget_a.id).save
      user_d.gadget_bookmarks.build(gadget_id: gadget_b.id).save
      user_d.review_requests.build(gadget_id: gadget_e.id).save
      user_d.comments.build(gadget_id: gadget_d.id, content: 'test').save
      # userでログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
    end

    context '軸ガジェットがガジェットa' do
      before do
        user.gadget_likes.build(gadget_id: gadget_a.id).save

        # これにより、ログインユーザーのmost_interested_gadget_idはgadget_aとなり、
        # relation_scoresは{c=>31.03, d=>27.59, b=>24.14, e=>17.24}となっている想定。
        # 1ページに2件ずつ表示するため、1ページ目はc,d、2ページ目はb,eの順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_gadgets"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_gadgets?paged=1"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['name']).to include('ガジェットc')
        expect(json['gadgets'][1]['name']).to include('ガジェットd')
        expect(json['searchResultCount']).to eq(4)
      end

      specify '要求通りの情報を返す（2ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_gadgets?paged=2"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['name']).to include('ガジェットb')
        expect(json['gadgets'][1]['name']).to include('ガジェットe')
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '軸ガジェットがガジェットb' do
      before do
        user.gadget_likes.build(gadget_id: gadget_b.id).save

        # これにより、ログインユーザーのmost_interested_gadget_idはgadget_bとなり、
        # relation_scoresは{a=>43.75, d=>37.50, c=>18.75, e=>0.00}となっている想定。
        # 1ページに2件ずつ表示するため、1ページ目はa,d、2ページ目はcの順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_gadgets"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_gadgets?paged=1"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['name']).to include('ガジェットa')
        expect(json['gadgets'][1]['name']).to include('ガジェットd')
        expect(json['searchResultCount']).to eq(3)
      end

      specify '要求通りの情報を返す（2ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_gadgets?paged=2"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['name']).to include('ガジェットc')
        expect(json['searchResultCount']).to eq(3)
      end
    end

    context '軸ガジェットがガジェットaからガジェットbに更新（単体アクション）' do
      before do
        user.gadget_likes.build(gadget_id: gadget_a.id).save
        user.gadget_likes.build(gadget_id: gadget_b.id).save

        # most_interested_gadget_idはアクション数と日時で決定される。
        # 上記操作により、ログインユーザーのmost_interested_gadget_idはgadget_bとなり、
        # relation_scoresは{a=>43.75, d=>37.50, c=>18.75, e=>0.00}となっている想定。
        # aは既にアクション済みのため、おすすめ対象は全2件となり、
        # 1ページ目にd,cの順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_gadgets"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_gadgets?paged=1"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['name']).to include('ガジェットd')
        expect(json['gadgets'][1]['name']).to include('ガジェットc')
        expect(json['searchResultCount']).to eq(2)
      end
    end

    context '軸ガジェットがガジェットaからガジェットbに更新（複数アクション）' do
      before do
        user.gadget_likes.build(gadget_id: gadget_a.id).save
        user.gadget_likes.build(gadget_id: gadget_b.id).save
        user.gadget_bookmarks.build(gadget_id: gadget_a.id).save
        user.review_requests.build(gadget_id: gadget_a.id).save
        user.review_requests.build(gadget_id: gadget_b.id).save
        user.comments.build(gadget_id: gadget_b.id, content: 'test').save

        # most_interested_gadget_idはアクション数と日時で決定される。
        # 上記操作により、ログインユーザーのmost_interested_gadget_idはgadget_bとなり、
        # relation_scoresは{a=>43.75, d=>37.50, c=>18.75, e=>0.00}となっている想定。
        # aは既にアクション済みのため、おすすめ対象は全2件となり、
        # 1ページ目にd,cの順番となっていればOK。
      end

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/recommended_gadgets"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す（1ページ目）' do
        get "/api/v1/users/#{user.id}/recommended_gadgets?paged=1"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['name']).to include('ガジェットd')
        expect(json['gadgets'][1]['name']).to include('ガジェットc')
        expect(json['searchResultCount']).to eq(2)
      end
    end
  end
end
