FROM node

RUN mkdir /webapp_root
ADD . /webapp_root/
WORKDIR /webapp_root

RUN npm install
RUN npm install -g bower
RUN npm install -g grunt-cli
RUN bower --allow-root install
RUN grunt deploy

EXPOSE 3000

CMD API_SCHEME=$API_SCHEME API_DOMAIN=$API_DOMAIN API_TOKEN=$API_TOKEN node server.js
