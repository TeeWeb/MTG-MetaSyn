FROM node:14.17.6

WORKDIR /src

COPY package.json /src
COPY yarn.lock /src/

RUN yarn install --production
COPY . /src/

CMD npx serve build -l 8081

FROM nginx:alpine

COPY --from=build-stage /src/public/ /usr/share/nginx/html

COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf