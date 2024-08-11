# Use uma imagem base com Node.js 16.x
FROM node:16-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instale a versão específica do npm (8.19.4)
RUN npm install -g npm@8.19.4

# Verifique a versão instalada do npm
RUN npm --version

# Defina a variável de ambiente para compatibilidade com OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências do projeto com legacy-peer-deps para evitar conflitos
RUN npm install --legacy-peer-deps

# Copie o restante do código da aplicação
COPY . .

# Verifique se o arquivo main.js está presente após a cópia
RUN ls -la /app/src

# Compile a aplicação (se for necessário para o Vue.js)
RUN npm run build

# Verifique se os arquivos foram gerados corretamente
RUN ls -la /app/dist

# Exponha a porta da aplicação
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["npm", "run", "serve"]
