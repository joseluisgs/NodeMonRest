# Por si la quiero montar en un docker
# Ojo al .dockerignore
FROM node:12.16.3

# Opcional Crear estos directorios garantizará que tengan los permisos deseados,
# lo que será importante al crear módulos de nodo locales en el contenedor con npm install.
# Además de crear estos directorios, estableceremos la propiedad sobre ellos a nuestro usuario node
# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Creamos el directorio app
# WORKDIR /usr/src/app
WORKDIR /usr/node/app

# Instalamos las dependencias
COPY package*.json ./

# Opcional. Para garantizar que todos los archivos de la aplicación sean propiedad del usuario node no root
# USER node

# Instalamos las dependencias
RUN npm install
# Si es nuestro docker de producción, lo hacemos así
# RUN npm ci --only=production

# Bundle del código de la app, este es la parte opcional si no usar la línea posterior comentada
# COPY --chown=node:node . .
COPY . .

# Si queremos hacer el build aquí, si no deberíamos copiar solo el directorio /dist
RUN npm run build

# Exponemos el puerto del servidor
EXPOSE 8000

# Ejecutamos el comando en dist, pero en el resto del contenedor tenemos el resto de código (ver COPY)
CMD [ "node", "dist/index.js" ]

# Luego, creamos a imagen: docker build -t joseluisgs/nodemonapirest .  (oye que lo del punto no está mal, es que es así :))
# Luego: docker run -p 49160:8000 -d joseluisgs/nodemonapirest de esta manera exponemos los puertos. en nuestra maquina es el 49160, que se mapea al 8000 del docker
# Luego: docker ps
# Luego: docker logs <container_id>
# Luego: Hacer una peticion a http://localhost:49160 o simplemente abrir el navegador a este puerto
