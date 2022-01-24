Rails.application.routes.draw do
  root   'static_pages#home'
  get    '/about',   to: 'static_pages#about'
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
  resources :gadgets
  resources :relationships, only: %i[create destroy]
end
