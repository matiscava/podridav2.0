export default function setPlayerHandlerForm(){
    document.getElementById("formSetPlayers").addEventListener('submit', () => {
        document.querySelector(".panel-loader").classList.add("is-active")
      })

}