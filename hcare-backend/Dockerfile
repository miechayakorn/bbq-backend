#==== Build Stage ====#
FROM node:12-alpine as base

WORKDIR /src
COPY package.json /src/
COPY .env.docker .env
COPY ./init.sh init.sh
COPY . /src
RUN npm i -g @adonisjs/cli pm2
RUN chmod +x /src/init.sh
RUN /src/init.sh

#==== Deploy Stage ====#
FROM base as production

ENV NODE_ENV=production
RUN npm install
CMD ["npm", "run", "serve"]



