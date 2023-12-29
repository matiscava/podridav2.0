export default function handHandlerForm () {

  const d = document,
  $btnPlayHand = d.getElementById("btnPlay"),
  $btnReturnRequest = d.getElementById("btnReturnRequest"),
  $btnPoints  = d.getElementById("btnPoints"),  
  $btnReturnTake = d.getElementById("btnReturnTake"),
  $btnContainer = d.querySelector('.btnDiv'),
  $handSlider = d.getElementsByClassName('handSlider')[0],
  $inputsRadioRequest = d.querySelectorAll('input.inputRequest'),
  $inputsRadioTake = d.querySelectorAll('input.inputTake'),
  $playerTakenLabel = d.querySelectorAll('label.playerTaken'),
  $tableTrList = d.querySelectorAll('table tbody tr'),
  lastPlayerName = d.querySelector("label[data-name]").getAttribute('data-name'),
  $percentageDiv = d.getElementById('btnPercentage'),
  $problemSpan = d.getElementById("problemSpan");

  let requested=0,requestedLastPlayer=0,taken = 0;

  // funciones

  const getPredictState = (pred,predLP,cardLimit) => {
    $problemSpan.classList.remove('error');
    $problemSpan.classList.remove('active');
    $problemSpan.classList.remove('opacity-0');
    if ((pred+predLP) === cardLimit) {
      $btnPlayHand.disabled = true;
      $problemSpan.classList.add('error');
      $problemSpan.textContent = `${lastPlayerName} no puede pedir ${cardLimit - pred} ${cardLimit - pred == 1 ? 'carta': 'cartas'}`;
    } else if (pred < cardLimit) {
      // $problemText.classList.remove("problem");
      $btnPlayHand.disabled = false;  
      $problemSpan.textContent = `${lastPlayerName} no puede pedir ${cardLimit - pred} ${cardLimit - pred == 1 ? 'carta': 'cartas'}`;
    } else if (pred===cardLimit) {
      $btnPlayHand.disabled = false;
      $problemSpan.textContent = `${lastPlayerName} no puede pedir 0 cartas`;
    }else if(pred>cardLimit){
      $problemSpan.textContent = `${lastPlayerName} puede pedir lo que quiera`;
      // $problemText.classList.remove("problem");
      $btnPlayHand.disabled = false;
    }
  }

  function getTakenState(taken) {
    if (taken === cardLimit) {
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

      $btnPoints.disabled = false;

    }else if(taken < cardLimit){
      $btnPoints.disabled = true;
      let porcentaje = taken != 0 ? taken * 100 / cardLimit: 0;
      
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
      $btnPoints.disabled = true;

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

$inputsRadioTake.forEach($radio => {
  if ($radio.checked) taken += parseInt($radio.value);
  $radio.addEventListener('change', () => {
    taken = 0;
    for (let i = 0; i < $inputsRadioTake.length; i++) {
      const $radio = $inputsRadioTake[i];
      if ($radio.checked) taken += parseInt($radio.value);
    }
    getTakenState(taken);
  })
});
  

  const editPlayerTakenText = () => {
    for (let i = 0; i< $inputsRadioRequest.length; i++) {
      if($inputsRadioRequest[i].checked) {
        let playerTextIndex = Math.floor(i/(cardLimit+1));
        $playerTakenLabel[playerTextIndex].innerHTML = `${$playerTakenLabel[playerTextIndex].getAttribute('data-name')} pidió ${$inputsRadioRequest[i].value}, se llevó:`
      }
    }
  }

  const setTable = () => {
    const $inputsRadioRequestChecked = [];
    const $inputsRadioTakeChecked = [];
    $inputsRadioRequest.forEach($input => {
      if($input.checked) $inputsRadioRequestChecked.push(parseInt($input.value));
    });
    $inputsRadioTake.forEach($input => {
      if($input.checked) $inputsRadioTakeChecked.push(parseInt($input.value));
    });

    for (let i = 0; i < 7; i++) {
      let points = 0;
      $tableTrList[i].children[1].innerHTML = $inputsRadioRequestChecked[i];
      $tableTrList[i].children[2].innerHTML = $inputsRadioTakeChecked[i];
      if($inputsRadioRequestChecked[i] === $inputsRadioTakeChecked[i]) {
        points = 10 + ($inputsRadioRequestChecked[i]*3);
      } else {
        $inputsRadioRequestChecked[i] < $inputsRadioTakeChecked[i] 
          ? points = ($inputsRadioTakeChecked[i] - $inputsRadioRequestChecked[i]) * -3 
          : points = ( $inputsRadioRequestChecked[i] - $inputsRadioTakeChecked[i] ) * -3; 
      }

      $tableTrList[i].children[3].innerHTML = points;
      $tableTrList[i].children[4].value = points;

    }

  }

  // eventos

  $btnPlayHand.addEventListener('click', (e) => {
    // $handSlider.style.marginLeft = '-100%';
    $handSlider.children[0].classList.add('none');
    $handSlider.children[1].classList.remove('none');
    taken = 0;
    editPlayerTakenText()
    $inputsRadioTake.forEach($radio => {
      if ($radio.checked) taken += parseInt($radio.value);
      getTakenState(taken);
    })
  })

  $btnPoints.addEventListener('click', (e) => {
    $handSlider.children[1].classList.add('none');
    $handSlider.children[2].classList.remove('none');
    setTable();
  })

  $btnReturnRequest.addEventListener('click', (e) => {
    $handSlider.children[0].classList.remove('none');
    $handSlider.children[1].classList.add('none');
    getPredictState();
  } )

  $btnReturnTake.addEventListener('click', (e) => {
    $handSlider.children[1].classList.remove('none');
    $handSlider.children[2].classList.add('none');
  })


  $inputsRadioRequest.forEach($radio => {
    if ($radio.checked && !$radio.classList.contains("lastPlayer")) requested += parseInt($radio.value);
    if ($radio.checked && $radio.classList.contains("lastPlayer")) requestedLastPlayer += parseInt($radio.value);
    getPredictState(requested,requestedLastPlayer,cardLimit);
  })

  $inputsRadioRequest.forEach($radio => {
    if ($radio.checked && !$radio.classList.contains("lastPlayer")) requested += parseInt($radio.value);
    if ($radio.checked && $radio.classList.contains("lastPlayer")) requestedLastPlayer += parseInt($radio.value);
    $radio.addEventListener('change', () => {
      requested = 0;
      requestedLastPlayer = 0;
      for (let i = 0; i < $inputsRadioRequest.length; i++) {
        const $radio = $inputsRadioRequest[i];
        if ($radio.checked && !$radio.classList.contains("lastPlayer")) requested += parseInt($radio.value);
        if ($radio.checked && $radio.classList.contains("lastPlayer")) requestedLastPlayer += parseInt($radio.value);
      }
      getPredictState(requested,requestedLastPlayer,cardLimit);
    })
  });


  d.getElementById("formHand").addEventListener('submit', () => {
    d.querySelector(".panel-loader").classList.add("is-active")
  })

  window.addEventListener( 'keydown' , (e) => {
    if(e.key == 'Tab') {
      e.preventDefault();
    }
  })

}