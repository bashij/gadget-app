Rails.application.routes.draw do
  root   'static_pages#home'
  get    '/help',   to: 'static_pages#help'
  get    '/signup',  to: 'users#new'
  get    '/login',   to: 'sessions#new'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'
  resources :users do
    member do
      get :following, :followers
    end
  end
  resources :tweets, only: %i[create destroy] do
    resource :tweet_likes, only: %i[create destroy]
    resource :tweet_bookmarks, only: %i[create destroy]
  end
  resources :gadgets do
    resource :gadget_likes, only: %i[create destroy]
    resource :gadget_bookmarks, only: %i[create destroy]
    resources :comments, only: %i[create destroy]
    resource :review_requests, only: %i[create destroy show]
  end
  resources :communities do
    resource :memberships, only: %i[create destroy]
  end
  resources :relationships, only: %i[create destroy]
  namespace :api, format: 'json' do
    namespace :v1 do
      resources :users
      post '/login', to: 'sessions#create'
      get '/check', to: 'sessions#check_session'
      resources :tweets do
        resource :tweet_likes, only: %i[create destroy]
        resource :tweet_bookmarks, only: %i[create destroy]
      end
    end
    resources :health_check, only: :index
  end
end
