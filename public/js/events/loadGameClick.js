export default function loadGameClick() {
  const $loadBtns = document.querySelectorAll(".btn-load")
  $loadBtns.forEach( $btn => {
    $btn.addEventListener('click', () => {
      document.querySelector(".panel-loader").classList.add("is-active")
    })
  } )

}