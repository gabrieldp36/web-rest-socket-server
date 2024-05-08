![portada](https://github.com/gabrieldp36/web-rest-socket-server/assets/88417383/403565bb-1ad0-4841-885d-28d887a24f27)

# Rest + Socket Server.

El objeto de esta aplicación fue desarrollar un rest server robusto con rutas protegidas, validaciones, uso de middewares, manejo de archivos, autenticación manual y mediante Google Sign In, todo ello en conjunto con MongoDB.

Simula un rest server que utilizaría una cafetería para organizar y administar su plantilla de empleados y su stock, este último estructurado por categorías y productos, permitiendo realizar búsquedas insensibles de usuarios, categorías, productos en particular y productos por categorías.

Asimismo, se integró la tecnología de Sockets para desarrollar un chat grupal entre usuarios, con la posibilidad de enviar mensajes privados. A dicho chat sólo se puede acceder con credenciales de acceso, autenticándose en forma manual o automática mediante Google Sign In.

Pueden utilizar las siguientes credenciales de acceso que otorgan privilegios de ADMIN, obtener su token y probar a fondo el Rest Server!! Usuario: test1@test.com, Password: M23456a8.

A continuación les copio el link a la documentación que sirve de guía para comprender el uso de cada uno de los servicios implementados: https://documenter.getpostman.com/view/17109440/U16qKPMZ

Pueden visitar la App haciendo click en este link: 

```
https://web-rest-socket-server-production.up.railway.app/
```

### Notas:

Recuerden reconstruir los módulos de Node:

```
npm install
```

y, no olviden ingresar: 1. la cadena de conexión a su base de datos (MongoDB); 2. su secret or private key para la creación de JSON Web Tokens; 3. sus Google Client ID y Google Secret ID (para autenticación con Google Sign In); 4. su Cloudinary URL para cargar y mostrar imágenes de productos.

Tal información debe ser ingresada en el archivo example.env, debiendo renombrar tal archivo de la siguiente manera:

```
.env
```

Luego, para correr el servidor en desarrollo, ejecuten el siguiente comando:

```
node app
```