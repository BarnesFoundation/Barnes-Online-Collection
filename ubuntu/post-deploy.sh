#!/bin/sh

cd /usr/local/barnes/projects

# the deploy installs as root, so just chown all the things
sudo chown -R ubuntu:ubuntu ./barnes-collection-www

cd ./barnes-collection-www

yarn install

yarn build

pm2 restart "Barnes Collection Website" --env production --update-env
