FROM node:14.17.6

WORKDIR /src

ENV PATH /src/node_modules/.bin:$PATH

COPY package*.json ./
COPY . ./
RUN npm install --production
EXPOSE 1234
RUN npm install react-scripts@3.4.1 -g

CMD npm run build