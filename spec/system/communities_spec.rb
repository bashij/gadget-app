require 'rails_helper'

RSpec.describe 'Communities', type: :system, js: true do
  let!(:user) { create(:user, name: 'テストユーザー', email: 'example1@gmail.com', password: 'password') }
  let!(:other_user) { create(:user, name: 'サブユーザー', email: 'example2@gmail.com', password: 'password') }
  let!(:other_user_community1) { create(:community, user_id: other_user.id, name: 'テストコミュニティ1') }

  # controller: communities(show/new/create/edit/update/destroy), static_pages(home)
  scenario 'コミュニティの新規作成、画面への表示（ホーム画面/コミュニティ詳細）、編集、削除を行う', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # 登録コミュニティ情報
    sample_name = 'テストコミュニティ2'

    # 新しいコミュニティを作成
    click_on '新しいコミュニティを登録する'
    expect do
      fill_in 'community[name]', with: sample_name
      attach_file 'コミュニティ画像', Rails.root.join('app/assets/images/default.jpeg')
      click_on '登録する'
      expect(page).to have_content '新しいコミュニティが登録されました'
    end.to change(Community.all, :count).by(1)

    # 作成されたコミュニティの情報を取得
    sample_community = Community.first
    sample_user = user.name
    sample_create_date = sample_community.updated_at.strftime('%Y/%m/%d %H:%M')

    # コミュニティ詳細の表示を確認
    expect(page).to have_content sample_name
    expect(page).to have_content '0人'
    expect(page).to have_content sample_user
    expect(page).to have_content sample_create_date

    # home画面の表示を確認
    find('#home_large').click
    expect(page).to have_content sample_name
    expect(page).to have_content '0人'

    # コミュニティを編集
    click_on sample_name
    click_on 'コミュニティを編集'

    # 編集後コミュニティ情報
    sample_name = 'テストコミュニティ2 編集後'
    fill_in 'community[name]', with: sample_name
    click_on '変更を保存する'
    expect(page).to have_content '更新されました'

    # 編集後の表示を詳細画面で確認
    expect(page).to have_content sample_name
    expect(page).to have_content '0人'
    expect(page).to have_content sample_user
    expect(page).to have_content sample_create_date

    # 編集後の表示をhome画面で確認
    find('#home_large').click
    expect(page).to have_content sample_name
    expect(page).to have_content '0人'

    # コミュニティを削除
    click_on sample_name
    expect do
      accept_alert do
        click_on 'コミュニティを削除'
      end
      expect(page).to have_content 'コミュニティが削除されました'
    end.to change(Community.all, :count).by(-1)

    # 削除後の表示をhome画面で確認
    expect(page).to have_current_path('/')
    expect(page).not_to have_content sample_name
  end

  # controller: memberships(create/destroy), communities(show), users(show)
  scenario 'コミュニティへの参加、脱退、ユーザー詳細画面への表示を行う', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # other_userのコミュニティへ参加
    expect(page).to have_content 'テストコミュニティ1'
    expect(page).to have_content '0人'
    click_on '参加'
    expect(page).to have_content '1人'

    # user詳細画面への追加を確認
    find('#mypage_large').click
    expect(page).to have_current_path("/users/#{user.id}")
    # 初期表示がコミュニティ以外に変更になった場合は、以下実行前に click_on 'コミュニティ', match: :first とする必要があるので注意
    expect(page).to have_content 'テストコミュニティ1'
    expect(page).to have_content '1人'

    # コミュニティ詳細画面にメンバー追加されていることを確認
    click_on 'テストコミュニティ1'
    tgt_community = Community.find_by(name: 'テストコミュニティ1')
    expect(page).to have_current_path("/communities/#{tgt_community.id}")
    expect(page).to have_content user.name
    expect(page).to have_content '1人'

    # コミュニティを脱退
    click_on '脱退'
    expect(page).not_to have_content user.name
    expect(page).to have_content '0人'

    # user詳細画面から消えていることを確認
    find('#mypage_large').click
    expect(page).to have_current_path("/users/#{user.id}")
    expect(page).not_to have_content 'テストコミュニティ1'
  end
end
