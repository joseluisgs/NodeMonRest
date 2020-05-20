# NodeMonREST

Ejemplo de API REST en NodeJS, usando Mongo.

[![Node.js CI](https://github.com/joseluisgs/NodeMonRest/workflows/Node.js%20CI/badge.svg)](https://github.com/joseluisgs/NodeMonRest/actions)
[![Build Status](https://travis-ci.com/joseluisgs/NodeMonRest.svg?branch=master)](https://travis-ci.com/joseluisgs/NodeMonRest)
[![Docker](https://img.shields.io/badge/Docker-passing-blue)](https://hub.docker.com/r/joseluisgs/nodemonrest)
[![Heroku](https://img.shields.io/badge/Heroku-passing-blueviolet)](https://nodemonrest.herokuapp.com/)
![Release](https://img.shields.io/github/v/release/joseluisgs/NodeMonRest)
![Licence](https://img.shields.io/github/license/joseluisgs/NodeMonRest)
![JS Code](https://img.shields.io/badge/JS%20Code-ES2019-yellow)
![JS Style](https://img.shields.io/badge/JS%20Style-AirBnB-ff69b4)


### Acerca de
Este proyecto tiene nombre de Pokemon :). El objetivo principal docente es aplicar distintas técnicas para construir un esqueleto de API REST usable en distintos proyectos. La idea es hacer un esqueleto lo suficientemente genérico, adaptable y extensible en módulos para ser aplicado en distintos problemas y con él resolver cuestiones que se nos pueden presentar genéricas en cada uno de ellos, con el objetivo de mostrar para el ámbito docente como poder realizarlo. Es una aplicación puramente docente. Entre las distintas técnicas usadas:
* Patrón [MVC](https://es.wikipedia.org/wiki/Modelo%E2%80%93vista%E2%80%93controlador). La vista será cualquier cliente que consuma nuestra API.
* [Asíncronía](https://lemoncode.net/lemoncode-blog/2018/1/29/javascript-asincrono) y respuesta a Eventos. Uso de promesas e interacción basada en eventos que es uno de los aspectos más fuetes de NodeJS.
* Acceso a bases de datos NoSQL usando Mongo DB.
* Autenticación y autorización usando [JWT](https://jwt.io/introduction/).
* Autorización basada en permisos de usuario.
* Manejo de [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS)
* Algunos [patrones de diseño](https://sourcemaking.com/design_patterns) conocidos.
* JS Código [ECMA2019](https://www.ecma-international.org/ecma-262/). De esta manera nos aseguramos seguir los estándares marcados para este tipo de lenguaje, pero tratando los módulos como indica NodeJS, usando Babel para compatibilidad. Además se ha aplicado el stilo [AirBnB](https://airbnb.io/javascript/) uno de los más seguidos con el objetivo de mantener una flosofía de sintáxis y estilo de programación ampliamente seguida en la comunidad JS/Node.

Iré comentando los aspectos más relevantes y las librerías usadas en cada parte.

## Requisitos del sistema
* [NodeJS](https://nodejs.org/es/) en su [última version](https://nodejs.org/es/download/)
* [NPM](https://www.npmjs.com/)
* [Mongo DB](https://www.mongodb.com/es)

| Dependencias | Versión   |
|:-------------|:----------|
| __node__     | >= 10.0.0 |
| __npm__      | >= 6.4.0  |
| __yarn__     | >= 1.22.0 |

## Instalación y uso
Tareas que podemos ejecutar dentro de nuestra aplicación. Te recomiendo leer el fichero package.json:
* npm install:  para instalar las dependencias
* npm run start-dev: ejecuta el entorno de desarrollo, el codigo en src
* npm run watch: ejecuta nodemon para ver los cambios del código sobre la marcha
* npm run build: construye la versión de distribución (en el directorio dist)
* npm start (npm run start): ejecuta la versión de distribución, antes has tenido que ejecutar npm build

### Usando Heroku
Heroku te permite crear tu propio contenedor dinámico y lanzar la apliación. Puedes acceder a él, tanto la web como la API en esta dirección: https://nodemonrest.herokuapp.com/

### Usando Docker
También podemos usar Docker para su instalación como se indica y proceder como en apartado anterior. La imagen la tienes disponible en: https://hub.docker.com/r/joseluisgs/nodemonrest. Además puedes proceder:
* Pull de la imagen: docker pull joseluisgs/nodemonrest
* Ejecutando luego: docker run -p 49160:8000 -d joseluisgs/nodemonest (de esta manera exponemos los puertos en nuestra maquina es el 49160, que se mapea al 8000 del docker, puedes usar el puerto que quieras en vez del 4961)

### El fichero .ENV
El servidor toma las constantes del fichero .env, te dejo un ejemplo de configuración en .env_example. Cámbialo y lo configuras a tu gusto y luego lo renombras. Es importante que conozcas las variables de entorno que necesitas, si algunas no las pones las cogerá por defecto de la clase env que se encarga de gestionarlas. Si no las tienes te dará un error.

### Carpeta Mongo
En la carpeta mongo tienes un volcado de la base de datos y de cada una de las colecciones con datos de ejemplo. el resto de tablas se crea sobre la marcha. Te recomiendo usar Mongo Atlas y en ella crear la base de datos recipes, o como tu quieras que se llame, recuerda que debes cambiarlo en .env. Posteriormente crea las colecciones si quieres tener estos datos que se llamen igual, si no se irán creando sobre la marca vacías.

## Tecnologías y librerías usadas: Un poquito de su desarrollo
* [NodeJS](https://nodejs.org/es/). JS en Servidor.
* [Mongo DB](https://www.mongodb.com/es). He usado su versión en la nube [Atlas](https://www.mongodb.com/cloud/atlas)
* [Express](https://expressjs.com/es/). Framework de aplicaciones web para la API. Con ellos creo y gestiono las rutas. Además nos permite fácilmente crear middlewares, con lo cual podremos aplicar logs específicos, filtrar para autorizaciones y autenticaciones y ampliar mediante middleware. Es lo que más me gusta de esta librería. Te recomiendo mirar el código de los ficheros route y middleware para ver como realizo estas acciones. Una de las cosas importantes es como he creado el servidor para que pueda ser levantado como instancia en cada una de las pruebas.
* [Mongoose](https://mongoosejs.com/). Conjunto de librerías para operar con bases de dato MongoDB. He implementado el acceso usando singletón.
* [JWT-Simple](https://www.npmjs.com/package/jwt-simple). Para implementar la atenticación basada en JWT. Esta librería actúa en base a middleware con Express. Los propios tokens que caducan dependiendo del valor de .env TOKEN_LIFE en minutos. Para la parte de autorización, también los hemos encapsulado en ellos los permisos de usuario que tengan. También hemos usado el [refresco de tokens](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/), en base a UUID almacenando los tokens de refresco en MongoDB con un índice TTL de la colección en base al valor de .env TOKEN_REFRESH en minutos. De esta manera se autodestruyen pasado ese tiempo y libera el tokens de refresco asociado al token de usuario, dando un poco de seguridad extra. El objetivo de implementar este tipo de token de refresco es que si el access token tiene fecha de expiración, una vez que caduca, el usuario tendría que autenticarse de nuevo para obtener un access token. Con el refresh token, este paso se puede saltar y con una petición al API obtener un nuevo access token que permita al usuario seguir accediendo a los recursos de la aplicación, hasta que el refresh token caduque. Se debe tener en cuenta que el TTL del Token de autentificación debe ser menor que el de refresco.
* [BCrypt](https://www.npmjs.com/package/bcrypt). Librería de criptografía para manejar las contraseñas de los usuarios.
* [Body Parser](https://www.npmjs.com/package/body-parser). Middleware que parsea los body como objetos.
* [Cors](https://www.npmjs.com/package/cors). Middleware para manejo de [CORS](https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS).
* [Dotenv](https://www.npmjs.com/package/dotenv). Para leer las variables de entorno del fichero .env
* [Morgan](https://www.npmjs.com/package/morgan). Middleware Request logger el cual nos permitirá sacar logs de nuestras peticiones HTTP.
* [UUID](https://www.npmjs.com/package/uuid). Implementa el RFC4122 UUIDs para los tokens de refresco.
* [Express-fileupload](https://www.npmjs.com/package/express-fileupload). Es un middleware para Express el cual nos ayuda a procesar peticiones multipart o subida de imágenes. Se ha puesto que el tamaño máximo por umagen sea 2MB aunque se puede cambiar el el fichero .env. Los directorios para almacenar imágenes o ficheros están en .env, puedes poner el mismo o lo que quieras, pues se crean dinámicamente dentro de public/uploads (FILES_PATH) y accesible directamente por la ruta url/files (FILES_URL). Puedes ponerle el mismo si quieres.
* [Joi](https://www.npmjs.com/package/@hapi/joi). Nos sirve para validar los datos de entrada en base a un esquema de validación, por si no lo usamos en los propios esquemas de mongo la validación. Es importante que el back valide todos los datos por si se ha escapado algo del Front. No podemos dejar nada a la surte. ¡Luke, somos la última esperanza!
* [Mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator). Nos sirve para validar los campos unique. Actúa como middleware.
* [Underscore](https://www.npmjs.com/package/underscore). Nos permite extender las posibilidades de la programación funcional para algunos métodos.
* [Express-handlebars](https://www.npmjs.com/package/express-handlebars). Personalmente uno de los mejores motores de plantillas para NodeJS, basado en [Handlebars](https://handlebarsjs.com/). Lo he usado de ejemplo para hacer algunas páginas estáticas de presentación de la API.
* [Mocha](https://mochajs.org/) y [Chai](https://www.chaijs.com/). Se han utilizado estas librerías para los test por su funcionalidad y porque se adaptan perfectamente al proceso de integración continua que se ha marcado como objetivo.
* [Babel](https://babeljs.io/) y [ESLint](https://eslint.org/) con el objetivo de construir un código ampliamente compatible y estandarizado de JS.
* [GitHub Actions](https://github.com/features/actions). Es una de las grandes herramientas que se ha usado para la integración/distribución continuas [CI/CD](https://www.redhat.com/es/topics/devops/what-is-ci-cd). Me he apoyado en otras herramientas como [Travis CI](https://travis-ci.com/). No son excluyentes y pueden ser complementarias. Es por eso que he dejado los ficheros para ambas. Para ello hemos integrado el entorno de ejecución con pruebas y el despliegue inicial en [DockerHub](https://hub.docker.com/r/joseluisgs/nodemonrest) y su despliegue para su uso en [Heroku](https://nodemonrest.herokuapp.com/).

## Author
* [José Luis González Sánchez](https://twitter.com/joseluisgonsan) ![Twitter](https://img.shields.io/twitter/follow/joseluisgonsan?style=social)


* [GitHub](https://github.com/joseluisgs) ![GitHub](https://img.shields.io/github/followers/joseluisgs?style=social)

![GitHub](https://img.shields.io/github/last-commit/joseluisgs/NodeMonRest)

## License
Este proyecto esta licenciado bajo licencia __MIT__, si desea saber más, visite el fichero [LICENSE](https://github.com/joseluisgs/NodeMonRest/blob/master/LICENSE)

