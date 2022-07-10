require 'rails_helper'

RSpec.describe 'Users', type: :system, js: true do
  let!(:user) { create(:user, name: 'テストユーザー', email: 'example1@gmail.com', password: 'password') }
  let!(:other_user) { create(:user, name: 'サブユーザー', email: 'example2@gmail.com', password: 'password') }

  scenario 'ユーザーの新規作成を行う' do
    visit root_path
    click_on '新規登録'
    expect do
      fill_in 'ユーザー名', with: 'テストユーザー'
      fill_in 'メールアドレス', with: 'example3@gmail.com'
      select 'IT系', from: '職業'
      attach_file 'ユーザー画像', Rails.root.join('app/assets/images/default.jpeg')
      fill_in 'パスワード', with: 'password'
      fill_in 'パスワード（確認）', with: 'password'
      click_on '登録する'
      expect(page).to have_content 'GadgetLinkへようこそ！'
      expect(page).to have_current_path('/')
    end.to change(User.all, :count).by(1)
  end

  scenario 'ユーザーの削除を行う' do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    expect(page).to have_current_path('/login')
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'
    expect do
      find('#setting_large').click
      accept_alert do
        click_on '退会する'
      end
      expect(page).to have_content '退会処理が完了しました。ご利用ありがとうございました。'
      expect(page).to have_current_path('/')
    end.to change(User.all, :count).by(-1)

    # 再度userでのログイン試行→ユーザーが存在しないことを確認
    click_on 'ログイン'
    expect(page).to have_current_path('/login')
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'
    expect(page).to have_content '無効なメールアドレスまたはパスワードです'
  end

  scenario 'ユーザーの編集を行う' do
    # ログイン
    visit root_path
    click_on 'ログイン'
    expect(page).to have_current_path('/login')
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # ユーザー詳細に更新前の登録情報があるか確認
    find('#mypage_large').click
    expect(page).to have_content user.name
    expect(page).to have_content user.job

    # ユーザー編集で情報を更新
    find('#setting_large').click
    expect(page).to have_content 'ユーザー情報編集'
    fill_in 'ユーザー名', with: 'テストユーザー編集後'
    select 'その他', from: '職業'
    click_on '変更を保存する'

    # ユーザー詳細に更新後の登録情報があるか確認
    expect(page).to have_content '更新されました'
    expect(page).to have_content 'テストユーザー編集後'
    expect(page).to have_content 'その他'
  end

  scenario '全ユーザー、フォロー、フォロワー一覧を表示する', js: true do
    # other_userでログイン
    visit root_path
    click_on 'ログイン'
    expect(page).to have_current_path('/login')
    fill_in 'session[email]', with: other_user.email
    fill_in 'session[password]', with: other_user.password
    click_on 'ログイン'

    # 全ユーザーが存在するか確認
    find('#users_large').click
    expect(page).to have_content user.name
    expect(page).to have_content other_user.name

    # ユーザー詳細でuserをフォロー/フォロー解除
    click_on user.name
    expect(page).to have_content user.name
    expect(page).to have_selector '#following', text: '0'
    expect(page).to have_selector '#followers', text: '0'
    click_on 'フォローする'
    expect(page).to have_selector '#following', text: '0'
    expect(page).to have_selector '#followers', text: '1'
    click_on 'フォロー解除'
    expect(page).to have_selector '#following', text: '0'
    expect(page).to have_selector '#followers', text: '0'

    # 最終的にはフォローし、ログアウト
    click_on 'フォローする'
    expect(page).to have_selector '#following', text: '0'
    expect(page).to have_selector '#followers', text: '1'
    find('#logout_large').click
    expect(page).to have_current_path('/')

    # userでログイン
    visit root_path
    click_on 'ログイン'
    expect(page).to have_current_path('/login')
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # ユーザー詳細でuserをフォロー/フォロー解除
    find('#users_large').click
    click_on other_user.name
    expect(page).to have_content other_user.name
    expect(page).to have_selector '#following', text: '1'
    expect(page).to have_selector '#followers', text: '0'
    click_on 'フォローする'
    expect(page).to have_selector '#following', text: '1'
    expect(page).to have_selector '#followers', text: '1'

    # 自分の詳細ページでフォロー/フォロワー数を確認
    find('#mypage_large').click
    expect(page).to have_selector '#following', text: '1'
    expect(page).to have_selector '#followers', text: '1'

    # フォロー/フォロワーの一覧にother_userが存在することを確認
    find('#following').click
    expect(page).to have_content other_user.name
    find('#mypage_large').click
    find('#followers').click
    expect(page).to have_content other_user.name
  end
end
