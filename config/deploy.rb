lock '3.17.1'

set :application, 'gadget-app'
set :deploy_to, '/var/www/gadget-app'

set :repo_url,  'git@github.com:jibirian999/gadget-app.git'

set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads')
set :linked_files, fetch(:linked_files, []).push("config/master.key")

set :rbenv_type, :user
set :rbenv_ruby, '3.0.2'

set :ssh_options, auth_methods: ['publickey'],
                  keys: ['~/.ssh/my-key-ga.pem'] 

set :unicorn_pid, -> { "#{shared_path}/tmp/pids/unicorn.pid" }

set :unicorn_config_path, -> { "#{current_path}/config/unicorn.rb" }
set :keep_releases, 5

after 'deploy:publishing', 'deploy:restart'
namespace :deploy do
  task :restart do
    invoke 'unicorn:restart'
  end
end
