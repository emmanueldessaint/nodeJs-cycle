FROM node:16 AS nws-back

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

EXPOSE 8000

ENTRYPOINT ["node", "server.js"]