# La Podrida v2.0 🃏

Aplicación web para anotar y gestionar los puntos del juego de cartas español "La Podrida". Sistema completo de seguimiento de partidas con múltiples opciones de persistencia de datos.

## 📋 Descripción

La Podrida es una aplicación Node.js con Express que permite:
- Crear y gestionar partidas del juego de cartas "La Podrida"
- Registrar jugadores y sus puntos por mano
- Hacer predicciones y calcular puntos automáticamente
- Gestionar errores/faltas cometidas durante el juego
- Ver tabla de puntos y podio final
- Exportar resultados a Excel
- Cargar y continuar partidas guardadas

## ✨ Características

- **Múltiples opciones de persistencia**: FileSystem, Memory, MongoDB, SQLite
- **Interfaz web intuitiva** con vistas EJS
- **Gestión completa de partidas**: crear, guardar, cargar y continuar juegos
- **Sistema de predicciones**: los jugadores predicen cuántas bazas ganarán
- **Cálculo automático de puntos** basado en predicciones y bazas tomadas
- **Registro de errores**: seguimiento de faltas cometidas durante el juego
- **Exportación a Excel** de las tablas de puntos
- **Selección aleatoria de jugador** inicial
- **Diseño responsive** con interfaz amigable

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- MongoDB (opcional, si se usa persistencia MongoDB)

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/matiscava/podridav2.0.git
cd podridav2.0
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Copiar `dev.env` o `prod.env` según el entorno
   - Configurar las variables necesarias (ver sección de Configuración)

4. Iniciar la aplicación:
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## ⚙️ Configuración

El proyecto utiliza archivos de entorno (`dev.env` y `prod.env`) para configurar:

- `PORT`: Puerto del servidor (ej: 3000)
- `PERS`: Tipo de persistencia (`FS`, `MEMORY`, `MONGO`, `SQLITE`)
- `FILE_PATH`: Ruta para archivos JSON (si se usa persistencia FS)
- `DB_USER`: Usuario de MongoDB (si se usa MongoDB)
- `DB_PASSWORD`: Contraseña de MongoDB
- `DB_DATABASE`: Nombre de la base de datos
- `DB_HOST`: Host de MongoDB
- `MODE`: Modo de ejecución (`development` o `production`)
- `SESSION_AGE`: Duración de la sesión en milisegundos

### Ejemplo de configuración:

```env
PORT=3000
PERS=FS
FILE_PATH=./DB
SESSION_AGE=3600000
MODE=development
```

## 🎮 Uso

1. Acceder a `http://localhost:3000` en el navegador
2. Crear un juego nuevo o cargar uno existente
3. Configurar jugadores para la partida
4. Para cada mano:
   - Los jugadores hacen sus predicciones
   - Registrar las bazas tomadas por cada jugador
   - Los puntos se calculan automáticamente
5. Gestionar errores/faltas si ocurren
6. Ver tabla de puntos y podio final
7. Exportar resultados a Excel si es necesario

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas con patrón DAO:

```
├── src/
│   ├── config/          # Configuración de la aplicación
│   ├── containers/      # Contenedores de inyección de dependencias
│   ├── controllers/     # Lógica de negocio
│   ├── daos/            # Data Access Objects (FS, Memory, Mongo, SQLite)
│   ├── dto/             # Data Transfer Objects
│   ├── mappers/         # Transformación de datos
│   ├── router/          # Definición de rutas
│   └── utils/           # Utilidades y helpers
├── views/               # Plantillas EJS
├── public/              # Archivos estáticos (CSS, JS, assets)
└── DB/                  # Archivos JSON (persistencia FS)
```

## 🔧 Tecnologías

### Backend
- **Node.js** + **Express**: Framework del servidor
- **EJS**: Motor de plantillas
- **MongoDB** + **Mongoose**: Base de datos NoSQL (opcional)
- **SQLite** + **Knex**: Base de datos relacional (opcional)
- **Express Session**: Gestión de sesiones

### Frontend
- **HTML5** + **CSS3**: Interfaz de usuario
- **JavaScript Vanilla**: Lógica del cliente
- **Diseño responsive**: Adaptable a móviles y tablets

### Patrones de Diseño
- **DAO Pattern**: Abstracción de acceso a datos
- **DTO Pattern**: Transferencia de datos
- **Singleton**: Para instancias únicas
- **Dependency Injection**: Mediante containers

## 📁 Persistencia de Datos

El proyecto soporta 4 tipos de persistencia intercambiables:

1. **FileSystem (FS)**: Archivos JSON en carpeta `DB/`
2. **Memory**: Datos en memoria (volátil)
3. **MongoDB**: Base de datos NoSQL en la nube o local
4. **SQLite**: Base de datos relacional en archivo local

Cambia el tipo de persistencia modificando la variable `PERS` en el archivo de entorno.

## 📝 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor en modo desarrollo con nodemon
npm start        # Inicia el servidor en modo producción
```

## 🎯 Endpoints Principales

- `GET /` - Página de inicio
- `POST /game/new` - Crear nueva partida
- `GET /game/getAll` - Ver partidas guardadas
- `GET /hand/:id` - Vista de una mano
- `POST /hand/predict` - Registrar predicciones
- `POST /hand/taken` - Registrar bazas tomadas
- `POST /hand/points` - Calcular y guardar puntos
- `GET /tablePoints/:id` - Ver tabla de puntos
- `GET /rules` - Ver reglas del juego
- `/mistake/*` - Endpoints para gestión de errores

## 👥 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👤 Autor

**matiscava**

- GitHub: [@matiscava](https://github.com/matiscava)
- Repository: [podridav2.0](https://github.com/matiscava/podridav2.0)

## 🐛 Reportar Issues

Si encuentras algún problema, por favor repórtalo en la [página de issues](https://github.com/matiscava/podridav2.0/issues).

---

**Versión**: 2.0.1
