require 'rails_helper'

RSpec.describe GadgetLike, type: :model do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget) }
  let!(:gadget_like) { user.gadget_likes.create(gadget_id: gadget.id) }

  describe 'validation' do
    specify 'user_id,gadget_idがある場合、有効である' do
      expect(gadget_like).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        gadget_like.user_id = ''
        gadget_like.valid?
        expect(gadget_like.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'gadget_id' do
      specify '存在しない場合、無効である' do
        gadget_like.gadget_id = ''
        gadget_like.valid?
        expect(gadget_like.errors[:gadget_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'user_id,gadget_idの組み合わせが重複する場合、無効である' do
        duplicate_gadget_like = user.gadget_likes.build(gadget_id: gadget.id)
        duplicate_gadget_like.valid?
        expect(duplicate_gadget_like.errors[:user_id]).to include('はすでに存在します')
      end
    end
  end
end
