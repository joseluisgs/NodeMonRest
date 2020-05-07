# NodeMonREST
Ejemplo de API REST en NodeJS, usando Mongo.

### Acerca de
A Lo largo de este proyecto se incorporarán distintas técnicas para construir un esqueleto de API REST usable en distntos proyectos. Entre ellas:
* Acceso a bases de datos NoSQL
* Autenticación usando JWT
* Autorización basada en permisos de usuario

Iré comentando los apsctos más releantes y las librerías usadas en cada parte.

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
El servidor toma las constantes del fichero .env, te dejo un ejemplo de configuración en .env_example. Cámbialo y lo configuras a tu gusto y luego lo renomnbras.
 
## Tecnologías y librerías usadas
* [NodeJS](https://nodejs.org/es/). JS en Servidor.
* [Mongo DB](https://www.mongodb.com/es). He usado su versión en la nube [Atlas](https://www.mongodb.com/cloud/atlas)
* [Express](https://expressjs.com/es/). Framework de apliaciones web para la API. Con ellos creo y gestiono las rutas. Por ejemplo

## Author
* [José Luis González Sánchez](https://twitter.com/joseluisgonsan)
* [GitHub](https://github.com/joseluisgs)

## License
Este proyecto esta licenciado bajo licencia __MIT__, si desea saber más, visite el fichero LICENSE
