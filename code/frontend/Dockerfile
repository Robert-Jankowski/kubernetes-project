FROM node:latest AS build
WORKDIR /app
COPY ./package.json .
RUN yarn install
COPY src src
COPY public public
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]