# PA2 — Plataforma de Gestión de Solicitudes Académicas (API Backend)

**Curso:** PROGRAMACION WEB - II 
**Código:** 30690
**Evaluación:** PA2 - Proceso de Aprendizaje 2 (Sesiones 5 a 7)
**Equipo:** G8

## Integrantes

| N° | Integrante | Rol | Aporte Principal |
|---|---|---|---|
| 1 | Matías Reategui | Líder / Backend | Servidor Express, rutas, middleware y CRUD de solicitudes (`server.js`, `routes/solicitudes.js`, `middleware/errores.js`) |
| 2 | José Stuart Fonseca Vega | Base de datos | Conexión a MongoDB y modelos Mongoose `User` y `Solicitud` (`config/db.js`, `models/`, `seed.js`) |
| 3 | Enzo Rodrigo Alvarado Vera | Seguridad | bcrypt.js, JWT, CORS, protección de rutas y roles (`middleware/auth.js`, `routes/auth.js`, `routes/usuarios.js`) |
| 4 | Christian Paolo Vera Palomino | Documentación / QA | Pruebas (`requests.http`, `tests/smoke.js`), evidencias, README |

## Descripción y objetivo

**Problema:**

API REST para gestionar usuarios y solicitudes académicas (constancias, reclamos, retiros, convalidaciones). Los estudiantes registran y consultan sus propias solicitudes; el administrador revisa todas, cambia su estado y puede eliminarlas.

Este proyecto es la segunda etapa del caso progresivo "Plataforma de Gestión de Solicitudes Académicas". En la PA1 se construyó el frontend en Angular 16 + TypeScript, que consumía una API pública (`jsonplaceholder`) y guardaba los datos solo de forma local. En la PA2 se reemplaza esa API de práctica por un backend propio con persistencia real y seguridad. 

**Objetivo:**

Implementar un backend con Node.js y Express, persistir datos con MongoDB/Mongoose y proteger el acceso a la API mediante JWT, bcrypt.js, CORS y autorización basada en roles (sesiones 5 a 7).

**Solución desarrollada:**

El trabajo siguió el avance de las siguientes sesiones:

1. **Sesión 5 — Node.js y Express:** servidor HTTP, rutas, middleware (`express.json`, logger, manejo de errores) y operaciones CRUD sobre la entidad principal (`Solicitud`).
2. **Sesión 6 — MongoDB y Mongoose:** conexión a la base de datos (`src/config/db.js`), esquemas con validaciones (`User`, `Solicitud`) y adaptación de los servicios REST para que los datos persistan entre ejecuciones.

### Estructura del proyecto

```
src/
├── config/
│        └── db.js                       # Conexión a MongoDB
├── middleware/
│        ├── auth.js                     # auth.js (JWT + roles)
│        └── errores.js                  # Manejo centralizado de errores
├── models/
│        ├── Solicitud.js                # Esquema y modelo de solicitudes
│        └── User.js                     # Esquema y modelo de usuarios
├── routes/ 
│        ├── auth.js                     # Endpoints de autenticación
│        ├── solicitudes.js              # Endpoints CRUD de solicitudes
│        └── usuarios.js                 # Endpoints de gestión de usuarios
├── tests/
│        └── smoke.js                    # Prueba automática de extremo a extremo
├── seed.js                              # Crea un admin inicial
└── server.js                            # App Express, middleware globales, montaje de rutas
```

### Modelo de datos

- **User:** `nombre`, `email` (único), `password` (hash bcrypt, `select: false`), `rol` (`estudiante` | `admin`).
- **Solicitud:** `titulo`, `descripcion`, `tipo`, `estado` (`pendiente` | `en_proceso` | `aprobada` | `rechazada`), `solicitante` (referencia a `User`) y `timestamps`.

### Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registra estudiante y devuelve JWT |
| POST | `/api/auth/login` | Público | Inicia sesión y devuelve JWT |
| GET | `/api/usuarios/me` | Autenticado | Perfil propio |
| GET | `/api/usuarios` | Admin | Lista de usuarios |
| PUT | `/api/usuarios/:id/rol` | Admin | Cambia rol |
| DELETE | `/api/usuarios/:id` | Admin | Elimina usuario |
| POST | `/api/solicitudes` | Autenticado | Crea solicitud |
| GET | `/api/solicitudes` | Autenticado | Lista (estudiante: las suyas; admin: todas) |
| GET | `/api/solicitudes/:id` | Autenticado | Detalle |
| PUT | `/api/solicitudes/:id` | Autenticado | Actualiza (solo admin cambia `estado`) |
| DELETE | `/api/solicitudes/:id` | Admin | Elimina |

### Decisiones técnicas

- **Express + Router por recurso:** separa responsabilidades y facilita el mantenimiento y el trabajo en equipo.
- **Mongoose con validaciones :** garantiza datos consistentes antes de persistir.
- **Registro siempre como `estudiante`:** evita la escalada de privilegios; el admin se crea con `npm run seed`.
- **CORS configurable** mediante la variable `CORS_ORIGIN`, para permitir solo el origen del frontend.
- **Variables de entorno (`.env`):** el secreto JWT y la URI de MongoDB no se versionan; se incluye un `.env.example` sin datos sensibles.

**¿Cómo ejecutar o revisar?**

```bash
git clone <URL-DEL-REPOSITORIO>
cd <carpeta>
npm install
cp .env.example .env      # editar JWT_SECRET y MONGODB_URI
npm run seed              # opcional: crea el usuario administrador inicial
npm start                 # http://localhost:3000
```

**Cómo probar:**

1. Con el servidor corriendo, ejecutar `npm run smoke` en otra terminal. Esta prueba automática verifica registro, login, CRUD, el 401 sin token y el 403 por rol.
2. Abrir `requests.http`, Postman o Thunder Client y enviar las solicitudes en orden.
3. Revisar los documentos guardados en MongoDB, reiniciar el servidor y comprobar que los datos siguen ahí.


## Evidencias

Nota: Las capturas se encuentran en la carpeta [`evidencias/`](evidencias/):


## Conclusiones

- Se logró una API completa con persistencia real en MongoDB, que conserva los datos entre ejecuciones. Esto resuelve la limitación de la PA1, donde las solicitudes dependían de una API pública que no guardaba nada.
- La seguridad por capas limita el acceso a lo estrictamente necesario: un estudiante solo ve y gestiona sus solicitudes, y las acciones sensibles son para el administrador.
- Modelar los datos con Mongoose, con validaciones y `enum`, permitió detectar entradas inválidas antes de llegar a la base de datos y mantener la información consistente.
- Separar modelos, rutas y middleware facilitó el trabajo en paralelo entre los integrantes y reduce los conflictos al integrar el código en el repositorio.
- Esta API será la base para conectar el frontend desarrollado en la PA1, reemplazando el servicio que usaba la API pública por llamadas al backend propio.

## Video de exposición

**Video público de YouTube:** [PEGAR AQUÍ EL ENLACE] 
