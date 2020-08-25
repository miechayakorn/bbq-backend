#!/bin/bash
echo APP_KEY=$APP_KEY >> .env.docker
echo DB_USER=$MYSQL_USER >> .env.docker
echo DB_PASSWORD=$MYSQL_PASSWORD >> .env.docker
echo DB_DATABASE=$MYSQL_DATABASE >> .env.docker
echo MAIL_USERNAME=$MAIL_USERNAME >> .env.docker
echo MAIL_PASSWORD=$MAIL_PASSWORD >> .env.docker

if [ "$CI_COMMIT_BRANCH" == "develop" ]; then
    echo "------- + $CI_COMMIT_BRANCH + -------- develop"
    echo VUE_APP_FONTEND_URL=$VUE_APP_FONTEND_URL_DEV >> .env.docker
    echo VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL_DEV >> .env.docker
else
    echo "------- + $CI_COMMIT_BRANCH + -------- else"
    echo VUE_APP_FONTEND_URL=$VUE_APP_FONTEND_URL >> .env.docker
    echo VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL >> .env.docker
fi