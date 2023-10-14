require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_mailbox/engine'
require 'action_text/engine'
require 'action_view/railtie'
require 'action_cable/engine'
require 'sprockets/railtie'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module GadgetApp
  class Application < Rails::Application
    # API専用とする
    config.api_only = true
    # デフォルト設定で初期化
    config.load_defaults 6.1

    # タイムゾーンを日本とする
    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local

    # デフォルトの言語を日本語とする
    config.i18n.default_locale = :ja
    config.i18n.load_path += Dir[Rails.root.join('config/locales/**/*.{rb,yml}').to_s]

    # テストを自動生成しない
    config.generators.system_tests = nil

    # frontからのリソース取得を許可する
    config.middleware.insert_before 0, Rack::Cors do
      allow do
          origins "http://localhost:8000", "https://www.gadgetlink-app.com"
          resource "*",
            headers: :any,
            credentials: true,
            methods: [:get, :post, :patch, :delete, :options, :head]
      end
    end

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore,
                          domain: :all,
                          tld_length: 2,
                          secure: true
    config.action_dispatch.cookies_same_site_protection = nil
  end
end
