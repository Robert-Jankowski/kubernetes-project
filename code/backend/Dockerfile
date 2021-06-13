FROM node:latest
WORKDIR /api
COPY ./package.json .
RUN yarn install
COPY src src
EXPOSE 5000
CMD ["yarn", "start"]