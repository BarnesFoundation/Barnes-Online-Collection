#!/bin/sh

export HOME=/home/ubuntu

cd /usr/local/barnes/projects/barnes-collection-www

sudo npm i -g npm
sudo npm install
sudo npm run build

sudo pm2 restart "Barnes Collection Website" --env production --update-env
