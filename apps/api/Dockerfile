FROM node:7

MAINTAINER Jason Jarrett jason@elegantcode.com

RUN npm install -g nodemon

RUN mkdir -p /app
WORKDIR /app

# Add package.json and install *before* adding our application files
ADD ./package.json /app
RUN npm install --production --loglevel=error

# Add application files
ADD ./lib /app

EXPOSE 3000

CMD ["nodemon", "start.js"]
