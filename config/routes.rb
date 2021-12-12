Rails.application.routes.draw do
  get 'users/new'
  root 'static_pages#home'
  get  '/about', to: 'static_pages#about'
end
