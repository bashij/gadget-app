require 'rails_helper'

RSpec.describe Gadget, type: :model do
  let(:gadget) { create(:gadget) }
  let(:user) { create(:user) }

  describe 'validation' do
    specify 'user_id, name, categoryがある場合、有効である' do
      gadget.model_number = ''
      gadget.manufacturer = ''
      gadget.price = ''
      gadget.other_info = ''
      gadget.review = ''
      expect(gadget).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        gadget.user_id = ''
        gadget.valid?
        expect(gadget.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'name' do
      specify '存在しない場合、無効である' do
        gadget.name = ''
        gadget.valid?
        expect(gadget.errors[:name]).to include('を入力してください')
      end

      specify '51文字以上の場合、無効である' do
        gadget.name = 'a' * 51
        gadget.valid?
        expect(gadget.errors[:name]).to include('は50文字以内で入力してください')
      end
    end

    describe 'category' do
      specify '存在しない場合、無効である' do
        gadget.category = ''
        gadget.valid?
        expect(gadget.errors[:category]).to include('を入力してください')
      end

      specify '51文字以上の場合、無効である' do
        gadget.category = 'a' * 51
        gadget.valid?
        expect(gadget.errors[:category]).to include('は50文字以内で入力してください')
      end

      specify '規定値(PC本体,モニター,キーボード,マウス,オーディオ,デスク,チェア,その他)以外の場合、無効である' do
        gadget.category = 'パソコン'
        gadget.valid?
        expect(gadget.errors[:category]).to include('は一覧にありません')
      end
    end

    describe 'model_number' do
      specify '101文字以上の場合、無効である' do
        gadget.model_number = 'a' * 101
        gadget.valid?
        expect(gadget.errors[:model_number]).to include('は100文字以内で入力してください')
      end
    end

    describe 'manufacturer' do
      specify '51文字以上の場合、無効である' do
        gadget.manufacturer = 'a' * 51
        gadget.valid?
        expect(gadget.errors[:manufacturer]).to include('は50文字以内で入力してください')
      end
    end

    describe 'price' do
      specify '数値以外の場合、無効である' do
        gadget.price = 'a'
        gadget.valid?
        expect(gadget.errors[:price]).to include('は数値で入力してください')
      end

      specify 'マイナスの場合、無効である' do
        gadget.price = -1
        gadget.valid?
        expect(gadget.errors[:price]).to include('は0以上の値にしてください')
      end

      specify '10,000,000以上の場合、無効である' do
        gadget.price = 10_000_000
        gadget.valid?
        expect(gadget.errors[:price]).to include('は9999999以下の値にしてください')
      end
    end

    describe 'other_info' do
      specify '101文字以上の場合、無効である' do
        gadget.other_info = 'a' * 101
        gadget.valid?
        expect(gadget.errors[:other_info]).to include('は100文字以内で入力してください')
      end
    end

    describe 'review' do
      specify '5001文字以上の場合、無効である' do
        gadget.review = 'a' * 5001
        gadget.valid?
        expect(gadget.errors[:review]).to include('は5000文字以内で入力してください')
      end
    end
  end

  describe 'association' do
    describe 'comments' do
      specify 'gadgetが削除された時、関連するcommentsも削除される' do
        user.comments.create!(gadget_id: gadget.id, content: 'テストコメント', parent_id: nil)
        expect { gadget.destroy }.to change(Comment.all, :count).by(-1)
      end
    end

    describe 'gadget_likes' do
      specify 'gadgetが削除された時、関連するgadget_likesも削除される' do
        user.gadget_likes.create!(gadget_id: gadget.id)
        expect { gadget.destroy }.to change(GadgetLike.all, :count).by(-1)
      end
    end

    describe 'gadget_bookmarks' do
      specify 'gadgetが削除された時、関連するgadget_bookmarksも削除される' do
        user.gadget_bookmarks.create!(gadget_id: gadget.id)
        expect { gadget.destroy }.to change(GadgetBookmark.all, :count).by(-1)
      end
    end

    describe 'review_requests' do
      specify 'gadgetが削除された時、関連するreview_requestsも削除される' do
        user.review_requests.create!(gadget_id: gadget.id)
        expect { gadget.destroy }.to change(ReviewRequest.all, :count).by(-1)
      end
    end
  end
end
