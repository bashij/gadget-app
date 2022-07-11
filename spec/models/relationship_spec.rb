require 'rails_helper'

RSpec.describe Relationship, type: :model do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let!(:active_relationship) { user.active_relationships.create(followed_id: other_user.id) }
  let!(:passive_relationship) { user.passive_relationships.create(follower_id: other_user.id) }

  describe 'validation' do
    specify 'followed_idがある場合、有効である' do
      expect(active_relationship).to be_valid
    end

    specify 'follower_idがある場合、有効である' do
      expect(passive_relationship).to be_valid
    end

    describe 'followed_id' do
      specify '存在しない場合、無効である' do
        active_relationship.followed_id = ''
        active_relationship.valid?
        expect(active_relationship.errors[:followed_id]).to include('を入力してください')
      end
    end

    describe 'follower_id' do
      specify '存在しない場合、無効である' do
        passive_relationship.follower_id = ''
        passive_relationship.valid?
        expect(passive_relationship.errors[:follower_id]).to include('を入力してください')
      end
    end

    describe 'uniqueness' do
      specify 'followed_id,follower_idの組み合わせが重複する場合、無効である' do
        duplicate_active_relationship = user.active_relationships.build(followed_id: other_user.id)
        duplicate_active_relationship.valid?
        expect(duplicate_active_relationship.errors[:follower_id]).to include('はすでに存在します')
      end

      specify 'follower_id,followed_idの組み合わせが重複する場合、無効である' do
        duplicate_passive_relationship = user.passive_relationships.build(follower_id: other_user.id)
        duplicate_passive_relationship.valid?
        expect(duplicate_passive_relationship.errors[:followed_id]).to include('はすでに存在します')
      end
    end
  end
end
