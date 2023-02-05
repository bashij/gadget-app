require 'rails_helper'

RSpec.describe Tweet, type: :model do
  let(:tweet) { create(:tweet) }
  let(:user) { create(:user) }

  describe 'validation' do
    specify 'user_id, contentがある場合、有効である' do
      expect(tweet).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        tweet.user_id = ''
        tweet.valid?
        expect(tweet.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'content' do
      specify '存在しない場合、無効である' do
        tweet.content = ''
        tweet.valid?
        expect(tweet.errors[:content]).to include('を入力してください')
      end

      specify '141文字以上の場合、無効である' do
        tweet.content = 'a' * 141
        tweet.valid?
        expect(tweet.errors[:content]).to include('は140文字以内で入力してください')
      end
    end
  end

  describe 'association' do
    describe 'tweet_likes' do
      specify 'tweetが削除された時、関連するtweet_likesも削除される' do
        user.tweet_likes.create!(tweet_id: tweet.id)
        expect { tweet.destroy }.to change(TweetLike.all, :count).by(-1)
      end
    end

    describe 'tweet_bookmarks' do
      specify 'tweetが削除された時、関連するtweet_bookmarksも削除される' do
        user.tweet_bookmarks.create!(tweet_id: tweet.id)
        expect { tweet.destroy }.to change(TweetBookmark.all, :count).by(-1)
      end
    end
  end
end
