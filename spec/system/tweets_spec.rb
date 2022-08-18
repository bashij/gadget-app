require 'rails_helper'

RSpec.describe 'Tweets', type: :system, js: true do
  let!(:user) { create(:user, name: 'テストユーザー', email: 'example1@gmail.com', password: 'password') }
  let!(:other_user) { create(:user, name: 'サブユーザー', email: 'example2@gmail.com', password: 'password') }
  let!(:other_user_tweet1) { create(:tweet, user_id: other_user.id, content: 'テストツイート2') }
  let!(:other_user_tweet2) { create(:tweet, user_id: other_user.id, content: 'テストツイート3') }

  # controller: tweets(create/destroy), users(show), static_pages(home)
  scenario 'ツイートの新規作成、画面への表示、削除を行う', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # 新規ツイートを作成
    expect do
      fill_in 'tweet[content]', with: 'テストツイート1'
      click_on '投稿する'
      expect(page).to have_content '投稿が完了しました'
    end.to change(Tweet.all, :count).by(1)

    # 新規ツイートがhome画面に表示されていることを確認
    expect(page).to have_current_path('/')
    expect(page).to have_content 'テストツイート1'

    # 新規ツイートがmypage画面に表示されていることを確認
    find('#mypage_large').click
    expect(page).to have_current_path("/users/#{user.id}")
    click_on 'ツイート', match: :first
    expect(page).to have_content 'テストツイート1'

    # 新規ツイートを削除
    expect do
      accept_alert do
        find('.icon-delete').click
      end
      expect(page).to have_content '削除されました'
    end.to change(Tweet.all, :count).by(-1)

    # 新規ツイートがmypage画面に表示されていないことを確認
    expect(page).not_to have_content 'テストツイート1'

    # 新規ツイートがhome画面に表示されていないことを確認
    find('#home_large').click
    expect(page).to have_current_path('/')
    expect(page).not_to have_content 'テストツイート1'
  end

  # controller: tweets(create/destroy), users(show), static_pages(home)
  scenario 'ツイートへのリプライ新規作成、削除を行う・', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # 新規ツイートを作成
    expect do
      fill_in 'tweet[content]', with: 'テストツイート1'
      click_on '投稿する'
      expect(page).to have_content '投稿が完了しました'
    end.to change(Tweet.all, :count).by(1)

    # home画面で最初のツイートへのリプライを新規作成/削除
    expect(page).to have_content 'テストツイート2'
    reply_tgt_tweet = Tweet.last
    # replyボタンを押下し、リプライフォームを表示
    find("#collapse_reply_icon_#{reply_tgt_tweet.id}").click
    # リプライを送信
    expect do
      fill_in "reply_form_text_#{reply_tgt_tweet.id}", with: 'テストリプライ1'
      find("#reply_submit_#{reply_tgt_tweet.id}").click
      # 表示を確認
      expect(page).to have_content '1件のリプライ'
      click_on '1件のリプライ'
      expect(page).to have_content '投稿が完了しました'
      expect(page).to have_content 'テストリプライ1'
    end.to change(Tweet.all, :count).by(1)

    # 削除
    delete_tgt_reply = Tweet.find_by(reply_id: reply_tgt_tweet.id)
    expect do
      accept_alert do
        find("#reply_delete_lg_#{delete_tgt_reply.id}").click
      end
      expect(page).to have_content '削除されました'
    end.to change(Tweet.all, :count).by(-1)

    # other_userの詳細画面で最初のツイートへのリプライを新規作成/削除
    click_on other_user.name, match: :first
    expect(page).to have_current_path("/users/#{other_user.id}")
    click_on 'ツイート', match: :first
    expect(page).to have_content 'テストツイート2'
    expect(page).not_to have_content 'リプライ'
    # replyボタンを押下し、リプライフォームを表示
    find("#collapse_reply_icon_#{reply_tgt_tweet.id}").click
    # リプライを送信
    expect do
      fill_in "own_reply_form_text_#{reply_tgt_tweet.id}", with: 'テストリプライ2'
      find("#reply_submit_#{reply_tgt_tweet.id}").click
      # 表示を確認
      expect(page).to have_content '1件のリプライ'
      click_on '1件のリプライ'
      expect(page).to have_content '投稿が完了しました'
      expect(page).to have_content 'テストリプライ2'
    end.to change(Tweet.all, :count).by(1)

    # 削除
    delete_tgt_reply = Tweet.find_by(reply_id: reply_tgt_tweet.id)
    expect do
      accept_alert do
        find("#reply_delete_lg_#{delete_tgt_reply.id}").click
      end
      expect(page).to have_content '削除されました'
    end.to change(Tweet.all, :count).by(-1)
  end

  # controller: tweet_likes(create/destroy), tweet_bookmarks(create/destroy), users(show), static_pages(home)
  scenario 'ツイートへのいいね・ブックマークの追加と解除、ブックマークの表示を行う・', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'
    expect(page).to have_current_path('/')

    # home画面にあるother_userのツイートをいいね/いいね解除
    expect(page).to have_content 'テストツイート2'
    like_tgt_tweet = Tweet.last
    expect(page).to have_selector "#like_section_#{like_tgt_tweet.id}", text: '0'
    find("#like_section_#{like_tgt_tweet.id}").click
    find("#like_section_#{like_tgt_tweet.id}").click
    expect(page).to have_selector "#like_section_#{like_tgt_tweet.id}", text: '1'
    find("#like_section_#{like_tgt_tweet.id}").click
    expect(page).to have_selector "#like_section_#{like_tgt_tweet.id}", text: '0'
    # 最終的にはいいね
    find("#like_section_#{like_tgt_tweet.id}").click
    expect(page).to have_selector "#like_section_#{like_tgt_tweet.id}", text: '1'

    # home画面にあるother_userのツイートをブックマーク/ブックマーク解除
    expect(page).to have_content 'テストツイート3'
    bookmark_tgt_tweet = Tweet.first
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_tweet.id}", text: '0'
    find("#bookmark_section_#{bookmark_tgt_tweet.id}").click
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_tweet.id}", text: '1'
    find("#bookmark_section_#{bookmark_tgt_tweet.id}").click
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_tweet.id}", text: '0'
    # 最終的にはブックマーク
    find("#bookmark_section_#{bookmark_tgt_tweet.id}").click
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_tweet.id}", text: '1'

    # mypage画面にブックマークしたツイートがあることを確認
    find('#mypage_large').click
    expect(page).to have_current_path("/users/#{user.id}")
    click_on 'ブックマークツイート', match: :first
    expect(page).to have_content 'テストツイート3'

    # other_userの詳細画面へ移動
    click_on other_user.name
    expect(page).to have_current_path("/users/#{other_user.id}")

    # いいねしたツイートがあることを確認
    click_on 'ツイート', match: :first
    expect(page).to have_selector "#own_like_section_#{like_tgt_tweet.id}", text: '1'
    expect(page).to have_selector "#own_bookmark_section_#{bookmark_tgt_tweet.id}", text: '1'
  end
end
