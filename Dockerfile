FROM node:16
WORKDIR /usr/src/app
EXPOSE 80
COPY package*.json ./
ARG NODE_ENV=production
RUN npm i
ADD . /usr/src/app
CMD npm start