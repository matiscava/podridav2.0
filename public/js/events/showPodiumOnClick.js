export default function showPodiumOnClick() {
  const $btnPodium = document.getElementById('btnPodium'),
  $scoreContainer = document.getElementById('scoreContainer');

  $scoreContainer.style.left = `${window.innerWidth - $btnPodium.scrollWidth}px`;
  $scoreContainer.classList.add('transition3sLeft');
  $btnPodium.addEventListener('click', (e) => {
    console.log('estoy aca');

    if($scoreContainer.classList.contains('activePodium')) {
      $scoreContainer.classList.remove('activePodium');
      $scoreContainer.style.left = `${window.innerWidth - $btnPodium.scrollWidth}px`;
    } else {
      $scoreContainer.classList.add('activePodium');
      $scoreContainer.style.left = `${window.innerWidth - $scoreContainer.scrollWidth}px`;

    }
  })
}