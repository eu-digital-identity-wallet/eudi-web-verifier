# Stage 1
FROM node:latest as build-step
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN yarn install
COPY . /usr/src/app
RUN rm -rf dist
RUN yarn run build

# Stage 2
FROM nginx
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step /usr/src/app/dist/verifier-ui /usr/share/nginx/html
EXPOSE 4300
