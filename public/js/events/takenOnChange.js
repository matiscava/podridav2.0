export default function takenOnChange() {
  const d = document,
    $inputsRadio = d.querySelectorAll("input[type='radio']"),
    $inputSubmit = d.querySelector("input[type='submit']"),
    $problemText = d.getElementById("problemText");
    let takes = 0;

    function getTakeState(takes) {
      if (takes !== cardLimit) {
        $inputSubmit.disabled = true;
        $problemText.classList.add("problem");
        $problemText.classList.remove("none");
        $problemText.textContent = "No pueden llevarse menos o más que la cantidad de cartas jugadas";
      }else{
        $problemText.classList.add("none");
        $inputSubmit.disabled = false;
      }
    }
    $inputsRadio.forEach($radio => {
      if ($radio.checked) takes += parseInt($radio.value);
      getTakeState(takes);
    })
  $inputsRadio.forEach($radio => {
    if ($radio.checked) takes += parseInt($radio.value);
    $radio.addEventListener('change', () => {
      takes = 0;
      for (let i = 0; i < $inputsRadio.length; i++) {
        const $radio = $inputsRadio[i];
        if ($radio.checked) takes += parseInt($radio.value);
      }
      getTakeState(takes);
    })
  });
  d.getElementsByClassName("formCards")[0].addEventListener('submit', () => {
    d.querySelector(".panel-loader").classList.add("is-active")
  })
}