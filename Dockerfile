############################################################
# Dockerfile to build nodjs microservices
# Based on Node 4.6
############################################################
# Set the base image to node:4.6
FROM node:4.6

WORKDIR /app
ADD ./app /app
RUN npm install
EXPOSE 3000
CMD npm start
