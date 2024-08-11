FROM node:16-alpine

WORKDIR /app

# Verifique o conteúdo inicial do diretório /app
RUN ls -la /app

RUN npm install -g npm@8.19.4

RUN npm --version

# Copie os arquivos de dependências
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Copie o restante do código da aplicação
COPY . .

# Verifique se os arquivos foram copiados corretamente
RUN ls -la /app
RUN ls -la /app/src

# Compile a aplicação (use "build" ao invés de "start" para compilar)
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "serve"]
