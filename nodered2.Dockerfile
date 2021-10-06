FROM nodered/node-red
USER root

RUN npm install --unsafe-perm --no-update-notifier --no-fund
RUN npm install @node-red-contrib-themes/midnight-red
RUN npm install node-binance-api

WORKDIR /usr/src/node-red
