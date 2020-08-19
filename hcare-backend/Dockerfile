#==== Build Stage ====#
FROM node:12-alpine as base

WORKDIR /src
COPY package.json /src/
COPY . /src
RUN npm i -g @adonisjs/cli pm2

#==== Deploy Stage ====#
FROM base as production

ENV NODE_ENV=production
RUN npm install
CMD ["pm2-runtime", "start", "server.js"]


