#==== Build Stage ====#
FROM node:12-alpine as base

WORKDIR /src
COPY package.json /src/
COPY .env.docker .env
COPY ./init.sh init.sh
COPY . /src
EXPOSE 3333
RUN npm i -g @adonisjs/cli pm2
RUN chmod 755 /src/init.sh

#==== Deploy Stage ====#
FROM base as production

ENV NODE_ENV=production
RUN npm install
CMD ["npm", "run", "serve"]



