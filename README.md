# NodeMonREST
Ejemplo de API REST en NodeJS, usando Mongo.

### Acerca de
Este proyecto tiene nombre de Pokemo :). El objetivo prinicpal docente es aplicar distintas técnicas para construir un esqueleto de API REST usable en distntos proyectos. La idea es hacer un esqueleto lo suficientemente genérico, adaptable y extensible en módulos para ser aplicado en distintos problemas y con él resolver cuestiones que se nos pueden presentar genéricas en cada uno de ellos, con el objetivo de mostrar para el mámbito docente como poder realizarlo. Es una apliación púramente docente. Entre las distintas técnicas usadas:
* Patrón [MVC](https://es.wikipedia.org/wiki/Modelo%E2%80%93vista%E2%80%93controlador). La vista será cuaquier cliente que consuma nuestra API.
* [Asíncronía](https://lemoncode.net/lemoncode-blog/2018/1/29/javascript-asincrono) y respuesta a Eventos. Uso de promesas e interacción basada en eventos que es uno de los pastectos más fuetes de NodeJS. 
* Acceso a bases de datos NoSQL.
* Autenticación usando [JWT](https://jwt.io/introduction/).
* Autorización basada en permisos de usuario.
* Maneo de [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS)
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
* [Express](https://expressjs.com/es/). Framework de apliaciones web para la API. Con ellos creo y gestiono las rutas. Además nos permite fácilemnte crear moddlewares, con lo cual podremos aplicar logs espécificos, filtrar para autorizaciones y atenticaciones y ampliar ediante middleware. Es lo que más me gusta de esta librería.
* [Mongoose](https://mongoosejs.com/). Conjunto de librerías para operar con bases de dato MongoDB. He implementado el acceso usando singletón.
* [JWT-Simple](https://www.npmjs.com/package/jwt-simple). Para implementar la atenticación basada en JWT. Esta libería actua en base a middleware con Express. Los propios tokens que caducan dependiendo del valor de .env TOKEN_LIFE en minutos. Para la parte de autorización, también los hemos encapsulado en ellos los permisos de usuario que tengan. También hemos usado el refresco de toekens en base a UUID almacenando los tokens en MongoDB con un TTL definido como índice de la colección en base al valor de .env TOKEN_REFRESH en minutos. De esta manera se autodestruyen pasado ese tiempo y libera el tokens de refresco asociado al token de usuario, dando un poco de seguridad extra. El objetivo de implementar este tipo de token de refresco es que si el access token tiene fecha de expiración, una vez que caduca, el usuario tendría que autenticarse de nuevo para obtener un access token. Con el refresh token, este paso se puede saltar y con una petición al API obtener un nuevo access token que permita al usuario seguir accediendo a los recursos de la aplicación, hasta que el refresh token caduque. Se debe tener en cuenta que el TTL del Token de suatentificación debe ser menor que el de refresco. 
* [BCrypt](https://www.npmjs.com/package/bcrypt). Librería de cryptografía para manejar las contraseñas de los usuarios.
* [Body Parser](https://www.npmjs.com/package/body-parser). Middleware que parsea los body como objetos.
* [Cors](https://www.npmjs.com/package/cors). Middleware para manejo de CORS.
* [Dotenv](https://www.npmjs.com/package/dotenv). Para leer las variables de entorno del fichero .env
* [Morgan](https://www.npmjs.com/package/morgan). Middleware Request logger el cual nos permitirá sacar logs de nuestras peticions HTTP.
* [UUID](https://www.npmjs.com/package/uuid). Implementa el RFC4122 UUIDs para los tokens de refresco

## Author
* [José Luis González Sánchez](https://twitter.com/joseluisgonsan)
* [GitHub](https://github.com/joseluisgs)

## License
Este proyecto esta licenciado bajo licencia __MIT__, si desea saber más, visite el fichero [LICENSE](https://github.com/joseluisgs/NodeMonRest/blob/master/LICENSE)
