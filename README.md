# NodeMonREST
Ejemplo de API REST en NodeJS, usando Mongo.

### Acerca de
A Lo largo de este proyecto se incorporarán distintas técnicas para construir un esqueleto de API REST usable en distntos proyectos. Entre ellas:
* Acceso a bases de datos NoSQL
* Autenticación usando JWT
* Autorización basada en permisos de usuario

## Requisitos
* [NodeJS](https://nodejs.org/es/) en su [última version](https://nodejs.org/es/download/)
* [NPM](https://www.npmjs.com/)
* [Mongo DB](https://www.mongodb.com/es)

| Dependencias | Version   |
|:-------------|:----------| 
| __node__     | >= 10.0.0 |
| __npm__      | >= 6.4.0  |
| __yarn__     | >= 1.22.0 |

## Instalación y uso
Tareas que podemos ejecutar dentro de nuestra aplicación. Te recomiendo leer el fichero packahe.json:
* npm install para instalar las dependencias 
* npm run start - Ejecuta el entorno de desarrollo
* npm run watch - ejecuta nodemon para ver los cambios del codigo sobre la marcha

### El fichero .ENV
Elservidor toma las constantes del fichero .EV, te dejo un ejemplo de configuración

ENV=development

DEBUG=true

HOST=localhost

PORT=8000

TIMEZONE=Europe/Madrid

TOKEN_SECRET=Este_Caballo_Viene_de_Boanzarrrrr_/_Lorem_Fistrum_Pecador_Te_Va_A_Haser_Pupitaa_Diodenaaalll_2020

TOKEN_LIFE=20

BC_SALT=10

DB_DEBUG=true

DB_POOLSIZE=200

DB_PROTOCOL=mongodb+srv

DB_USER=mongolito

DB_PASS=mongolito_pass

DB_URL=mongoserlver

DB_PORT=27017

DB_NAME=recipes
 
## Tecnologías
* [NodeJS](https://nodejs.org/es/) - JS en Servidor

## Author
* [José Luis González Sánchez](https://twitter.com/joseluisgonsan)
* [GitHub](https://github.com/joseluisgs)

## License
Este proyecto esta licenciado bajo licencia __MIT__, si desea saber más, visite el fichero LICENSE
