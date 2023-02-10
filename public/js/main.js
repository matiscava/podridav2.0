import exportToExcel from "./events/exportToExcelOnClick.js";
import handPointsClick from "./events/handPointsClick.js";
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
    setTimeout(() => handPointsClick(), 0 );
  }
})

hamburgerMenu('.panel-btn.hamburger','.panel-menu','menu-responsive')