# Usar uma imagem base do Node.js para build
FROM node:16 AS build

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos do frontend para o container
COPY package.json package-lock.json ./
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Build do projeto React
RUN npm run build

# Servir os arquivos estáticos do frontend com Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Substituir a configuração padrão do Nginx pela personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 para acessar o frontend
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
