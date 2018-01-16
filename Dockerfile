FROM node:latest

ENV PORT=8080

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
EXPOSE 8080

ENTRYPOINT ["npm", "start"]