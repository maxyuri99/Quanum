FROM node:16-alpine

WORKDIR /app

RUN npm install -g npm@8.19.4

COPY package*.json ./

# Desabilite temporariamente o postinstall para evitar a execução automática do build
RUN npm set-script postinstall ""

# Instale as dependências
RUN npm install --legacy-peer-deps

# Reative o script postinstall
RUN npm set-script postinstall "npm run build"

# Copie o restante do código da aplicação
COPY . .

# Execute o build manualmente
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "serve"]
