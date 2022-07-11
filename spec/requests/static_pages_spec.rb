require 'rails_helper'

RSpec.describe 'StaticPages', type: :request do
  let(:user) { create(:user) }

  describe 'GET #home' do
    specify 'home画面の表示が成功する' do
      get root_path
      expect(response).to have_http_status :ok
    end

    describe 'home画面に各コンテンツのヘッダが存在する' do
      specify 'コミュニティ' do
        get root_path
        expect(response.body).to include 'コミュニティ'
      end

      specify '最近のツイート' do
        get root_path
        expect(response.body).to include '最近のツイート'
      end

      specify '新着レビュー' do
        get root_path
        expect(response.body).to include '新着レビュー'
      end
    end
  end

  describe 'GET #about' do
    specify 'about画面の表示が成功する' do
      get about_path
      expect(response).to have_http_status :ok
    end
  end
end
