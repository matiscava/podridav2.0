export default function deleteMistakeClick() {
  const $deleteBtns = document.querySelectorAll('.btn-delete')
  $deleteBtns.forEach( $btn => {
    $btn.addEventListener('click', () => {
      document.querySelector(".panel-loader").classList.add("is-active")
    })
  } )

}