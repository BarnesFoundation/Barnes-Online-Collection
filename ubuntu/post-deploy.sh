#!/bin/sh

export HOME=/home/ubuntu

cd /usr/local/barnes/projects/barnes-collection-www

sudo npm i -g npm
npm install
npm run build

pm2 restart "Barnes Collection Website"
