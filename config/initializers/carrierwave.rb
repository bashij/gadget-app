if Rails.env.production?
  CarrierWave.configure do |config|
    config.storage = :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory = 'ga-prod-bucket01'
    config.asset_host = 'https://s3-ap-northeast-1.amazonaws.com/ga-prod-bucket01'
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      aws_secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key),
      region: 'ap-northeast-1'
    }
  end
end