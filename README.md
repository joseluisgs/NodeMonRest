# NodeMonREST
Ejemplo de API REST en NodeJS, usando Mongo.

### Acerca de
Este proyecto tiene nombre de Pokemo :). El objetivo prinicpal docente es aplicar distintas técnicas para construir un esqueleto de API REST usable en distntos proyectos. La idea es hacer un esqueleto lo suficientemente genérico, adaptable y extensible en módulos para ser aplicado en distintos problemas y con él resolver cuestiones que se nos pueden presentar genéricas en cada uno de ellos, con el objetivo de mostrar para el mámbito docente como poder realizarlo. Es una apliación púramente docente. Entre las distintas técnicas usadas:
* Patrón [MVC](https://es.wikipedia.org/wiki/Modelo%E2%80%93vista%E2%80%93controlador). La vista será cuaquier cliente que consuma nuestra API.
* [Asíncronía](https://lemoncode.net/lemoncode-blog/2018/1/29/javascript-asincrono) y respuesta a Eventos. Uso de promesas e interacción basada en eventos que es uno de los pastectos más fuetes de NodeJS. 
* Acceso a bases de datos NoSQL.
* Autenticación usando [JWT](https://jwt.io/introduction/).
* Autorización basada en permisos de usuario.
* Algunos [patrones de diseño](https://sourcemaking.com/design_patterns) conocidos.

Iré comentando los apsctos más releantes y las librerías usadas en cada parte.

## Requisitos deñ sistema
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
 
## Tecnologías y librerías usadas: Un poquito de su desarrollo
* [NodeJS](https://nodejs.org/es/). JS en Servidor.
* [Mongo DB](https://www.mongodb.com/es). He usado su versión en la nube [Atlas](https://www.mongodb.com/cloud/atlas)
* [Express](https://expressjs.com/es/). Framework de apliaciones web para la API. Con ellos creo y gestiono las rutas. Además nos permite fácilemnte crear moddlewares, con lo cual podremos aplicar logs espécificos, filtrar para autorizaciones y atenticaciones y otros menesteres. Es lo que más me gusta de esta librería.
* [Mongoose](https://mongoosejs.com/). Conjunto de librerías para operar con bases de dato MongoDB.
* [JWT-Simple](https://www.npmjs.com/package/jwt-simple). Para implementar la atenticación basada en JWT. Esta libería actua en base a middleware con Express. Por otro lado hemos utilizado los propios tokens que caducan para la parte de autorización porque usaremos con ellos los permisos de usuario que tengan. También hemos usado el refresco de toekens.

## Author
* [José Luis González Sánchez](https://twitter.com/joseluisgonsan)
* [GitHub](https://github.com/joseluisgs)

## License
Este proyecto esta licenciado bajo licencia __MIT__, si desea saber más, visite el fichero [LICENSE](https://github.com/joseluisgs/NodeMonRest/blob/master/LICENSE)
