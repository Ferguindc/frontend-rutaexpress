# Etapa 1: Compilación de la aplicación Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor Nginx para servir la aplicación
FROM nginx:alpine
# Copia los archivos estáticos generados por Angular
COPY --from=build /app/dist/*/browser /usr/share/nginx/html
# Copia tu configuración personalizada de Nginx con try_files
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]