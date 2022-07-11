require 'rails_helper'

RSpec.describe Comment, type: :model do
  let(:user) { create(:user) }
  let(:gadget) { create(:gadget) }
  let!(:comment) { user.comments.create(gadget_id: gadget.id, content: 'コメントテスト') }

  describe 'validation' do
    specify 'user_id,gadget_id,contentがある場合、有効である' do
      expect(comment).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        comment.user_id = ''
        comment.valid?
        expect(comment.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'gadget_id' do
      specify '存在しない場合、無効である' do
        comment.gadget_id = ''
        comment.valid?
        expect(comment.errors[:gadget_id]).to include('を入力してください')
      end
    end

    describe 'content' do
      specify '存在しない場合、無効である' do
        comment.content = ''
        comment.valid?
        expect(comment.errors[:content]).to include('を入力してください')
      end

      specify '141文字以上の場合、無効である' do
        comment.content = 'a' * 141
        comment.valid?
        expect(comment.errors[:content]).to include('は140文字以内で入力してください')
      end
    end
  end
end
