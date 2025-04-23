const $playerList = document.querySelectorAll('#playersScoreList li');
const $firstPlayerLi = $playerList[0];

export default function showCrown()  {
    $firstPlayerLi.addEventListener('dblclick', async () => {
      const playerId = $firstPlayerLi.dataset.id;
      const gameId = $firstPlayerLi.dataset.game;
      let isCrowned = $firstPlayerLi.classList.contains("crowned");
      try {

        const res = await fetch('/game/setCrown', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ gameId, playerId, showCrown: !isCrowned })
        });

        if (res.ok) {
          // Opcional: agregar clase visual de corona
          $playerList.forEach(l => {
            l.classList.remove('crowned')
            l.querySelector('.crown-icon')?.classList.add('d-none');
          });
          // $playerList.classList.remove('crowned');
          // $playerList.querySelector('.crown-icon')?.setAttribute('hidden', true);


          if(!isCrowned){
            $firstPlayerLi.classList.add('crowned');
            $firstPlayerLi.querySelector('.crown-icon')?.classList.remove('d-none');;
          }
        } else {
          console.error('Error al cambiar la corona');
        }
      } catch (err) {
        console.error('Error en la solicitud:', err);
      }
    })
}


