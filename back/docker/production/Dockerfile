FROM ruby:3.0.2 AS base

WORKDIR /gadget-app/back
ENV RAILS_ENV production
ENV NODE_MAJOR_VERSION 14
ENV BUNDLE_DEPLOYMENT true
ENV BUNDLE_PATH vendor/bundle
ENV BUNDLE_WITHOUT development:test
RUN gem update --system && gem install bundler:2.1.4

# builder
FROM base AS builder

RUN curl -sL https://deb.nodesource.com/setup_$NODE_MAJOR_VERSION.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo 'deb http://dl.yarnpkg.com/debian/ stable main' > /etc/apt/sources.list.d/yarn.list && \
    apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    vim locales build-essential curl libpq-dev libmariadb-dev nodejs yarn nginx sudo

# bundle
FROM builder AS bundle

COPY Gemfile Gemfile.lock .
RUN bundle install --jobs=4 --retry=3 && rm -rf $BUNDLE_PATH/ruby/$RUBY_VERSION/cache/*

# yarn
FROM builder AS yarn

COPY package.json yarn.lock .
RUN yarn install --production --frozen-lockfile && yarn cache clean

# main
FROM builder AS main

COPY . .

COPY --from=bundle /gadget-app/back/vendor/bundle /gadget-app/back/vendor/bundle
COPY --from=yarn /gadget-app/back/node_modules /gadget-app/back/node_moduless

# nginx
RUN groupadd nginx
RUN useradd -g nginx nginx
ADD docker/production/nginx.conf /etc/nginx/nginx.conf
ADD docker/production/entrypoint.sh /gadget-app/back/entrypoint.sh

EXPOSE 80

RUN chmod +x /gadget-app/back/entrypoint.sh