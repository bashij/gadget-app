Rails.application.routes.draw do
  get 'tweet_likes/create'
  get 'tweet_likes/destroy'
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
  resources :tweets, only: %i[create destroy]
  resources :relationships, only: %i[create destroy]
end
