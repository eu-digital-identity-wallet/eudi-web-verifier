# Stage 1
FROM node:18.15.0 AS build-step
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN yarn install
COPY . /usr/src/app
RUN rm -rf dist
RUN yarn run build

# Stage 2
FROM nginx
COPY /nginx/templates/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY --from=build-step /usr/src/app/dist/verifier-ui /usr/share/nginx/html
EXPOSE 4300
