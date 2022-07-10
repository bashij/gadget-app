require 'rails_helper'

RSpec.describe 'ResponsiveItems', type: :system, js: true do
  let!(:user) { create(:user, name: 'テストユーザー', email: 'example1@gmail.com', password: 'password') }
  let!(:other_user) { create(:user, name: 'サブユーザー', email: 'example2@gmail.com', password: 'password') }

  before do
    # 画面幅をデフォルトの1440から変更した検証を行う
    Capybara.current_session.driver.browser.manage.window.resize_to(960, 500)
  end

  describe 'ヘッダーメニュー' do
    context '非ログイン時' do
      scenario '縮小版メニューが正常に表示される' do
        visit root_path
        find('#header_menu').click
        expect(page).to have_selector '#home_small', text: 'HOME'
        expect(page).to have_selector '#help_small', text: 'HELP'
        expect(page).to have_selector '#users_small', text: 'USERS'
        expect(page).to have_selector '#login_small', text: 'LOGIN'
      end

      scenario '縮小版メニュークリック時に正常にページ遷移する' do
        visit root_path
        find('#header_menu').click
        find('#home_small').click
        expect(page).to have_current_path('/')
        find('#header_menu').click
        find('#help_small').click
        expect(page).to have_current_path('/about')
        find('#header_menu').click
        find('#users_small').click
        expect(page).to have_content user.name
        expect(page).to have_content other_user.name
        find('#header_menu').click
        find('#login_small').click
        expect(page).to have_current_path('/login')
      end
    end

    context 'ログイン時' do
      scenario '縮小版メニューが正常に表示される' do
        # userでログイン
        visit root_path
        find('#header_menu').click
        find('#login_small').click
        expect(page).to have_current_path('/login')
        fill_in 'session[email]', with: user.email
        fill_in 'session[password]', with: user.password
        click_on 'ログイン'

        # メニューの表示を確認
        find('#header_menu').click
        expect(page).to have_selector '#home_small', text: 'HOME'
        expect(page).to have_selector '#help_small', text: 'HELP'
        expect(page).to have_selector '#users_small', text: 'USERS'
        expect(page).to have_selector '#mypage_small', text: 'MYPAGE'
        expect(page).to have_selector '#setting_small', text: 'SETTING'
        expect(page).to have_selector '#logout_small', text: 'LOGOUT'
      end

      scenario '縮小版メニュークリック時に正常にページ遷移する' do
        # userでログイン
        visit root_path
        find('#header_menu').click
        find('#login_small').click
        expect(page).to have_current_path('/login')
        fill_in 'session[email]', with: user.email
        fill_in 'session[password]', with: user.password
        click_on 'ログイン'

        # メニューの挙動を確認
        find('#header_menu').click
        find('#mypage_small').click
        expect(page).to have_current_path("/users/#{user.id}")
        expect(page).to have_content user.name
        expect(page).to have_content user.job
        find('#header_menu').click
        find('#setting_small').click
        expect(page).to have_current_path("/users/#{user.id}/edit")
        expect(page).to have_content 'ユーザー情報編集'
        find('#header_menu').click
        find('#logout_small').click
        expect(page).to have_current_path('/')
      end
    end
  end
end
