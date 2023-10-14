#!/bin/bash

sudo service nginx start
cd /gadget-app/back
RAILS_ENV=production bin/rails db:migrate
bundle exec pumactl start