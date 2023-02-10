export default function handPointsClick() {
  document.getElementById("formEndHand").addEventListener('submit', (e) => {
    document.querySelector("input[type='submit']").disabled = true;
  })
}