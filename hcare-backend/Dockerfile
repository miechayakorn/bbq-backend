#==== Build Stage ====#
FROM node:12-alpine as base

WORKDIR /src
COPY package.json /src/

ENV HOST=0.0.0.0
ENV PORT=3333
ENV NODE_ENV=production
ENV TZ=Asia/Bangkok
ENV APP_URL=http://${HOST}:${PORT}
ENV CACHE_VIEWS=false
ENV APP_KEY=$APP_KEY
ENV DB_CONNECTION=mysql
ENV DB_HOST=aws.miee.cf
ENV DB_PORT=3306
ENV DB_USER=$MYSQL_USER
ENV DB_PASSWORD=$MYSQL_PASSWORD
ENV DB_DATABASE=$MYSQL_DATABASE
ENV SESSION_DRIVER=cookie
ENV HASH_DRIVER=bcrypt
ENV MAIL_CONNECTION=smtp
ENV SMTP_HOST=smtp.gmail.com
ENV SMTP_PORT=587
ENV MAIL_USERNAME=$MAIL_USERNAME
ENV MAIL_PASSWORD=$MAIL_PASSWORD
ENV VUE_APP_FONTEND_URL=$VUE_APP_FONTEND_URL
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL

COPY . /src
RUN npm i -g @adonisjs/cli pm2

#==== Deploy Stage ====#
FROM base as production

ENV NODE_ENV=production
RUN npm install
# CMD ["adonis", "serve", "--dev"]
CMD ["pm2-runtime", "start", "server.js"]


