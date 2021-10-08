FROM node:14.17.6

WORKDIR /src

COPY package.json ./
COPY yarn.lock ./
COPY . ./
RUN yarn install --production

CMD npx serve build -l 5001