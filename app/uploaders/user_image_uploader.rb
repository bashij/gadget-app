class UserImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  if Rails.env.production?
    storage :fog
  else
    storage :file
  end

  # 画像の登録がない場合はデフォルトを表示
  def default_url(*_args)
    # デフォルト画像（共通）
    'default.jpg'
    # デフォルト画像（ユーザー）
    # 'default_user_icon.jpg'
  end

  # アップロードファイルの保存先
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # 画像をリサイズする
  process resize_to_fit: [300, 300]

  # アップロードできるファイルの拡張子を限定する
  def extension_whitelist
    %w[jpg jpeg gif png]
  end

  def url
    if path.present?
      # 保存先がローカルの場合
      return "#{super}?updatedAt=#{model.updated_at.to_i}" if Rails.env.development? || Rails.env.test?

      # 保存先がS3の場合
      return "#{asset_host}/#{store_dir}/#{identifier}?updatedAt=#{model.updated_at.to_i}"
    end

    super
  end
end
