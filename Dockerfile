FROM ruby:3.0.2
RUN apt-get update -qq && \
    apt-get install -y build-essential node.js
RUN apt-get update && apt-get install -y curl apt-transport-https wget && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs
RUN mkdir /gadget-app
WORKDIR /gadget-app
COPY Gemfile /gadget-app/Gemfile
COPY Gemfile.lock /gadget-app/Gemfile.lock
RUN bundle install
RUN bundle exec rails webpacker:install
COPY . /gadget-app

COPY start.sh /start.sh
RUN chmod 744 /start.sh
CMD ["sh", "/start.sh"]