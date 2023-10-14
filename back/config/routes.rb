Rails.application.routes.draw do
  namespace :api, format: 'json' do
    namespace :v1 do
      post '/login', to: 'sessions#create'
      delete '/logout',  to: 'sessions#destroy'
      get '/check', to: 'sessions#check_session'
      resources :users do
        member do
          get :following, :followers
          get 'user_communities', to: 'communities#user_communities'          
          get 'user_tweets', to: 'tweets#user_tweets'
          get 'user_bookmark_tweets', to: 'tweets#user_bookmark_tweets'
          get 'following_users_tweets', to: 'tweets#following_users_tweets'
          get 'user_gadgets', to: 'gadgets#user_gadgets'
          get 'user_bookmark_gadgets', to: 'gadgets#user_bookmark_gadgets'
          get 'following_users_gadgets', to: 'gadgets#following_users_gadgets'
        end
      end
      resources :relationships, only: %i[create destroy]
      resources :tweets do
        resource :tweet_likes, only: %i[create destroy]
        resource :tweet_bookmarks, only: %i[create destroy]
      end
      resources :communities do
        resource :memberships, only: %i[create destroy show]
      end
      resources :gadgets do
        resource :gadget_likes, only: %i[create destroy]
        resource :gadget_bookmarks, only: %i[create destroy]
        resources :comments, only: %i[index create destroy show]
        resource :review_requests, only: %i[create destroy show]
      end
    end
  end
end
