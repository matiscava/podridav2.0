export default function loadGameClick() {
  const $loadBtns = document.querySelectorAll(".btn-load")
  const $deleteBtns = document.querySelectorAll('.btn-delete')
  $loadBtns.forEach( $btn => {
    $btn.addEventListener('click', () => {
      document.querySelector(".panel-loader").classList.add("is-active")
    })
  } )

  $deleteBtns.forEach( $btn => {
    $btn.addEventListener('click', () => {
      document.querySelector(".panel-loader").classList.add("is-active")
    })
  } )

}