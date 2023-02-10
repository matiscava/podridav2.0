import exportToExcel from "./events/exportToExcelOnClick.js";
import handPointsSubmit from "./events/handPointsSubmit.js";
import loadGameClick from "./events/loadGameClick.js";
import predictOnChange from "./events/predictOnChange.js";
import takenOnChange from "./events/takenOnChange.js";
import hamburgerMenu from "./helpers/hamburguerButton.js";

let getLocation = window.location.pathname;

document.addEventListener('DOMContentLoaded', (e) => {
  if(getLocation.includes('/game/') && getLocation.includes('/predict') ){
    setTimeout(() => predictOnChange(), 0 );
  }
  if(getLocation.includes('/game/') && getLocation.includes('/taken') ){
    setTimeout(() => takenOnChange(), 0 );
  }
  if(getLocation.includes('/game/') && getLocation.includes('/tablePoints') ){
    setTimeout(() => exportToExcel(), 0 );
  }
  if(getLocation.includes('/game/') && getLocation.includes('/handPoints') ){
    setTimeout(() => handPointsSubmit(), 0 );
  }
  if(getLocation === '/game/getAll'){
    setTimeout(() => loadGameClick(), 0 );
  }
})

hamburgerMenu('.panel-btn.hamburger','.panel-menu','menu-responsive')