require 'rails_helper'

RSpec.describe TweetBookmark, type: :model do
  let(:user) { create(:user) }
  let(:tweet) { create(:tweet) }
  let!(:tweet_bookmark) { user.tweet_bookmarks.create(tweet_id: tweet.id) }

  describe 'validation' do
    specify 'user_id,tweet_idがある場合、有効である' do
      expect(tweet_bookmark).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        tweet_bookmark.user_id = ''
        tweet_bookmark.valid?
        expect(tweet_bookmark.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'tweet_id' do
      specify '存在しない場合、無効である' do
        tweet_bookmark.tweet_id = ''
        tweet_bookmark.valid?
        expect(tweet_bookmark.errors[:tweet_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'user_id,tweet_idの組み合わせが重複する場合、無効である' do
        duplicate_tweet_bookmark = user.tweet_bookmarks.build(tweet_id: tweet.id)
        duplicate_tweet_bookmark.valid?
        expect(duplicate_tweet_bookmark.errors[:user_id]).to include('はすでに存在します')
      end
    end
  end
end
