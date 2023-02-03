import fileEnv from "../env.js";

const getPersistence = () => {
  let pers;
  
  if( process.argv[2] === 'production' || process.argv[2] === 'development' || !process.argv[2] ){
    pers = fileEnv.parsed.PERS;
  } else {
    pers = process.argv[2];
  }
  return pers; 
}

export default getPersistence;