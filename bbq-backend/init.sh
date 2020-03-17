#!/bin/sh

#==== install node module ====#
npm i -g @adonisjs/cli pm2 && npm install && mv .env.docker .env

#==== run initial ====#
adonis key:generate
# adonis migrate
