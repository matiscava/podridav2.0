export default function handPointsSubmit() {
  document.getElementById("formEndHand").addEventListener('submit', () => {
    document.querySelector(".panel-loader").classList.add("is-active")
  })
}