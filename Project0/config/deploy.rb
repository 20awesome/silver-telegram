# config valid only for Capistrano 3.1
lock '3.2.1'
set :application, 'aliveshoes'
set :deploy_user, 'ubuntu'
set :repo_url, 'repourl'
#set :deploy_via, :remote_cache
# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }
#set :default_stage, "staging"
#set :branch, 'production-test'
#set :branch, 'production'

set :branch, 'master'
# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/ubuntu/aliveshoes'
# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true
# Default value for :linked_files is []

# Default value for linked_dirs is []
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
#set :linked_dirs, %w{backups cgi-bin  HHB-Portal  sites/default sites/intranet.2samen.nl vhosts webalizer}
#set :linked_files, %w{config/database.yml}
set :linked_files, %w{config/database.yml config/schedule.rb}
# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
#set :default_env, { rvm_bin_path: '~/.rvm/bin' }

#set :rails_env, "production_test"
set :rails_env, "production"

set :conditionally_migrate, false
set :migration_role, 'migrator'   
#set :rails_env = ENV['RAILS_ENV'] || 'production_test'
# Default value for keep_releases is 5
set :keep_releases, 3
#set :user, 'ubuntu'

set :rvm_type, :user
#set :rvm_ruby_version, '1.9.3@aliveshoes --create --default'
set :rvm_ruby_version, '2.1.3@aliveshoes --create --default'


set :unicorn_config_path , "config/unicorn.rb"
#set :unicorn_rack_env, "production_test"
set :unicorn_rack_env, "production"
#set :unicorn_default_pid, "/home/ubuntu/aliveshoes/shared/tmp/pids/unicorn.pid"
#set :shared_path, "/home/ubuntu/aliveshoes/shared"
#set :unicorn_pid, "#{fetch(:shared_path)}/tmp/pids/unicorn.pid"

set :sidekiq_config, "#{current_path}/config/sidekiq.yml"
set :sidekiq_role , "sidekiq_server_role"
#namespace :bundle do
#  desc "run bundle install and ensure all gem requirements are met"
#  task :install do
#    run "cd #{current_path} && bundle install  --without=test --no-update-sources"
#  end

#end
#before "deploy:restart", "bundle:install"



set :whenever_identifier, ->{ "#{fetch(:application)}_#{fetch(:stage)}" }
set :whenever_roles, ->{ :crontab_workers }
set :whenever_identifier,   ->{ fetch :application }

# Clean up all older releases
# This is where the actual deployment with Unicorn happens.
namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      #execute :touch, release_path.join('tmp/restart.txt')
      #invoke 'unicorn:restart'
	#execute "sudo service unicorn upgrade"      
	invoke 'unicorn:legacy_restart'
	end
  end
 after :deploy, "deploy:restart"
  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      # execute :rake, 'cache:clear'
      # end
    end
  end

after :restart, "setup:symlink_config"
before 'deploy:rollback', 'unicorn:stop'
after 'deploy:rollback', 'deploy:restart'

after :finishing, 'setup:upload_schedule'
end


