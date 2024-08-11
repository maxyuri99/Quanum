# Use uma imagem base com Node.js
FROM node:18-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compile a aplicação (se for necessário para o Vue.js)
RUN npm run build

# Exponha a porta da aplicação
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["npm", "run", "serve"]
