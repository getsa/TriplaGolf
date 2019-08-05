function settingsScreen() {
  console.log("Näytöllä: settingsScreen ");
  console.log(G_game.maxStrokes);
  G_myTeam.players.length > 0 ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();


  $("#gameAppDiv").empty();
  $("#infoDiv").hide();
  //Main elements

  // Tähän lajikohtaiset maximimäärät ja pistemäärät päivittymään!
  $("#gameAppDiv").append(`
    <div class="w3-container">
      <p> Max. tulos = + <input id="maxStrokesID" class="settingInput" type="number" value="${G_game.maxStrokes}"></input></p>
      <hr>
      <p> Pistejako:</p>
      <p> Pistesijojen määrä: <input id="points1" value="12" class="settingInput" type="number"> </p>
      <ol>
        <li><input id="points1" value="14" class="settingInput" type="number"></input></li>
        <li><input id="points2" value="12"class="settingInput" type="number"></input></li>
        <li><input id="points3" value="10"class="settingInput" type="number"></input></li>
        <li> <input id="points4" value="9"class="settingInput" type="number"></input></li>
        <li><input id="points5" value="8"class="settingInput" type="number"></input></li>
        <li><input id="points6" value="7" class="settingInput" type="number"></input></li>
        <li><input id="points7" value="6"class="settingInput" type="number"></input></li>
        <li> <input id="points8" value="5" class="settingInput" type="number"></input></li>
        <li> <input id="points9" value="4" class="settingInput" type="number"></input></li>
        <li> <input id="points10" value="3" class="settingInput" type="number"></input></li>
        <li> <input id="points11" value="2" class="settingInput" type="number"></input></li>
        <li> <input id="points12" value="1" class="settingInput" type="number" value></input></li>
      </ol>
      <hr>
        <button id="clearLocaleStorageBtn" class="w3-btn w3-green"> Tyhjennä lokaalimuisti </button>
    </div>
    `);
  $("#clearLocaleStorageBtn").click(()=>{
    localStorage.clear();
  });

  $("#maxStrokesID").change( () => {
    num = parseInt($("#maxStrokesID").val(), 10);
    G_game.maxStrokes =num;
    if (Object.keys(G_game.sports).length > 0) {
      Object.keys(G_game.sports).forEach((sportName) => {
        G_game.sports[sportName].setMaxScore();
        console.log("tähän");
        console.log(sportName);
      })
    }
  })
}
