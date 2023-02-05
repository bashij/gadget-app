require 'rails_helper'

RSpec.describe GadgetBookmark, type: :model do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget) }
  let!(:gadget_bookmark) { user.gadget_bookmarks.create(gadget_id: gadget.id) }

  describe 'validation' do
    specify 'user_id,gadget_idがある場合、有効である' do
      expect(gadget_bookmark).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        gadget_bookmark.user_id = ''
        gadget_bookmark.valid?
        expect(gadget_bookmark.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'gadget_id' do
      specify '存在しない場合、無効である' do
        gadget_bookmark.gadget_id = ''
        gadget_bookmark.valid?
        expect(gadget_bookmark.errors[:gadget_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'user_id,gadget_idの組み合わせが重複する場合、無効である' do
        duplicate_gadget_bookmark = user.gadget_bookmarks.build(gadget_id: gadget.id)
        duplicate_gadget_bookmark.valid?
        expect(duplicate_gadget_bookmark.errors[:user_id]).to include('はすでに存在します')
      end
    end
  end
end
