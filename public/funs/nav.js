// Yläpalkki infotaulu
function updateInfoDiv(str) {
  $("#infoDiv").empty();

  $("#infoDiv").append(`
    <div class="w3-container" style="display:block;">
        <p class="small-text"><a class="w3-small"> ${str} </a> </p>
      </div>`);
}

//updateInfoDiv();

function hideNavBar() {
  $("#navBar").empty();
}

function showNavBar() {
  $("#navBar").append(`
    <a id="NavBtnHome" class="w3-bar-item w3-button w3-padding-small"><i class='material-icons'> home </i> </a>
    <!-- <a id="NavBtnSettings" class="w3-bar-item w3-button w3-padding-small"><i class='material-icons'> settings </i></a> -->
    <a id="NavBtnResults" class="w3-bar-item w3-button w3-padding-small"> Live seuranta </a>
    <a id="NavBtnJatka" class="w3-bar-item w3-button w3-padding-small"> Jatka </a>
    <button disabled id="quickstart-sign-out" class= "w3-button w3-blue w3-bar-item w3-tiny w3-right" href="#"> Sign out</button>
  	`);

  $('#quickstart-sign-out').click(() => toggleSignIn());
  $('#NavBtnHome').click(() => startScreen());
  $('#NavBtnResults').click(() => showResultTable());
  $('#NavBtnJatka').click(() => gameScreen());
  $('#NavBtnSettings').click(() => settingsScreen());

  G_game.name == "empty" && $('#NavBtnResults').hide();

  if (G_myTeam.name == "empty" || !G_myTeam.name) {
    $('#NavBtnJatka').hide();
  }

}
