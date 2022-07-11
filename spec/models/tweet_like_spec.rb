require 'rails_helper'

RSpec.describe TweetLike, type: :model do
  let(:user) { create(:user) }
  let(:tweet) { create(:tweet) }
  let!(:tweet_like) { user.tweet_likes.create(tweet_id: tweet.id) }

  describe 'validation' do
    specify 'user_id,tweet_idがある場合、有効である' do
      expect(tweet_like).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        tweet_like.user_id = ''
        tweet_like.valid?
        expect(tweet_like.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'tweet_id' do
      specify '存在しない場合、無効である' do
        tweet_like.tweet_id = ''
        tweet_like.valid?
        expect(tweet_like.errors[:tweet_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'user_id,tweet_idの組み合わせが重複する場合、無効である' do
        duplicate_tweet_like = user.tweet_likes.build(tweet_id: tweet.id)
        duplicate_tweet_like.valid?
        expect(duplicate_tweet_like.errors[:user_id]).to include('はすでに存在します')
      end
    end
  end
end
