FROM node:7

RUN npm install -g nodemon

WORKDIR /app

# COPY package.json /src/package.json
# COPY lib /src

RUN npm install --production

EXPOSE 3000

CMD nodemon lib/start.js
