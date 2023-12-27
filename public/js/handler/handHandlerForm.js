export default function handHandlerForm () {

  const d = document,
  $btnPlayHand = d.getElementById("btnPlay"),
  $btnReturnHand = d.getElementById("btnReturnOne"),
  $btnPoints  = d.getElementById("btnPoints"),  
  $btnReturnTake = d.getElementById("btnReturnTwo"),
  $handSlider = d.getElementsByClassName('handSlider')[0],
  $inputRequest = d.querySelectorAll('input.inputRequest'),
  $inputTake = d.querySelectorAll('input.inputTake'),
  $playerTakenLabel = d.querySelectorAll('label.playerTaken'),
  $tableTrList = d.querySelectorAll('table tbody tr'),
  $problemText = d.getElementById("problemText"),
  lastPlayerName = d.querySelector("label[data-name]").getAttribute('data-name'),
  $percentageDiv = d.getElementById('btnPercentage'),
  $btnContainer = d.querySelector('.btnDiv'),
  $problemSpan = d.getElementById("problemSpan"),
  $btnPodium = d.getElementById('btnPodium'),
  $scoreContainer = d.getElementById('scoreContainer');

  let requested=0,requestedLastPlayer=0,taken = 0;

  // funciones

  const getPredictState = (pred,predLP,cardLimit) => {
    if ((pred+predLP) === cardLimit) {
      $btnPlayHand.disabled = true;
      $problemText.textContent = `${lastPlayerName} no puede pedir ${cardLimit - pred} ${cardLimit - pred == 1 ? 'carta': 'cartas'}`;
    } else if (pred < cardLimit) {
      $problemText.classList.remove("problem");
      $btnPlayHand.disabled = false;  
      $problemText.textContent = `${lastPlayerName} no puede pedir ${cardLimit - pred} ${cardLimit - pred == 1 ? 'carta': 'cartas'}`;
    } else if (pred===cardLimit) {
      $btnPlayHand.disabled = false;
      $problemText.textContent = `${lastPlayerName} no puede pedir 0 cartas`;
    }else if(pred>cardLimit){
      $problemText.textContent = `${lastPlayerName} puede pedir lo que quiera`;
      $problemText.classList.remove("problem");
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

$inputTake.forEach($radio => {
  if ($radio.checked) taken += parseInt($radio.value);
  $radio.addEventListener('change', () => {
    taken = 0;
    for (let i = 0; i < $inputTake.length; i++) {
      const $radio = $inputTake[i];
      if ($radio.checked) taken += parseInt($radio.value);
    }
    getTakenState(taken);
  })
});
  

  const editPlayerTakenText = () => {
    for (let i = 0; i< $inputRequest.length; i++) {
      if($inputRequest[i].checked) {
        let playerTextIndex = Math.floor(i/(cardLimit+1));
        $playerTakenLabel[playerTextIndex].innerHTML = `${$playerTakenLabel[playerTextIndex].getAttribute('data-name')} pidió ${$inputRequest[i].value}, se llevó:`
      }
    }
  }

  const setTable = () => {
    const $inputRequestChecked = [];
    const $inputTakeChecked = [];
    $inputRequest.forEach($input => {
      if($input.checked) $inputRequestChecked.push(parseInt($input.value));
    });
    $inputTake.forEach($input => {
      if($input.checked) $inputTakeChecked.push(parseInt($input.value));
    });

    for (let i = 0; i < 7; i++) {
      let points = 0;
      $tableTrList[i].children[1].innerHTML = $inputRequestChecked[i];
      $tableTrList[i].children[2].innerHTML = $inputTakeChecked[i];
      if($inputRequestChecked[i] === $inputTakeChecked[i]) {
        points = 10 + ($inputRequestChecked[i]*3);
      } else {
        $inputRequestChecked[i] < $inputTakeChecked[i] 
          ? points = ($inputTakeChecked[i] - $inputRequestChecked[i]) * -3 
          : points = ( $inputRequestChecked[i] - $inputTakeChecked[i] ) * -3; 
      }

      $tableTrList[i].children[3].innerHTML = points;
      $tableTrList[i].children[4].value = points;

    }

  }

  // eventos

  $btnPlayHand.addEventListener('click', (e) => {
    $handSlider.style.marginLeft = '-100%';
    taken = 0;
    editPlayerTakenText()
    $inputTake.forEach($radio => {
      if ($radio.checked) taken += parseInt($radio.value);
      getTakenState(taken);
    })
  })

  $btnPoints.addEventListener('click', (e) => {
    $handSlider.style.marginLeft = '-200%';
    setTable();
  })

  $btnReturnHand.addEventListener('click', (e) => {
    $handSlider.style.marginLeft = 0;
  } )

  $btnReturnTake.addEventListener('click', (e) => {
    $handSlider.style.marginLeft = '-100%';
  })


  $inputRequest.forEach($radio => {
    if ($radio.checked && !$radio.classList.contains("lastPlayer")) requested += parseInt($radio.value);
    if ($radio.checked && $radio.classList.contains("lastPlayer")) requestedLastPlayer += parseInt($radio.value);
    getPredictState(requested,requestedLastPlayer,cardLimit);
  })

  $inputRequest.forEach($radio => {
    if ($radio.checked && !$radio.classList.contains("lastPlayer")) requested += parseInt($radio.value);
    if ($radio.checked && $radio.classList.contains("lastPlayer")) requestedLastPlayer += parseInt($radio.value);
    $radio.addEventListener('change', () => {
      requested = 0;
      requestedLastPlayer = 0;
      for (let i = 0; i < $inputRequest.length; i++) {
        const $radio = $inputRequest[i];
        if ($radio.checked && !$radio.classList.contains("lastPlayer")) requested += parseInt($radio.value);
        if ($radio.checked && $radio.classList.contains("lastPlayer")) requestedLastPlayer += parseInt($radio.value);
      }
      getPredictState(requested,requestedLastPlayer,cardLimit);
    })
  });

  $btnPodium.addEventListener('click', (e) => {
    if($scoreContainer.classList.contains('active')) {
      $scoreContainer.classList.remove('active');
    } else {
      $scoreContainer.classList.add('active');
    }
  })

  window.addEventListener( 'keydown' , (e) => {
    if(e.key == 'Tab') {
      e.preventDefault();
    }
  })

}