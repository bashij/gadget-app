require 'rails_helper'

RSpec.describe 'GadgetsFilter', type: :request do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_gadget) { create(:gadget, user_id: other_user.id) }

  describe 'GET #index 検索条件:ガジェット名' do
    before do
      # 3件のgadgetを新規作成
      @gadget1 = create(:gadget, name: 'テスト1')
      @gadget2 = create(:gadget, name: '検索テスト1')
      @gadget3 = create(:gadget, name: '検索テスト2')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?name=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?name=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:カテゴリ' do
    before do
      # 3件のgadgetを新規作成
      @gadget1 = create(:gadget, category: 'PC本体')
      @gadget2 = create(:gadget, category: 'モニター')
      @gadget3 = create(:gadget, category: 'モニター')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('モニター')

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?category=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?category=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:型番' do
    before do
      # 3件のgadgetを新規作成
      @gadget1 = create(:gadget, model_number: 'テスト1')
      @gadget2 = create(:gadget, model_number: '検索テスト1')
      @gadget3 = create(:gadget, model_number: '検索テスト2')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?model_number=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?model_number=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:メーカー' do
    before do
      # 3件のgadgetを新規作成
      @gadget1 = create(:gadget, manufacturer: 'テスト1')
      @gadget2 = create(:gadget, manufacturer: '検索テスト1')
      @gadget3 = create(:gadget, manufacturer: '検索テスト2')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?manufacturer=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?manufacturer=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:その他スペック' do
    before do
      # 3件のgadgetを新規作成
      @gadget1 = create(:gadget, other_info: 'テスト1')
      @gadget2 = create(:gadget, other_info: '検索テスト1')
      @gadget3 = create(:gadget, other_info: '検索テスト2')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?other_info=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?other_info=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:レビュー' do
    before do
      # 3件のgadgetを新規作成
      @gadget1 = create(:gadget, review: 'テスト1')
      @gadget2 = create(:gadget, review: '検索テスト1')
      @gadget3 = create(:gadget, review: '検索テスト2')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?review=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?review=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:価格' do
    before do
      # 4件のgadgetを新規作成
      @gadget1 = create(:gadget, price: 100)
      @gadget2 = create(:gadget, price: 200)
      @gadget3 = create(:gadget, price: 300)
      @gadget4 = create(:gadget, price: 400)
    end

    # 検索ワードを設定
    price_minimum = URI.encode_www_form_component(200)
    price_maximum = URI.encode_www_form_component(300)
    conditions = "price_minimum=#{price_minimum}&price_maximum=#{price_maximum}"

    specify 'リクエストが成功する' do
      get "/api/v1/gadgets/?#{conditions}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/gadgets/?#{conditions}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:並び替え' do
    before do
      # 4件のgadgetを新規作成
      @gadget1 = create(:gadget, price: 100)
      @gadget2 = create(:gadget, price: 200)
      @gadget3 = create(:gadget, price: 300)
      @gadget4 = create(:gadget, price: 400)
    end

    context '更新が新しい順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('更新が新しい順')

      specify 'リクエストが成功する' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(400)
        expect(json['gadgets'][1]['price']).to eq(300)
        expect(json['gadgets'][2]['price']).to eq(200)
        expect(json['gadgets'][3]['price']).to eq(100)
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '更新が古い順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('更新が古い順')

      specify 'リクエストが成功する' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(100)
        expect(json['gadgets'][1]['price']).to eq(200)
        expect(json['gadgets'][2]['price']).to eq(300)
        expect(json['gadgets'][3]['price']).to eq(400)
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '価格が安い順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('価格が安い順')

      specify 'リクエストが成功する' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(100)
        expect(json['gadgets'][1]['price']).to eq(200)
        expect(json['gadgets'][2]['price']).to eq(300)
        expect(json['gadgets'][3]['price']).to eq(400)
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '価格が高い順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('価格が高い順')

      specify 'リクエストが成功する' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/gadgets/?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(400)
        expect(json['gadgets'][1]['price']).to eq(300)
        expect(json['gadgets'][2]['price']).to eq(200)
        expect(json['gadgets'][3]['price']).to eq(100)
        expect(json['searchResultCount']).to eq(4)
      end
    end
  end

  describe 'GET #following_users_gadgets 検索条件:ガジェット名' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, name: 'テスト1')
      @gadget2 = create(:gadget, user: @other_user1, name: '検索テスト1')
      @gadget3 = create(:gadget, user: @other_user2, name: '検索テスト2')
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?name=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?name=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:カテゴリ' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, category: 'PC本体')
      @gadget2 = create(:gadget, user: @other_user1, category: 'モニター')
      @gadget3 = create(:gadget, user: @other_user2, category: 'モニター')
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('モニター')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?category=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?category=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:型番' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, model_number: 'テスト1')
      @gadget2 = create(:gadget, user: @other_user1, model_number: '検索テスト1')
      @gadget3 = create(:gadget, user: @other_user2, model_number: '検索テスト2')
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?model_number=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?model_number=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:メーカー' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, manufacturer: 'テスト1')
      @gadget2 = create(:gadget, user: @other_user1, manufacturer: '検索テスト1')
      @gadget3 = create(:gadget, user: @other_user2, manufacturer: '検索テスト2')
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?manufacturer=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?manufacturer=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:その他スペック' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, other_info: 'テスト1')
      @gadget2 = create(:gadget, user: @other_user1, other_info: '検索テスト1')
      @gadget3 = create(:gadget, user: @other_user2, other_info: '検索テスト2')
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?other_info=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?other_info=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:レビュー' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, review: 'テスト1')
      @gadget2 = create(:gadget, user: @other_user1, review: '検索テスト1')
      @gadget3 = create(:gadget, user: @other_user2, review: '検索テスト2')
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?review=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?review=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:価格' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計4件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, price: 100)
      @gadget2 = create(:gadget, user: @other_user1, price: 200)
      @gadget3 = create(:gadget, user: @other_user2, price: 300)
      @gadget4 = create(:gadget, user: @other_user2, price: 400)
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    # 検索ワードを設定
    price_minimum = URI.encode_www_form_component(200)
    price_maximum = URI.encode_www_form_component(300)
    conditions = "price_minimum=#{price_minimum}&price_maximum=#{price_maximum}"

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?#{conditions}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_gadgets?#{conditions}"
      json = JSON.parse(response.body)

      expect(json['gadgets'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following_users_gadgets 検索条件:並び替え' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計4件のgadgetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @gadget1 = create(:gadget, user: @other_user1, price: 100)
      @gadget2 = create(:gadget, user: @other_user1, price: 200)
      @gadget3 = create(:gadget, user: @other_user2, price: 300)
      @gadget4 = create(:gadget, user: @other_user2, price: 400)
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    context '更新が新しい順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('更新が新しい順')

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(400)
        expect(json['gadgets'][1]['price']).to eq(300)
        expect(json['gadgets'][2]['price']).to eq(200)
        expect(json['gadgets'][3]['price']).to eq(100)
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '更新が古い順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('更新が古い順')

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(100)
        expect(json['gadgets'][1]['price']).to eq(200)
        expect(json['gadgets'][2]['price']).to eq(300)
        expect(json['gadgets'][3]['price']).to eq(400)
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '価格が安い順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('価格が安い順')

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(100)
        expect(json['gadgets'][1]['price']).to eq(200)
        expect(json['gadgets'][2]['price']).to eq(300)
        expect(json['gadgets'][3]['price']).to eq(400)
        expect(json['searchResultCount']).to eq(4)
      end
    end

    context '価格が高い順' do
      # 並び順を設定
      encoded_sort_condition = URI.encode_www_form_component('価格が高い順')

      specify 'リクエストが成功する' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        expect(response).to have_http_status :ok
      end

      specify '要求通りの情報を返す' do
        get "/api/v1/users/#{user.id}/following_users_gadgets?sort_condition=#{encoded_sort_condition}"
        json = JSON.parse(response.body)

        expect(json['gadgets'][0]['price']).to eq(400)
        expect(json['gadgets'][1]['price']).to eq(300)
        expect(json['gadgets'][2]['price']).to eq(200)
        expect(json['gadgets'][3]['price']).to eq(100)
        expect(json['searchResultCount']).to eq(4)
      end
    end
  end
end
