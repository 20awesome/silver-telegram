namespace :setup do

  desc "Upload database.yml file for www.domain.com to all servers"
  task :upload_yml do
    on roles(:app) do
      execute "mkdir -p #{shared_path}/config"
      upload! StringIO.new(File.read("config/database.yml")), "#{shared_path}/config/database.yml"
    end
  end

  desc "Upload nginx www.domain.com file to frontend servers"
  task :upload_nginx_config_frontend do
    on roles(:frontend_nginx) do
      upload! StringIO.new(File.read("config/www.domain.com_front")), "/home/ubuntu/www.domain.com_front"
      execute "mkdir /home/ubuntu/old_nginx_configs;sudo mv /etc/nginx/sites-enabled/www.domain.com /home/ubuntu/old_nginx_configs/www.domain.com_$(date +%F_%R)"
      execute "sudo cp /home/ubuntu/www.domain.com_front /etc/nginx/sites-enabled/www.domain.com && sudo service nginx reload"
    end
  end

  desc "Upload nginx.conf to frontend servers"
  task :upload_nginx_global_config_frontend do
    on roles(:frontend_nginx) do
      upload! StringIO.new(File.read("config/nginx.conf")), "/home/ubuntu/nginx.conf"
      execute "mkdir /home/ubuntu/old_nginx_configs;sudo mv /etc/nginx/nginx.conf /home/ubuntu/old_nginx_configs/nginx.conf_$(date +%F_%R)"
      execute "sudo cp /home/ubuntu/nginx.conf /etc/nginx/nginx.conf && sudo service nginx restart"
    end
  end




  desc "Upload nginx www.domain.com file to static servers"
  task :upload_nginx_config_static do
    on roles(:static_nginx) do
      upload! StringIO.new(File.read("config/www.domain.com_static")), "/home/ubuntu/www.domain.com_static" 
      execute "mkdir /home/ubuntu/old_nginx_configs;sudo mv /etc/nginx/sites-enabled/www.domain.com /home/ubuntu/old_nginx_configs/www.domain.com_$(date +%F_%R)"
      execute "sudo cp /home/ubuntu/www.domain.com_static /etc/nginx/sites-enabled/www.domain.com && sudo /etc/init.d/nginx restart"
    end
  end


  desc "Symlinks,exec,sidekiq start file for Builder "
  task :symlink_config do
  domain_env_custom="#{fetch(:rails_env)}"
      on roles(:concept) do
      execute "cd /home/ubuntu/domain/current && gcc -o script/generate_shoe `Magick-config --cflags --cppflags` app/domain/generate_shoe.c `Magick-config --ldflags --libs` -std=c99"
      execute "ln -nfs /home/ubuntu/mnt/domain-textures/ /home/ubuntu/domain/current/app/assets/images/shoes/model_parts"
      execute "sudo sed -i 's/^APP_ENV=.*$/APP_ENV=#{domain_env_custom}/' /etc/init.d/sidekiq"
    end
      on roles(:app) do
      execute "sudo sed -i 's/^ENV=.*$/ENV=#{domain_env_custom}/' /etc/init.d/unicorn"
      #upload! StringIO.new(File.read("config/unicorn.rb")), "/home/ubuntu/unicorn.rb"
      #execute "cp /home/ubuntu/unicorn.rb /home/ubuntu/domain/current/config/unicorn.rb"
    end
end

  desc "Fast deploy without db:migrate and db:seed"
  task :fast_deploy do
  set :migration_role, 'trulala' 
  invoke "deploy"
  end


  desc "Upload schedule.rb fle for whnever everywhere"
  task :upload_schedule_everywhere do
    on roles(:app) do
      execute "mkdir -p #{shared_path}/config"
      upload! StringIO.new(File.read("config/schedule.rb")), "#{shared_path}/config/schedule.rb"
    end
  end



  desc "Upload schedule.rb file for whenever crontab and update it"
  task :upload_schedule do
    on roles(:crontab_workers) do
      execute "mkdir -p #{shared_path}/config"
      upload! StringIO.new(File.read("config/schedule.rb")), "#{shared_path}/config/schedule.rb"
     within current_path do
        execute :bundle, :exec, "whenever --update-crontab #{fetch(:application)}"
      end
    end
  end

  desc "Change git repo"
  task :update_repo_url do
    on roles(:all) do
      within repo_path do
        execute :git, 'remote', 'set-url', 'origin', fetch(:repo_url)
      end
    end
  end

desc "Install ruby-2.1.3"
 task :install_ruby_213 do
 	on roles(:app) do
 		execute "source ~/.rvm/scripts/rvm  && rvm install ruby-2.1.3 && rvm use 2.1.3@domain --create && cd /home/ubuntu/domain/current && bundle install"
 	end
 end


  desc "Disable front servers and start maintenance page"
  task :maintenance_start do
    on roles(:frontend_nginx) do
      execute "sudo service monit stop"
      execute "sudo service nginx stop"
    end
    on roles(:for_tech_use2) do
      execute "sudo service nginx start"
    end
  end

  desc "Enable front servers and stop maintenance page"
  task :maintenance_stop do
  on roles(:frontend_nginx) do
      execute "sudo service nginx start"
      execute "sudo service monit start"
    end
    on roles(:for_tech_use2) do
      execute "sudo service nginx stop"
    end
  end


  desc "Pull last changes for textures"
  task :textures_pull do
    on roles(:concept) do
      execute "cd /home/ubuntu/mnt/domain-textures/ && git pull"
    end
end



end
