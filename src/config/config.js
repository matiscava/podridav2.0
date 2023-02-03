import fileEnv from "../env.js";

const config = {
  PORT: fileEnv.parsed.PORT,
  PERS: fileEnv.parsed.PERS,
  FILE_PATH: fileEnv.parsed.FILE_PATH,
  DB_USER: fileEnv.parsed.DB_USER,
  DB_PASSWORD: fileEnv.parsed.DB_PASSWORD,
  DB_DATABASE: fileEnv.parsed.DB_DATABASE,
  DB_HOST: fileEnv.parsed.DB_HOST,
  MODE: fileEnv.parsed.MODE,
  SESSION_AGE: parseInt(fileEnv.parsed.SESSION_AGE)
}

const options = {
  ...config,
  mongodb: {
    // host: 'mongodb://localhost/ecommerce',
    // mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}.auepush.mongodb.net/?retryWrites=true&w=majority
    cnxStr: `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}.auepush.mongodb.net/${config.DB_DATABASE}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateOmdex: true,
      serverSelectionTimeoutMS: 5000
    }
  },
  file: {
    path: `./${config.FILE_PATH}`
  }
};

export default options;
