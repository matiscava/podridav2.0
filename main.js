import { Server as HttpServer } from 'http';
import app from './index.js';
import dotenv from "dotenv";
import options from './src/config/config.js';

const httpServer = new HttpServer(app);

const PORT = process.env.PORT || parseInt(dotenv.config().parsed.PORT) || 8070;

const server = httpServer.listen( PORT , () => console.log(`Servidor corriendo en http://localhost:${PORT}/`));

server.on('error', err => console.error(`Error en servidor ${err}`));