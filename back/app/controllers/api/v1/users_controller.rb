module Api
  module V1
    class UsersController < ApplicationController
      before_action :logged_in_user, only: %i[update destroy]
      before_action :correct_user,   only: %i[update destroy]
      before_action :guest_user,     only: %i[update destroy]

      def index
        # 全てのユーザー情報(検索条件があれば一致するもののみ)
        @users = User.filter_by(params)

        render_users_json
      end

      def following
        # 詳細ページのユーザーがフォローしている全てのユーザー情報(検索条件があれば一致するもののみ)
        @users = User.find(params[:id]).following.filter_by(params)

        render_users_json
      end

      def followers
        # 詳細ページのユーザーがフォローされている全てのユーザー情報(検索条件があれば一致するもののみ)
        @users = User.find(params[:id]).followers.filter_by(params)

        render_users_json
      end

      def recommend
        # ログインユーザーへのおすすめユーザー情報(検索条件があれば一致するもののみ)
        @users = User.recommend_users(User.find(params[:id])).filter_by(params)

        render_users_json(limit_value: 2)
      end

      def show
        # 表示対象ユーザー
        @user = User.includes(:tweets).find(params[:id])
        # ユーザーに関連する件数情報
        user_count = {
          community: @user.joining_communities.size,
          tweet: @user.tweets.where(parent_id: nil).size,
          bookmarkTweet: @user.bookmarked_tweets.size,
          bookmarkGadget: @user.bookmarked_gadgets.size
        }

        render json: { user: @user, userCount: user_count },
               include: %i[gadgets tweets communities following followers review_requests
                           tweet_bookmarks gadget_bookmarks]
      end

      def create
        @user = User.new(user_params)
        if @user.save
          log_in @user
          message = [I18n.t('users.create.flash.success')]
          render json: { status: 'success', message: message }
        else
          message = @user.errors.full_messages
          render json: { status: 'failure', message: message }
        end
      end

      def update
        if @user.update(user_params)
          message = [I18n.t('users.update.flash.success')]
          render json: { status: 'success', message: message, id: @user.id }
        else
          message = @user.errors.full_messages
          render json: { status: 'failure', message: message, id: @user.id }
        end
      end

      def destroy
        User.find(params[:id]).destroy
        message = [I18n.t('users.destroy.flash.success')]
        render json: { status: 'success', message: message, isPageDeleted: true }
      end

      private

        def user_params
          params.require(:user).permit(:name, :email, :job, :introduction, :image, :password, :password_confirmation)
        end

        # 正しいユーザーかどうか確認
        def correct_user
          @user = User.find(params[:id])
          render json: { status: 'failure', message: [I18n.t('common.correct_user')] } unless current_user?(@user)
        end

        # ゲストユーザーかどうか確認
        def guest_user
          @user = User.find(params[:id])
          return unless @user.email.match?(/^sample\d+@example\.com$/)

          render json: { status: 'failure', message: [I18n.t('users.other.guest_user')] }
        end

        def render_users_json(limit_value: 5)
          paginate_users(limit_value)

          response_data = {
            users: @paginated_collection,
            pagination: @pagination_info,
            searchResultCount: @users.count
          }

          render json: response_data
        end

        # ユーザーのページネーション情報（デフォルトは5件ずつの表示とする）
        def paginate_users(limit_value)
          @paginated_collection = paginated_collection(@users, limit_value)
          @pagination_info = pagination_info(@paginated_collection)
        end
    end
  end
end
