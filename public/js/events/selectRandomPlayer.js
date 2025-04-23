export default function selectRandomPlayer(){
    const shuffleButton = document.getElementById('btn-shuffle');
    const select = document.getElementById('firstPlayer');
    const selectedPlayerText = document.getElementById('selected-player');

    shuffleButton.addEventListener('click', () => {
      const options = select.options;
      const randomIndex = Math.floor(Math.random() * options.length);
      select.selectedIndex = randomIndex;

      const selectedName = options[randomIndex].text;
      selectedPlayerText.textContent = `${selectedName} será el jugador que arranque siendo mano`;
    });

    select.addEventListener('change', () =>{
        const options = select.options;
        const selectedName = options[select.selectedIndex].text;
        selectedPlayerText.textContent = `${selectedName} será el jugador que arranque siendo mano`;      
    } )
}