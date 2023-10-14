FROM node:lts-buster-slim

WORKDIR /usr/src/app

COPY ../../app ./

RUN yarn install && \
    yarn build

EXPOSE 3000

CMD ["yarn", "start"]