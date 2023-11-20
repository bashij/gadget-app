require 'rails_helper'

RSpec.describe 'UsersFilter', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:guest_user) { create(:user, email: 'sample1@example.com') }

  describe 'GET #index 検索条件:ユーザー名' do
    before do
      # 3件のuserを新規作成
      @user1 = create(:user, name: 'テスト1')
      @user2 = create(:user, name: '検索テスト1')
      @user3 = create(:user, name: '検索テスト2')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users?name=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users?name=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #index 検索条件:職業' do
    before do
      # 3件のuserを新規作成
      @user1 = create(:user, job: 'IT系')
      @user2 = create(:user, job: '非IT系')
      @user3 = create(:user, job: '非IT系')
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('非IT系')

    specify 'リクエストが成功する' do
      get "/api/v1/users?job=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users?job=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following 検索条件:ユーザー名' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログインユーザーで別のユーザーをフォロー
      @other_user1 = create(:user, name: 'テスト1')
      @other_user2 = create(:user, name: '検索テスト1')
      @other_user3 = create(:user, name: '検索テスト2')
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
      post '/api/v1/relationships', params: { followed_id: @other_user3.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following?name=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following?name=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #following 検索条件:職業' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログインユーザーで別のユーザーをフォロー
      @other_user1 = create(:user, job: 'IT系')
      @other_user2 = create(:user, job: '非IT系')
      @other_user3 = create(:user, job: '非IT系')
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
      post '/api/v1/relationships', params: { followed_id: @other_user3.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('非IT系')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following?job=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following?job=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #followers 検索条件:ユーザー名' do
    before do
      # 3件のuserを新規作成
      @user1 = create(:user, name: 'テスト1')
      @user2 = create(:user, name: '検索テスト1')
      @user3 = create(:user, name: '検索テスト2')
      # user1でログインし、other_userをフォロー
      session_params = { email: @user1.email, password: @user1.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      post '/api/v1/relationships', params: { followed_id: other_user.id }
      # user2でログインし、other_userをフォロー
      session_params = { email: @user2.email, password: @user2.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      post '/api/v1/relationships', params: { followed_id: other_user.id }
      # user3でログインし、other_userをフォロー
      session_params = { email: @user3.email, password: @user3.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      post '/api/v1/relationships', params: { followed_id: other_user.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('検索')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{other_user.id}/followers?name=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{other_user.id}/followers?name=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end

  describe 'GET #followers 検索条件:職業' do
    before do
      # 3件のuserを新規作成
      @user1 = create(:user, job: 'IT系')
      @user2 = create(:user, job: '非IT系')
      @user3 = create(:user, job: '非IT系')
      # user1でログインし、other_userをフォロー
      session_params = { email: @user1.email, password: @user1.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      post '/api/v1/relationships', params: { followed_id: other_user.id }
      # user2でログインし、other_userをフォロー
      session_params = { email: @user2.email, password: @user2.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      post '/api/v1/relationships', params: { followed_id: other_user.id }
      # user3でログインし、other_userをフォロー
      session_params = { email: @user3.email, password: @user3.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      post '/api/v1/relationships', params: { followed_id: other_user.id }
    end

    # 検索ワードを設定
    encoded_word = URI.encode_www_form_component('非IT系')

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{other_user.id}/followers?job=#{encoded_word}"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{other_user.id}/followers?job=#{encoded_word}"
      json = JSON.parse(response.body)

      expect(json['users'].length).to eq(2)
      expect(json['searchResultCount']).to eq(2)
    end
  end
end
