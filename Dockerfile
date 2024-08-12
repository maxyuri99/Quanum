FROM node:16-alpine

WORKDIR /app

RUN npm install -g npm@8.19.4

COPY package*.json ./

RUN npm set-script postinstall ""

RUN npm install --legacy-peer-deps

RUN npm set-script postinstall "npm run build"

COPY . .

# Instale `apexcharts` para resolver a dependência ausente
RUN npm install apexcharts --legacy-peer-deps --save

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "serve", "--", "--disable-host-check"]

