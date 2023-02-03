import path from "path";
import Singleton from "../utils/Singleton.js";

const mistakeController = () => {};

// const mistakeDao = new MistakeDaoFile;
const { daos } = Singleton.getInstance();
const { mistakeDao } = daos;

mistakeController.getAll = async (req ,res) => {
  try {
    const mistakeList = await mistakeDao.getAll();
    if( ! (mistakeList instanceof Array) ) throw new Error('Mistake NO es un Array');
    // res.json(mistakeList);
    res.render(path.join(process.cwd(),'/views/mistakeList.ejs'), {title:"Lista de Mistake", mistakeList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

mistakeController.getCreateForm = async (req, res) => {
  try {
    let mistake;
    if( req.params.id ) mistake = await mistakeDao.getById(req.params.id) 
    if( req.params.id ) console.log("hola"); 
    res.render(path.join(process.cwd(),'/views/mistakeForm.ejs'), {title:"Lista de Mistake", mistake});

  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

mistakeController.create = async (req, res) => {
  try {
    await mistakeDao.create(req.body);
    res.redirect('/mistake/getAll')
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

mistakeController.delete = async (req, res) => {
  try {
    const mistake = await mistakeDao.getById(req.params.id);
    if(!mistake) throw new Error(`No existe el Misteka ID= ${req.params.id}`);
    await mistakeDao.deleteById(req.params.id);
    const mistakeConfirm = await mistakeDao.getById(req.params.id);
    if(mistakeConfirm) throw new Error(`No se eliminó correctamente el Misteka ID= ${req.params.id}`);
    res.redirect('/mistake/getAll');
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}



export default mistakeController;