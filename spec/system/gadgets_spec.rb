require 'rails_helper'

RSpec.describe 'Gadgets', type: :system, js: true do
  let!(:user) { create(:user, name: 'テストユーザー', email: 'example1@gmail.com', password: 'password') }
  let!(:other_user) { create(:user, name: 'サブユーザー', email: 'example2@gmail.com', password: 'password') }
  let!(:other_user_gadget1) { create(:gadget, user_id: other_user.id, name: 'テストガジェット2', review: '') }
  let!(:other_user_gadget2) { create(:gadget, user_id: other_user.id, name: 'テストガジェット3') }

  # controller: gadgets(show/new/create/edit/update/destroy), users(show), static_pages(home)
  scenario 'ガジェット・レビューの新規作成、画面への表示（ホーム画面/ユーザー詳細/レビュー詳細）、編集、削除を行う', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # 登録ガジェット情報
    sample_name = 'テストガジェット1'
    sample_category = 'PC本体'
    sample_model_number = 'テスト型番'
    sample_manufacturer = 'テストメーカー'
    sample_price = 200_000
    sample_other_info = 'テストその他スペック'
    sample_review = 'テストレビュー。テストレビュー。テストレビュー。'

    # 新規ガジェットを作成
    find('#mypage_large').click
    click_on '新しいガジェットを登録する'
    expect do
      fill_in 'gadget[name]', with: sample_name
      select sample_category, from: 'gadget_category'
      fill_in 'gadget[model_number]', with: sample_model_number
      fill_in 'gadget[manufacturer]', with: sample_manufacturer
      fill_in 'gadget[price]', with: sample_price
      fill_in 'gadget[other_info]', with: sample_other_info
      attach_file 'ガジェット画像', Rails.root.join('app/assets/images/default.jpeg')
      fill_in_rich_text_area 'gadget_review', with: sample_review
      click_on '登録する'
    end.to change(Gadget.all, :count).by(1)

    # 作成されたガジェットの情報を取得
    sample_gadget = Gadget.last
    sample_user = sample_gadget.user.name
    sample_update = sample_gadget.updated_at.strftime('%Y/%m/%d %H:%M')

    # ガジェット詳細画面の表示を確認
    expect(page).to have_content '登録が完了しました'
    expect(page).to have_content sample_name
    expect(page).to have_content sample_category
    expect(page).to have_content sample_model_number
    expect(page).to have_content sample_manufacturer
    expect(page).to have_content '200,000 円'
    expect(page).to have_content sample_other_info
    expect(page).to have_content sample_user
    expect(page).to have_content sample_update
    expect(page).to have_content sample_review
    expect(page).to have_content 'レビュー'
    expect(page).to have_content 'コメント'

    # ユーザー詳細画面の表示を確認
    find('#mypage_large').click
    expect(page).to have_content sample_name
    expect(page).to have_content sample_category
    expect(page).to have_content sample_model_number
    expect(page).to have_content sample_manufacturer
    expect(page).to have_content '200,000 円'
    expect(page).to have_content sample_other_info
    expect(page).to have_content sample_user
    expect(page).to have_content sample_update

    # ホーム画面の表示を確認
    find('#home_large').click
    expect(page).to have_content sample_name
    expect(page).to have_content sample_category
    expect(page).to have_content sample_model_number
    expect(page).to have_content sample_manufacturer
    expect(page).to have_content '200,000 円'
    expect(page).to have_content sample_other_info
    expect(page).to have_content sample_user
    expect(page).to have_content sample_update

    # ガジェット情報を編集
    click_on sample_name # ホーム画面からガジェット詳細画面へ移動
    expect(page).to have_content 'レビュー'
    expect(page).to have_content 'コメント'
    click_on 'ガジェットとレビューを編集'
    expect(page).to have_content 'ガジェット編集'

    # 編集後ガジェット情報
    sample_name = 'テストガジェット1 編集後'
    sample_category = 'モニター'
    sample_model_number = 'テスト型番 編集後'
    sample_manufacturer = 'テストメーカー 編集後'
    sample_price = 500_000
    sample_other_info = 'テストその他スペック 編集後'
    sample_review = 'テストレビュー。テストレビュー。テストレビュー。 編集後'

    # 情報を変更して保存
    fill_in 'gadget[name]', with: sample_name
    select sample_category, from: 'gadget_category'
    fill_in 'gadget[model_number]', with: sample_model_number
    fill_in 'gadget[manufacturer]', with: sample_manufacturer
    fill_in 'gadget[price]', with: sample_price
    fill_in 'gadget[other_info]', with: sample_other_info
    fill_in_rich_text_area 'gadget_review', with: sample_review
    click_on '変更を保存する'

    # ガジェット詳細画面の表示を確認
    expect(page).to have_content '更新されました'
    expect(page).to have_content sample_name
    expect(page).to have_content sample_category
    expect(page).to have_content sample_model_number
    expect(page).to have_content sample_manufacturer
    expect(page).to have_content '500,000 円'
    expect(page).to have_content sample_other_info
    expect(page).to have_content sample_user
    expect(page).to have_content sample_update
    expect(page).to have_content sample_review
    expect(page).to have_content 'レビュー'
    expect(page).to have_content 'コメント'

    # ガジェットを削除
    expect do
      accept_alert do
        click_on 'ガジェットとレビューを削除'
      end
      expect(page).to have_content 'ガジェットが削除されました'
    end.to change(Gadget.all, :count).by(-1)

    # ユーザー詳細画面、ホーム画面に存在しないことを確認
    expect(page).not_to have_content sample_name
    find('#home_large').click
    expect(page).not_to have_content sample_name
  end

  # controller: gadget_likes(create/destroy), gadget_bookmarks(create/destroy), users(show)
  scenario 'ガジェットへのいいね・ブックマークの追加と解除、ブックマークの表示を行う', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'
    expect(page).to have_current_path('/')

    # home画面にあるother_userのガジェットをいいね/いいね解除
    expect(page).to have_content 'テストガジェット2'
    like_tgt_gadget = Gadget.first
    expect(page).to have_selector "#like_section_#{like_tgt_gadget.id}", text: '0'
    find("#like_section_#{like_tgt_gadget.id}").click
    expect(page).to have_selector "#like_section_#{like_tgt_gadget.id}", text: '1'
    find("#like_section_#{like_tgt_gadget.id}").click
    expect(page).to have_selector "#like_section_#{like_tgt_gadget.id}", text: '0'
    # 最終的にはいいね
    find("#like_section_#{like_tgt_gadget.id}").click
    expect(page).to have_selector "#like_section_#{like_tgt_gadget.id}", text: '1'

    # home画面にあるother_userのガジェットをブックマーク/ブックマーク解除
    expect(page).to have_content 'テストガジェット3'
    bookmark_tgt_gadget = Gadget.last
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_gadget.id}", text: '0'
    find("#bookmark_section_#{bookmark_tgt_gadget.id}").click
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_gadget.id}", text: '1'
    find("#bookmark_section_#{bookmark_tgt_gadget.id}").click
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_gadget.id}", text: '0'
    # 最終的にはブックマーク
    find("#bookmark_section_#{bookmark_tgt_gadget.id}").click
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_gadget.id}", text: '1'

    # mypage画面にブックマークしたガジェットがあることを確認
    find('#mypage_large').click
    expect(page).to have_current_path("/users/#{user.id}")
    click_on 'ブックマークガジェット', match: :first
    expect(page).to have_content 'テストガジェット3'

    # other_userの詳細画面へ移動
    click_on other_user.name
    expect(page).to have_current_path("/users/#{other_user.id}")

    # いいねしたガジェットがあることを確認
    expect(page).to have_selector "#like_section_#{like_tgt_gadget.id}", text: '1'
    expect(page).to have_selector "#bookmark_section_#{bookmark_tgt_gadget.id}", text: '1'
  end

  # controller: review_requests(create/destroy/show), comments(create/destroy)
  scenario 'レビューリクエストの追加と解除と一覧表示、コメントの新規作成、削除を行う', js: true do
    # userでログイン
    visit root_path
    click_on 'ログイン'
    fill_in 'session[email]', with: user.email
    fill_in 'session[password]', with: user.password
    click_on 'ログイン'

    # home画面にあるother_userのガジェットにレビューリクエスト
    expect(page).to have_content 'テストガジェット2'
    request_tgt_gadget = Gadget.first
    expect(page).to have_selector "#review_request_number_section_#{request_tgt_gadget.id}", text: '0'
    find("#review_request_section_#{request_tgt_gadget.id}").click
    expect(page).to have_selector "#review_request_number_section_#{request_tgt_gadget.id}", text: '1'

    # レビューリクエスト一覧にテストユーザーが追加されたことを確認
    find("#review_request_show_button_#{request_tgt_gadget.id}").click
    expect(page).to have_content user.name

    # home画面でレビューリクエストを解除
    find('#home_large').click
    find("#review_request_section_#{request_tgt_gadget.id}").click
    expect(page).to have_selector "#review_request_number_section_#{request_tgt_gadget.id}", text: '0'

    # 一覧からテストユーザーが削除されたことを確認
    find("#review_request_show_button_#{request_tgt_gadget.id}").click
    expect(page).not_to have_content user.name

    # other_userのガジェットにコメントを投稿
    find('#home_large').click
    click_on other_user_gadget2.name
    expect(page).to have_current_path("/gadgets/#{other_user_gadget2.id}")
    expect do
      fill_in 'comment[content]', with: 'テストコメント'
      click_on 'コメントする'
      expect(page).to have_content '投稿が完了しました'
      expect(page).to have_content 'テストコメント'
    end.to change(Comment.all, :count).by(1)

    # replyボタンを押下し、リプライフォームを表示
    reply_tgt_comment = Comment.last
    find("#collapse_reply_icon_#{reply_tgt_comment.id}").click
    # リプライを送信
    expect do
      fill_in "reply_form_text_#{reply_tgt_comment.id}", with: 'テストコメントへのリプライ'
      find("#reply_submit_#{reply_tgt_comment.id}").click
      # 表示を確認
      expect(page).to have_content '1件のリプライ'
      click_on '1件のリプライ'
      expect(page).to have_content '投稿が完了しました'
      expect(page).to have_content 'テストコメントへのリプライ'
    end.to change(Comment.all, :count).by(1)

    # リプライを削除
    delete_tgt_reply = Comment.find_by(reply_id: reply_tgt_comment.id)
    expect do
      accept_alert do
        find("#reply_delete_lg_#{delete_tgt_reply.id}").click
      end
      expect(page).to have_content '削除されました'
      expect(page).not_to have_content 'テストコメントへのリプライ'
    end.to change(Comment.all, :count).by(-1)

    # コメントを削除
    expect do
      accept_alert do
        find('.icon-delete').click
      end
      expect(page).to have_content '削除されました'
      expect(page).not_to have_content 'テストコメント'
    end.to change(Comment.all, :count).by(-1)
  end
end
