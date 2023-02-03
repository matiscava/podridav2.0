import express from "express";
import session from "express-session";
import path from "path";
import expressMethodOverride from "express-method-override";
import mime from 'mime';
import router from "./src/router/index.js";

// VARIABLES CONSTANTES
const app = express();
const restFul = expressMethodOverride('_method');
const mimeType = mime.getType(path);

// CONFIGURAMOS LA SESION

export const apiSession = session(
  {
    secret: 'podrida-secreta',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: parseInt(process.env.SESSION_AGE)
    }
  }
);

//CONFIGURACION SERVER
app
  .use(express.json())
  .use(express.urlencoded({extended: true}))
  .use(express.static(path.join()+'/public'))
  .set('content-type', mimeType)
  .use(apiSession)
  .use(restFul)
  .set('views',path.join(process.cwd() + '/views'))
  .set('view engine', 'ejs');
//SERVIDOR

app
  .use(router)
  .use((req, res) => {
    res.status(404).json(
      {error: -2, description: `ruta ${req.originalUrl} método ${req.method} no implementado`}
    );
  });

export default app;



