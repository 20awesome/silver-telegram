# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary
# server in each group is considered to be the first
# unless any hosts have the primary property set.
# Don't declare `role :all`, it's a meta role
#stage.masterofcode.com -p3242
role :app, %w{ubuntu@172.31.36.42:22}
#role :sidekiq_server_role, %w{ubuntu@172.31.36.42:22}

#role :app, %w{ubuntu@172.31.35.3:22}
#role :sidekiq_server_role, %w{ubuntu@172.31.35.3:22}
#role :web, %w{deployer@192.168.122.75}
#role :db,  %w{deployer@192.168.122.75}

# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server
# definition into the server list. The second argument
# something that quacks like a hash can be used to set
# extended properties on the server.
server 'ubuntu@172.31.36.42:22', user: 'ubuntu', roles: %w{app}
#server 'ubuntu@172.31.35.3:22', user: 'ubuntu', roles: %w{app}
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
#https://github.com/seuros/capistrano-sidekiq/wiki
#for sidekiq working must be "set :pty, false"
set :pty, true

set :ssh_options, {
    forward_agent: true,
    auth_methods: ["publickey"],
    keys: ["/home/ubuntu/14102014aliveshoes-key.pem"]
}
