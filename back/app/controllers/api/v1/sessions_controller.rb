module Api
  module V1
    class SessionsController < ApplicationController
      def new
        @title = 'ログイン'
      end

      def create
        user = User.find_by(email: params[:session][:email].downcase)
        if user && user.authenticate(params[:session][:password])
          log_in user
          params[:session][:remember_me] ? remember(user) : forget(user)
          message = [I18n.t('sessions.create.flash.success')]
          render json: { status: 'success', message: message }
        else
          message = [I18n.t('sessions.create.flash.danger')]
          render json: { status: 'failure', message: message }
        end
      end

      def destroy
        log_out if logged_in?
        message = [I18n.t('sessions.destroy.flash.success')]
        render json: { status: 'success', message: message }
      end

      def check_session
        # ログイン中のユーザー情報を返す
        render json: { user: current_user }
      end
    end
  end
end