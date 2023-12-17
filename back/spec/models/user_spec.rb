require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }
  let(:other_user) { create(:user) }

  describe 'validation' do
    specify 'name,email,job,passwordがある場合、有効である' do
      user.image = ''
      expect(user).to be_valid
    end

    describe 'name' do
      specify '存在しない場合、無効である' do
        user.name = ''
        user.valid?
        expect(user.errors[:name]).to include('を入力してください')
      end

      specify '21文字以上の場合、無効である' do
        user.name = 'a' * 21
        user.valid?
        expect(user.errors[:name]).to include('は20文字以内で入力してください')
      end
    end

    describe 'email' do
      specify '存在しない場合、無効である' do
        user.email = ''
        user.valid?
        expect(user.errors[:email]).to include('を入力してください')
      end

      specify '256文字以上の場合、無効である' do
        user.email = 'a' * 256
        user.valid?
        expect(user.errors[:email]).to include('は255文字以内で入力してください')
      end

      specify '異常な形式である場合、無効である' do
        invalid_addresses = %w[user@example,com user_at_foo.org user.name@example. foo@bar_baz.com foo@bar+baz.com]
        invalid_addresses.each do |invalid_address|
          user.email = invalid_address
          user.valid?
          expect(user.errors[:email]).to include('は不正な値です')
        end
      end

      specify '重複する場合、無効である' do
        user.save
        duplicate_user = build(:user, email: user.email.upcase)
        duplicate_user.valid?
        expect(duplicate_user.errors[:email]).to include('はすでに存在します')
      end
    end

    describe 'job' do
      specify '存在しない場合、無効である' do
        user.job = ''
        user.valid?
        expect(user.errors[:job]).to include('を入力してください')
      end

      specify '51文字以上の場合、無効である' do
        user.job = 'a' * 51
        user.valid?
        expect(user.errors[:job]).to include('は50文字以内で入力してください')
      end

      specify '規定値(IT系,非IT系,学生,YouTuber/ブロガー,その他)以外の場合、無効である' do
        user.job = '営業'
        user.valid?
        expect(user.errors[:job]).to include('は一覧にありません')
      end
    end

    describe 'password' do
      specify '存在しない場合、無効である' do
        user.password = user.password_confirmation = ' ' * 6
        user.valid?
        expect(user.errors[:password]).to include('を入力してください')
      end

      specify '5文字以下の場合、無効である' do
        user.password = user.password_confirmation = 'a' * 5
        user.valid?
        expect(user.errors[:password]).to include('は6文字以上で入力してください')
      end

      specify '暗号化されていない場合、無効である' do
        user.save
        expect(user.password_digest).not_to eq 'password'
      end

      specify 'password_confirmationと一致しない場合、無効である' do
        user.password = 'password'
        user.password_confirmation = 'foobar'
        expect(user).not_to be_valid
      end
    end
  end

  describe 'association' do
    describe 'tweets' do
      specify 'userが削除された時、関連するtweetsも削除される' do
        user.save
        user.tweets.create!(content: 'テストツイート')
        expect { user.destroy }.to change(Tweet.all, :count).by(-1)
      end
    end

    describe 'gadgets' do
      specify 'userが削除された時、関連するgadgetsも削除される' do
        user.save
        user.gadgets.create!(name: 'テストガジェット', category: 'PC本体')
        expect { user.destroy }.to change(Gadget.all, :count).by(-1)
      end
    end

    describe 'active_relationships' do
      specify 'userが削除された時、関連するactive_relationshipsも削除される' do
        user.save
        user.follow(other_user)
        expect { user.destroy }.to change(Relationship.all, :count).by(-1)
      end
    end

    describe 'passive_relationships' do
      specify 'userが削除された時、関連するpassive_relationshipsも削除される' do
        user.save
        other_user.follow(user)
        expect { user.destroy }.to change(Relationship.all, :count).by(-1)
      end
    end

    describe 'tweet_likes' do
      specify 'userが削除された時、関連するtweet_likesも削除される' do
        user.save
        other_user.tweets.create!(content: 'テストツイート')
        user.tweet_likes.create!(tweet_id: Tweet.last.id)
        expect { user.destroy }.to change(TweetLike.all, :count).by(-1)
      end
    end

    describe 'tweet_bookmarks' do
      specify 'userが削除された時、関連するtweet_bookmarksも削除される' do
        user.save
        other_user.tweets.create!(content: 'テストツイート')
        user.tweet_bookmarks.create!(tweet_id: Tweet.last.id)
        expect { user.destroy }.to change(TweetBookmark.all, :count).by(-1)
      end
    end

    describe 'comments' do
      specify 'userが削除された時、関連するcommentsも削除される' do
        user.save
        other_user.gadgets.create!(name: 'テストガジェット', category: 'PC本体')
        user.comments.create!(gadget_id: Gadget.last.id, content: 'テストコメント', parent_id: nil)
        expect { user.destroy }.to change(Comment.all, :count).by(-1)
      end
    end

    describe 'gadget_likes' do
      specify 'userが削除された時、関連するgadget_likesも削除される' do
        user.save
        other_user.gadgets.create!(name: 'テストガジェット', category: 'PC本体')
        user.gadget_likes.create!(gadget_id: Gadget.last.id)
        expect { user.destroy }.to change(GadgetLike.all, :count).by(-1)
      end
    end

    describe 'gadget_bookmarks' do
      specify 'userが削除された時、関連するgadget_bookmarksも削除される' do
        user.save
        other_user.gadgets.create!(name: 'テストガジェット', category: 'PC本体')
        user.gadget_bookmarks.create!(gadget_id: Gadget.last.id)
        expect { user.destroy }.to change(GadgetBookmark.all, :count).by(-1)
      end
    end

    describe 'review_requests' do
      specify 'userが削除された時、関連するreview_requestsも削除される' do
        user.save
        other_user.gadgets.create!(name: 'テストガジェット', category: 'PC本体')
        user.review_requests.create!(gadget_id: Gadget.last.id)
        expect { user.destroy }.to change(ReviewRequest.all, :count).by(-1)
      end
    end

    describe 'communities' do
      specify 'userが削除された時、関連するcommunitiesも削除される' do
        user.save
        user.communities
            .create!(name: 'テストコミュニティ',
                     image: Rack::Test::UploadedFile.new(Rails.root.join('app/assets/images/default.jpeg')))
        expect { user.destroy }.to change(Community.all, :count).by(-1)
      end
    end

    describe 'memberships' do
      specify 'userが削除された時、関連するmembershipsも削除される' do
        user.save
        other_user.communities
                  .create!(name: 'テストコミュニティ',
                           image: Rack::Test::UploadedFile.new(Rails.root.join('app/assets/images/default.jpeg')))
        user.memberships.create!(community_id: Community.last.id)
        expect { user.destroy }.to change(Membership.all, :count).by(-1)
      end
    end
  end
end
