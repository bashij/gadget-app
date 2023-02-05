require 'rails_helper'

RSpec.describe Membership, type: :model do
  let(:user) { create(:user) }
  let(:community) { create(:community) }
  let!(:membership) { user.memberships.create(community_id: community.id) }

  describe 'validation' do
    specify 'user_id,community_idがある場合、有効である' do
      expect(membership).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        membership.user_id = ''
        membership.valid?
        expect(membership.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'community_id' do
      specify '存在しない場合、無効である' do
        membership.community_id = ''
        membership.valid?
        expect(membership.errors[:community_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'user_id,community_idの組み合わせが重複する場合、無効である' do
        duplicate_membership = user.memberships.build(community_id: community.id)
        duplicate_membership.valid?
        expect(duplicate_membership.errors[:user_id]).to include('はすでに存在します')
      end
    end
  end
end
