import express from 'express';

import path from 'path';
import gameRoute from './routers/gameRoute.js';
import mistakeRoute from './routers/mistakeRoute.js';
import playerRoute from './routers/playerRoute.js';

const router = express.Router();

router
  .get('/', (req, res) => {
    res.render(path.join(process.cwd(),'/views/home.ejs'),{title: "La podrida"})
  })
  .get('/rules', (req, res) => {
    res.render(path.join(process.cwd(),'/views/rules.ejs'),{title: "Reglas de la podrida"})
  })
  .use('/game',gameRoute)
  .use('/player', playerRoute)
  .use('/mistake', mistakeRoute)

export default router;
