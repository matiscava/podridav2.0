export default function takenOnChange() {
  const d = document,
    $inputsRadio = d.querySelectorAll("input[type='radio']"),
    $inputSubmit = d.querySelector("input[type='submit']"),
    $percentageDiv = d.getElementById('btnPercentage'),
    $btnContainer = d.querySelector('.btnDiv'),
    $problemSpan = d.getElementById("problemSpan");
    let takes = 0;
    function getTakeState(takes) {
      if (takes === cardLimit) {
        $percentageDiv.style.width = `100%`;
        $percentageDiv.classList.add('complete');
        $percentageDiv.classList.remove('error');

        $btnContainer.classList.add('btnOk');

        $problemSpan.innerHTML = "Ya puede terminar la mano"
        $problemSpan.classList.remove('error');
        $problemSpan.classList.remove('opacity-0');
        $problemSpan.classList.add('active');
        setTimeout(() => {
          $problemSpan.classList.add('opacity-0');
        },3000);

        $inputSubmit.disabled = false;

      }else if(takes < cardLimit){
        $inputSubmit.disabled = true;
        let porcentaje = takes != 0 ? takes * 100 / cardLimit: 0;
        
        $percentageDiv.style.width = `${porcentaje}%`;
        $percentageDiv.classList.remove('error');
        $percentageDiv.classList.remove('complete');
        
        $btnContainer.classList.remove('btnOk');

        $problemSpan.innerHTML = `Tienen que haber ${cardLimit} llevadas para poder continuar.`; 
        $problemSpan.classList.remove('active');
        $problemSpan.classList.remove('error');
        $problemSpan.classList.remove('opacity-0');
        setTimeout(() => {
          $problemSpan.classList.add('opacity-0');
        },3000);

      } else {
        $inputSubmit.disabled = true;

        $percentageDiv.style.width = '100%';
        $percentageDiv.classList.add('error');

        $problemSpan.innerHTML = `No pueden llevarse mas de ${cardLimit}.`;
        $problemSpan.classList.remove('active');
        $problemSpan.classList.remove('opacity-0');
        $problemSpan.classList.add('error');
        setTimeout(() => {
          $problemSpan.classList.add('opacity-0');
        },3000);

        $btnContainer.classList.remove('btnOk');
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