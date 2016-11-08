# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

set :output, "log/cron.log"

# => CHECKING TIMER AND QUORUM
every 2.minutes do
  command "rvm use 2.1.3@aliveshoes"
  runner "Custom.all_automated_check_quorum"
end

# => GOOGLE ANALYTICS GOAL MONITOR
every 1.hours do
  command "rvm use 2.1.3@aliveshoes"
  runner "GoalMonitor.log_data_from_ga"
end

every 30.minutes do
  command "rvm use 2.1.3@aliveshoes"
  runner "Custom.update_viewed"
end

