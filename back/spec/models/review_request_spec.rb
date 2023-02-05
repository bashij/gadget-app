require 'rails_helper'

RSpec.describe ReviewRequest, type: :model do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget) }
  let!(:review_request) { user.review_requests.create(gadget_id: gadget.id) }

  describe 'validation' do
    specify 'user_id,gadget_idがある場合、有効である' do
      expect(review_request).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        review_request.user_id = ''
        review_request.valid?
        expect(review_request.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'gadget_id' do
      specify '存在しない場合、無効である' do
        review_request.gadget_id = ''
        review_request.valid?
        expect(review_request.errors[:gadget_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'user_id,gadget_idの組み合わせが重複する場合、無効である' do
        duplicate_review_request = user.review_requests.build(gadget_id: gadget.id)
        duplicate_review_request.valid?
        expect(duplicate_review_request.errors[:user_id]).to include('はすでに存在します')
      end
    end
  end
end
