import exportTableToExcel from "../helpers/exportTableToExcel.js";

export default function exportToExcel() {
  const $btn = document.getElementById('btn-export-to-excel');
  $btn.addEventListener('click', (e) => {
    exportTableToExcel('xlsx');
  })
}