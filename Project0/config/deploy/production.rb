# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary
# server in each group is considered to be the first
# unless any hosts have the primary property set.
# Don't declare `role :all`, it's a meta role
#stage.masterofcode.com -p3242

#role :app, %w{ubuntu@172.31.38.59:22} #front2
#role :app, %w{ubuntu@172.31.38.61:22} #front3
#role :app, %w{ubuntu@172.31.38.60:22} #front4
#role :app, %w{ubuntu@172.31.38.62:22} #front5


#role :app, %w{ubuntu@172.31.32.194:22} #static6
#role :app, %w{ubuntu@172.31.35.85:22} #static7
#role :app, %w{ubuntu@172.31.35.83:22} #static8
#role :app, %w{ubuntu@172.31.35.84:22} #static9


#role :app, %w{ubuntu@172.31.40.95:22} #static10
#role :app, %w{ubuntu@172.31.40.98:22} #static11
role :app, %w{ubuntu@172.31.40.97:22} #static12
role :app, %w{ubuntu@172.31.40.96:22} #static14



role :app, %w{ubuntu@172.31.36.102:22} #admin3ram


#role :app, %w{ubuntu@172.31.40.109:22} #concept2
#role :app, %w{ubuntu@172.31.38.208:22} #concept3
role :app, %w{ubuntu@172.31.32.152:22} #concept4
role :app, %w{ubuntu@172.31.32.153:22} #concept5

#role :concept, %w{ubuntu@172.31.40.109:22} #concept2
#role :concept, %w{ubuntu@172.31.38.208:22} #concept3
role :concept, %w{ubuntu@172.31.32.152:22} #concept4
role :concept, %w{ubuntu@172.31.32.153:22} #concept5
role :concept, %w{ubuntu@172.31.36.102:22} #admin3ram

#role :sidekiq_server_role, %w{ubuntu@172.31.40.109:22}
role :sidekiq_server_role, %w{ubuntu@172.31.36.102:22} #admin3ram
role :migrator, %w{ubuntu@172.31.32.153:22}


#role :frontend_nginx, %w{ubuntu@172.31.38.59:22}
#role :frontend_nginx, %w{ubuntu@172.31.38.61:22}
#role :frontend_nginx, %w{ubuntu@172.31.38.60:22}
#role :frontend_nginx, %w{ubuntu@172.31.38.62:22}


#role :static_nginx, %w{ubuntu@172.31.32.194:22} #static6
#role :static_nginx, %w{ubuntu@172.31.35.85:22} #static7
#role :static_nginx, %w{ubuntu@172.31.35.83:22} #static8
#role :static_nginx, %w{ubuntu@172.31.35.84:22} #static9

#role :static_nginx, %w{ubuntu@172.31.40.95:22} #static10
#role :static_nginx, %w{ubuntu@172.31.40.98:22} #static11
role :static_nginx, %w{ubuntu@172.31.40.97:22} #static12
role :static_nginx, %w{ubuntu@172.31.40.96:22} #static14




role :crontab_workers,  %w{ubuntu@172.31.32.153:22} #concept5

#role :for_tech_use2, %w{ubuntu@172.31.33.203:22} #for_tech_use2

#role :web, %w{deployer@192.168.122.75}
#role :db,  %w{deployer@192.168.122.75}

# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server
# definition into the server list. The second argument
# something that quacks like a hash can be used to set
# extended properties on the server.
#server 'ubuntu@172.31.35.129:22', user: 'ubuntu', roles: %w{app}
#server 'ubuntu@172.31.37.16:22', user: 'ubuntu', roles: %w{app}
#server 'ubuntu@172.31.40.186:22', user: 'ubuntu', roles: %w{app}
#server 'ubuntu@172.31.46.54:22', user: 'ubuntu', roles: %w{app}

# you can set custom ssh options
# it's possible to pass any option but you need to keep in mind that net/ssh understand limited list of options
# you can see them in [net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start)
# set it globally
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
# and/or per server
# server 'example.com',
#   user: 'user_name',
#   roles: %w{web app},
#   ssh_options: {
#     user: 'deployer',
#     keys: %w(/home/neb0t/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey),
#  }
set :pty, false

set :ssh_options, {
    forward_agent: true,
    auth_methods: ["publickey"],
    keys: ["/home/ubuntu/14102014aliveshoes-key.pem"]
}
