# Por si la quiero montar en un docker
# Ojo al .dockerignore
FROM node:12.16.3

# Creamos el directorio app
WORKDIR /usr/src/app

# Instalamos las dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Bundle del código de la app
COPY . .

RUN npm run build

EXPOSE 8000
CMD [ "node", "dist/index.js" ]

# Luego, creamos a imagen: docker build -t joseluisgs/apirest .
# Luego: docker run -p 49160:9000 -d joseluisgs/apirest de esta manera exponemos los puertos. en nuestra maquina es el 49160, que se mapea al 8000 del docker
# Luego: docker ps
# Luego: docker logs <container_id>
# Luego: Hacer una peticion a http://localhost:49160/music