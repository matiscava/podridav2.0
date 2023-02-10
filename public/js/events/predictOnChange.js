export default function predictOnChange() {
  const d = document,
    $inputsRadio =  d.querySelectorAll("input[type='radio']"),
    $inputSubmit = d.querySelector("input[type='submit']"),
    $problemText = d.getElementById("problemText"),
    lastPlayer = d.querySelector("label[data-name]").getAttribute('data-name');
  let predicted=0,predictedLastPlayer=0;

  function getPredictState(pred,predLP,cardLimit){
    if ((pred+predLP) === cardLimit) {
      $inputSubmit.disabled = true;
      $problemText.textContent = `${lastPlayer} no puede pedir ${cardLimit - pred} ${cardLimit - pred == 1 ? 'carta': 'cartas'}`;
    } else if (pred < cardLimit) {
      $problemText.classList.remove("problem");
      $inputSubmit.disabled = false;  
      $problemText.textContent = `${lastPlayer} no puede pedir ${cardLimit - pred} ${cardLimit - pred == 1 ? 'carta': 'cartas'}`;
    } else if (pred===cardLimit) {
      $inputSubmit.disabled = false;
      $problemText.textContent = `${lastPlayer} no puede pedir 0 cartas`;
    }else if(pred>cardLimit){
      $problemText.textContent = `${lastPlayer} puede pedir lo que quiera`;
      $problemText.classList.remove("problem");
      $inputSubmit.disabled = false;
    }
  }

  $inputsRadio.forEach($radio => {
    if ($radio.checked && !$radio.classList.contains("lastPlayer")) predicted += parseInt($radio.value);
    if ($radio.checked && $radio.classList.contains("lastPlayer")) predictedLastPlayer += parseInt($radio.value);

    getPredictState(predicted,predictedLastPlayer,cardLimit);
  })

  $inputsRadio.forEach($radio => {
    if ($radio.checked && !$radio.classList.contains("lastPlayer")) predicted += parseInt($radio.value);
    if ($radio.checked && $radio.classList.contains("lastPlayer")) predictedLastPlayer += parseInt($radio.value);
    $radio.addEventListener('change', () => {
      predicted = 0;
      predictedLastPlayer = 0;
      for (let i = 0; i < $inputsRadio.length; i++) {
        const $radio = $inputsRadio[i];
        if ($radio.checked && !$radio.classList.contains("lastPlayer")) predicted += parseInt($radio.value);
        if ($radio.checked && $radio.classList.contains("lastPlayer")) predictedLastPlayer += parseInt($radio.value);
      }
      getPredictState(predicted,predictedLastPlayer,cardLimit);
    })
  });

  d.getElementsByClassName("formCards")[0].addEventListener('submit', () => {
    d.querySelector(".panel-loader").classList.add("is-active")
  })



}