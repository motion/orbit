FROM node:4-wheezy

MAINTAINER Jason Jarrett jason@elegantcode.com

# Install pm2 *globally* so we can run our application
#RUN npm install -g pm2
RUN npm install -g nodemon

RUN mkdir -p /app
WORKDIR /app

# Add our package.json and install *before* adding our application files
ADD ./package.json /app
RUN npm install --production --loglevel=error

# Add application files
ADD ./ /app

EXPOSE 3000

## DEBUG PORT
# EXPOSE 5858
## Allow debugging the node web app..
#CMD ["nodemon", "--debug=5858", "index.js"]

CMD ["nodemon", "index.js"]
