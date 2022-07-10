require 'rails_helper'

RSpec.describe Community, type: :model do
  let(:community) { create(:community) }
  let(:user) { create(:user) }

  describe 'validation' do
    specify 'user_id, nameがある場合、有効である' do
      community.image = ''
      expect(community).to be_valid
    end

    describe 'user_id' do
      specify '存在しない場合、無効である' do
        community.user_id = ''
        community.valid?
        expect(community.errors[:user_id]).to include('を入力してください')
      end
    end

    describe 'name' do
      specify '存在しない場合、無効である' do
        community.name = ''
        community.valid?
        expect(community.errors[:name]).to include('を入力してください')
      end

      specify '51文字以上の場合、無効である' do
        community.name = 'a' * 51
        community.valid?
        expect(community.errors[:name]).to include('は50文字以内で入力してください')
      end
    end
  end

  describe 'association' do
    describe 'memberships' do
      specify 'communityが削除された時、関連するmembershipsも削除される' do
        user.memberships.create!(community_id: community.id)
        expect { community.destroy }.to change(Membership.all, :count).by(-1)
      end
    end
  end
end
