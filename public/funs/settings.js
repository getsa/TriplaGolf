function settingsScreen() {
  console.log("Näytöllä: settingsScreen ");
  G_myTeam.players.length > 0 ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();


  $("#gameAppDiv").empty();
  $("#infoDiv").hide();

  //Main elements
  $("#gameAppDiv").append(`
    <div class="w3-container">
      <br>
      <button id="gameSettingsBtn" class="w3-btn w3-green"> Peliasetukset </button><br><br>
      <button id="debugBtn" class="w3-btn w3-green"> Säätö </button><br><br>
      <logout-button id="quickstart-sign-out"> </logout-button>
    </div>

    `);




  $("#gameSettingsBtn").click( () => gameSettingsScreen() );
  $("#debugBtn").click( () => debugSettingsScreen() );



  function gameSettingsScreen() {
    $("#gameAppDiv").empty();
    $("#gameAppDiv").append(`
      <div class="w3-container">
        <br>
        <button id="changeSportsBtn" class="w3-btn w3-green"> Muuta Lajeja </button><br><br>
        <button id="maxSrokesBtn" class="w3-btn w3-green"> Maksimi PAR ylitys </button><br><br>
        <button id="pointsArrayBtn" class="w3-btn w3-green"> Pistejako </button><br><br>
      </div>
      `);

      $("#changeSportsBtn").click( () => changeSportsScreen() );
      $("#maxSrokesBtn").click( () => maxStrokesScreen() );
      $("#pointsArrayBtn").click( () => pointsArrayScreen() );

      function maxStrokesScreen() {
        $("#gameAppDiv").empty();
        $("#gameAppDiv").append(`
          <div class="w3-container">
            <br>
            <input>
          </div>
          `);
      }
      function pointsArrayScreen() {
        $("#gameAppDiv").empty();
      }
      function changeSportsScreen() {
        $("#gameAppDiv").empty();
      }

  }

  function debugSettingsScreen() {
    $("#gameAppDiv").empty();
  }

  // Tähän lajikohtaiset maximimäärät ja pistemäärät päivittymään!
  // $("#gameAppDiv").append(`
  //   <div class="w3-container">
  //     <h3> Ei toimi vielä... </h3>
  //     <p> Max. tulos = + <input id="maxStrokesID" class="settingInput" type="number" value="${G_game.maxStrokes}"></input></p>
  //     <hr>
  //     <p> Pistejako:</p>
  //     <p> Pistesijojen määrä: <input id="points1" value="12" class="settingInput" type="number"> </p>
  //     <ol>
  //       <li><input id="points1" value="14" class="settingInput" type="number"></input></li>
  //       <li><input id="points2" value="12"class="settingInput" type="number"></input></li>
  //       <li><input id="points3" value="10"class="settingInput" type="number"></input></li>
  //       <li> <input id="points4" value="9"class="settingInput" type="number"></input></li>
  //       <li><input id="points5" value="8"class="settingInput" type="number"></input></li>
  //       <li><input id="points6" value="7" class="settingInput" type="number"></input></li>
  //       <li><input id="points7" value="6"class="settingInput" type="number"></input></li>
  //       <li> <input id="points8" value="5" class="settingInput" type="number"></input></li>
  //       <li> <input id="points9" value="4" class="settingInput" type="number"></input></li>
  //       <li> <input id="points10" value="3" class="settingInput" type="number"></input></li>
  //       <li> <input id="points11" value="2" class="settingInput" type="number"></input></li>
  //       <li> <input id="points12" value="1" class="settingInput" type="number" value></input></li>
  //     </ol>
  //     <hr>
  //       <button id="clearLocaleStorageBtn" class="w3-btn w3-green"> Tyhjennä lokaalimuisti </button>
  //   </div>
  //   `);
  // $("#clearLocaleStorageBtn").click(()=>{
  //   localStorage.clear();
  // });

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
