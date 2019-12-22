// Käyttöliittymä / "screenit"

// Listaa pelit, luo uuden pelin, asettaa G_gamen valittuun, nollaa joukkueen
function startScreen() {

  //G_myTeam.status == "sportOn" ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();
  G_game.name == "empty" ? $('#NavBtnResults').hide() : $('#NavBtnResults').show();
  G_myTeam.players.length > 0 ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();

  console.log("Näytöllä: startScreen");
  //  updateInfoDiv('Lets mennään!');
  $("#gameAppDiv").empty();
  $("#gameAppDiv").append(`
    <div class="alaNapitGrid w3-container">
      <img src="triplagolf2019.gif" style="width:100%;height:200px;">
      <p/>
    	<button id="followGameBtn" class="w3-btn w3-green alaNapitGrid-item">Seuraa</button>
      <p/>
      <button id="playGameBtn" class="w3-btn w3-green alaNapitGrid-item">Liity / Jatka</button>


    </div>`);

  $('#playGameBtn').click(() => {
    $("#gameAppDiv").empty();
    listOnGoingGames();
    $("#gameAppDiv").append(`
     <div class="alaNapitGrid w3-container">
       <p/>
     	 <button id="createNewGameBtn" class="w3-btn w3-green alaNapitGrid-item">Uusi peli</button>
       <hr>
       <button id="showFinishedGamesBtn" class="w3-btn w3-green alaNapitGrid-item">Vanhat pelit</button>
       <button id="showSettingsBtn" class="w3-btn w3-green alaNapitGrid-item">Asetukset</button>
     </div>`);

    $('#createNewGameBtn').click(() => createNewGame());
    $('#showSettingsBtn').click(() => settingsScreen());
    $('#showFinishedGamesBtn').click(() => showFinishedGamesScreen());
  });

  $('#followGameBtn').click(() => {
    $("#gameAppDiv").empty();
    listOnGoingGames(1);
  });


  // Valitse näytettävät alanapit
  function chooseResContSet(showResults=0) {

    if (showResults) {
      showResultTable();
    }
    else {
      $("#gameAppDiv").empty();
      $("#gameAppDiv").append(`
          <div class="w3-container">
            <div id="gameListID" class= "alaNapitGrid" style="display:none;"></div> <p/><p/>
              <!--  <button id="lives_btn" class=" w3-btn w3-green alaNapitGrid-item"> LIVESEURANTA</button><p/> -->
              <button id="contGame_btn" class=" w3-btn w3-green alaNapitGrid-item"> Uusi ryhmä </button><p/>
              <button id="backToStart_btn" class=" w3-btn w3-green alaNapitGrid-item"> Takaisin </button><p/>
              <!-- <button id="setGame_btn" class=" w3-btn w3-green alaNapitGrid-item"> Pelin asetukset</button><p/> -->
          </div>
          `);

      $("#lives_btn").click(() => {
        showResultTable();
      });
      $("#contGame_btn").click(() => {
        selectGroupScreen();
      });
      $("#backToStart_btn").click(() => {
        startScreen();
      });
    }
  }
  //Uusi peli
  function createNewGame() {
    if (window.confirm('Uusi peli?')) {
      let name = prompt("Pelin nimi:", "");
      console.log(G_database);
      let existingGame = G_database.games.find(e => e.name === name);

      if (existingGame) {
        if (confirm("Saman niminen peli on jo olemassa, haluatko muokata peliä?")) {
          G_game = existingGame;
          G_myTeam.gameName = G_game.name;
          G_myTeam.players = [];
          selectSportsScreen();
        }
      } else if (name == null) {
        startScr();
      } else if (name == "") {
        alert("Anna pelille nimi!");
      } else {
        G_game = new Game(name);
        G_myTeam.gameName = G_game.name;
        G_myTeam.players = [];
        selectSportsScreen();
      }
    }
  }
  //Listataan keskeneräiset pelit
  function listOnGoingGames(showResults=0) {
    $("#gameAppDiv").append(`
      <div class="w3-container">
        <p id="ContinueGameTag" style="display:none;"> Jatka: </p>
        <div id="gameListID" class= "listaGrid" style="display:none;"></div>
      </div>
      `);
    //console.log(G_database);
    if (G_database.games.length==0) {
      $("#gameAppDiv").append(`
        <div class="w3-container">
          <p> Ei pelejä menossa </p>

        </div>
        `);
    }
    else {
      //Listataan keskeneräiset pelit
      G_database.games.forEach((game, i) => {
        $("#gameListID").show();
        if (game.status == "gameOn") {
          $("#ContinueGameTag").show();

          let gamesListItemID = `${game.name}_gamesListItemID`;
          gamesListItemID = gamesListItemID.replace(/\s+/g, '');
          $("#gameListID").append(`
            <button id="${gamesListItemID}" class="w3-btn w3-amber listaGrid-item" >${game.name}</button><p/>
            `);
          $(`#${gamesListItemID}`).data("gameobj", game);

          //Valitaan vanha peli:
          $(`#${gamesListItemID}`).click(function() {
            let game_obj = $(this).data("gameobj");
            Object.assign(G_game, game_obj);
            G_myTeam.gameName = G_game.name;
            G_myTeam.players = [];
            chooseResContSet(showResults);
            //selectGroupScreen();
            //$('#NavBtnResults').show();
          });
        }
      });
    }
  }
$("#gameAppDiv").append(`
  <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/B5-_6nfnr5-/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/B5-_6nfnr5-/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> Näytä tämä julkaisu Instagramissa.</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div></a> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/B5-_6nfnr5-/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Triplagolfin maailmanmestaruuskilpailujen virallinen merchandise myymälä on nyt avattu. #Sale #Alennus #Pikeepaita #Liplakki #Visiiri #mestaruuslippis #Triplagolfinammattilainen #Golferskeepswinginglonger #Golfboys #Triplagolf® #Triplagolfinmaailmanmestaruus #Discgolf #Golf #Minigolf #maailmanmestaruus</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">Henkilön <a href="https://www.instagram.com/triplagolfinmaailmanmestaruus/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> Triplagolf®</a> (@triplagolfinmaailmanmestaruus) jakama julkaisu <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2019-12-12T19:37:08+00:00">Joulu 12, 2019 kello 11.37 PST</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>
`);
  // Listaa vanhat loppuun pelatut pelit
  function showFinishedGamesScreen() {
    console.log(G_database);
    $("#ContinueGameTag").text("Vanhat pelit:");
    $('#showFinishedGamesBtn').text("Keskeneräiset pelit:");
    $('#showFinishedGamesBtn').click(() => startScreen());
    $("#gameListID").empty();

    G_database.games.forEach((game, i) => {
      $("#gameListID").show();
      if (game.status == "finished") {
        let gamesListItemID = `${game.name}_gamesListItemID`;
        gamesListItemID = gamesListItemID.replace(/\s+/g, '');
        $("#gameListID").append(`
          <button id="${gamesListItemID}" class="w3-btn w3-amber listaGrid-item" >${game.name}</button><p/>
          `);
        $(`#${gamesListItemID}`).data("gameobj", game);

        //Valitaan vanha peli:
        $(`#${gamesListItemID}`).click(function() {
          let game_obj = $(this).data("gameobj");
          Object.assign(G_game, game_obj);
          G_myTeam.gameName = G_game.name;
          G_myTeam.players = [];
          chooseResContSet();
          //selectGroupScreen();
          //$('#NavBtnResults').show();
        });
      }
    });
  }
}

//  Luo uudet lajit, lisää valitut lajit gameen (continue tallentaa pelin pilveen)
function selectSportsScreen() {
  console.log("Näytöllä: selectSportsScreen ");
  let parNr;
  //let parList = [];

  $("#gameAppDiv").empty();
  //Main elements
  $("#gameAppDiv").append(`

    <div class="w3-container skabanNimi">
      <h3>${G_game.name.toUpperCase()}</h3>
    </div>

    <div class="w3-container>
      <div class="w3-container">
        <p>Lajit:</p>
      </div>
      <div class="sportsListID"></div> <p/>
    </div>
    <div class="w3-container alaNapit">
      <div class="alaNapitGrid w3-container">
  	     <button id="newSportBtn" class=" alaNapitGrid-item w3-btn w3-green" > Uusi laji </button>
  	     <button id="continueBtn" class="alaNapitGrid-item w3-btn w3-green" style="display:none;"> Jatka </button>
      </div>

    </div>
    <div id="id01" class="w3-modal">
      <div class="w3-modal-content">
        <div class="w3-content">
          <span onclick="document.getElementById('id01').style.display='none'" class="w3-btn w3-display-topright">&times;</span>
            <p>Laji:</p><input id="newSportNameID" class="w3-input" type="text"> </input>
            <p>Väylämäärä / Eriä: </p>
            <input id="newSportParNrID" type="number" name="parNr" class="w3-input"> </input>
            <div id="newSportParListID"></div>
            <button id="inputNewSportOKBtn" class="w3-btn w3-green" > OK </button>
            <button id="inputNewSportCancelBtn" class="w3-btn w3-green"> Peruuta </button>
            <p/>
        </div>
      </div>
    </div>
    `);


  $('#newSportBtn').click(() => {
    $('#id01').slideDown();
  });
  // Päivitä par-inputtien määrä reikämäärän mukaan
  $('#newSportParNrID').on('input', () => {
    let parNr = $('#newSportParNrID').val();
    $("#newSportParListID").empty();
    $("#newSportParListID").append("<p>Par/Tavoite:</p>");
    for (var i = 0; i < parNr; i++) {
      $("#newSportParListID").append(`
      ${i+1}. <input type="text" id="parListItem${i}" maxlength="2" size="2" class="w3-input w3-center"></input>`);
    }
    $("#newSportParListID").append("<p/>");
  });

  $('#inputNewSportOKBtn').click(() => {
    let parList = [];
    let parNr = $('#newSportParNrID').val();
    let sportName = $('#newSportNameID').val();
    if (!parNr || !sportName) {
      console.log("Syötä par määrä ja nimi");
    } else {
      for (var i = 0; i < parNr; i++) {
        let parValue = $(`#parListItem${i}`).val();
        parValue = parseInt(parValue, 10);
        if (Number.isInteger(parValue)) {
          parList.push(parValue);
        } else {
          console.log("Par-value tyhjä");
          parValue = [];
          break;
        }

        if (i == (parNr - 1)) {

          var sportInListID = `${sportName}_sportListItemID`;
          $('#id01').fadeOut();
          $(".sportsListID").append(`<button class="w3-btn w3-lime " id='${sportInListID}'>${sportName}</button><p/>`);
          $('#continueBtn').show();

          G_game.sports[sportName] = new Sport(sportName, parNr, [...parList]);
          console.log('New sport added to the current game:');
          console.log(G_game.sports[sportName]);
          //POISTO
          $(`#${sportInListID}`).click(() => {
            if (window.confirm('Poista peli?')) {

              $(`#${sportInListID}`).hide();
              $(`#${sportInListID}_tickMark`).hide();
              delete G_game.sports[sportName];
              console.log('sport removed from game:');
            }
          });
        }
      }


    }
  });

  $('#continueBtn').click(() => {
    G_game.status = "gameOn";
    saveGame2cloud();
    selectGroupScreen();

  });



}

// Listaa olemassaolevat pelaajat, luodaan uusia ja tallennetaan pilveen, Valitaan pelaajat ryhmään
function selectGroupScreen() {
  console.log("Näytöllä: selectGroupScreen ");

  //saveGame2cloud();

  $("#gameAppDiv").empty();
  $("#gameAppDiv").append(`
    <p>Valitse pelaajat:</p>
      <div class="playerNameList" style="width:80%; margin-left: auto;margin-right: auto;"><p/>
      </div>
    <div class="alaNapitGrid w3-container">
      <button id="newPlayerBtn" class="w3-btn w3-green alaNapitGrid-item"> Uusi pelaaja </button>
      <button id="startBtn" class="w3-btn w3-green alaNapitGrid-item"> Aloita </button>
    </div>
    `);

  // Lisää olemassaolevat pelaajat listaan
  for (let i = 0; i < G_database.players.length; i++) {
    let player = new Player(G_database.players[i].name);
    let parentID = `.playerNameList`;
    let listItemID = `${player.name}_namelistID`;
    $(parentID).append(`<button class="w3-btn w3-light-grey" id='${listItemID}'> ${player.name} </button>`);

    $(`#${listItemID}`).data("playerName", player.name);
    $(`#${listItemID}`).click(function() {
      let playerName = $(this).data("playerName");
      toggleTeamState(playerName);
    });
  }

  $("#newPlayerBtn").click(function() {

    let parentID = `.playerNameList`;

    let playerName = prompt("Nimi:", "");
    if (playerName != null) {
      let player = new Player(playerName);
      savePlayer2cloud(player);
      G_myTeam.players.push(playerName);
      let listItemID = `${playerName}_namelistID`;

      $(".playerNameList").append(`
          <button class="w3-btn w3-lime" id='${listItemID}'> ${playerName} </button>
          `);

      // Set element data
      $(`#${listItemID}`).data("playerName", playerName);
      $(`#${listItemID}`).click(function() {
        let playerName = $(this).data("playerName");
        toggleTeamState(playerName);

      });
    }
  });

  function toggleTeamState(playerName) {
    let listObjID = `${playerName}_namelistID`;
    let existsInTeam = false;
    for (var i = 0; i < G_myTeam.players.length; i++) {
      if (G_myTeam.players[i] == playerName) {
        existsInTeam = true;
        break;
      }
    }
    //console.log(cont);
    if (existsInTeam) {
      let index = G_myTeam.players.indexOf(playerName);
      G_myTeam.players.splice(index, 1);

      $(`#${listObjID}`).addClass("w3-light-grey");
      //console.log(playerName + ' removed from team:');
    } else {
      $(`#${listObjID}`).removeClass("w3-light-grey").addClass("w3-lime");
      //console.log(playerName + ' added to team:');
      G_myTeam.players.push(playerName);
    }
    //console.log('Team:');
    //  console.log(G_myTeam);
  }

  $('#startBtn').click(function() {
    if (G_myTeam.players.length > 0) {
      //Tallenna pelaajat jokaisen sportin players-objektiin, jossei ne siellä vielä ole (Joku muu on voinut lisätä?)
      Object.keys(G_game.sports).forEach((sportName, index) => {
        //Käy läpi pelaajat
        G_myTeam.players.forEach(function(playerName, ind, array) {
          //Lisätään peliin jos ei jo löydy
          if (!G_game.players.hasOwnProperty(playerName)) {
            G_game.players[playerName] = new Player(playerName);
          }
          //Lisätään Lajiin jos ei jo löydy
          if (!G_game.sports[sportName].players.hasOwnProperty(playerName)) {
            G_game.sports[sportName].players[playerName] = new Player(playerName);
            G_game.players[playerName].addSportPoints(sportName);
            G_game.sports[sportName].players[playerName].addSportResults(G_game.sports[sportName]);
          }
        });
      });

      saveGame2cloud();
      selectNextSport();

    } else {
      alert('Valitse joukkueesi!');
    }
  });
}

// Valitaan laji
function selectNextSport() {

  console.log("Näytöllä:  selectNextSport");

  //saveGame2cloud();

  $("#gameAppDiv").empty();
  let listItemID = "";
  $("#gameAppDiv").append(`
    <p>Valitse laji:</p>
      <div class="alaNapitGrid startSportsListID" style="width:80%; margin-left: auto;margin-right: auto;"><p/>
      </div>
    </p>`);

  Object.keys(G_game.sports).forEach(function(sportName, index) {
    //console.log(obj);
    listItemID = `${sportName}x_sportsListItemID`;
    $(".startSportsListID").append(`
    <button id="${listItemID}" class="alaNapitGrid w3-button w3-green"> ${sportName} </button>
    `);
    $(`#${listItemID}`).data("sportName", sportName);
    $(`#${listItemID}`).click(function() {
      //  console.log("click");
      let sportName = $(this).data("sportName");
      G_myTeam.currentSport = sportName;
      G_game.currentSport = sportName;
      G_myTeam.status = "sportOn";
      //
      G_game.status = "gameOn";
      G_game.sports[sportName].status = "sportOn";
      console.log("G_game.status: " + G_game.status);
      console.log("G_game.sports["+sportName+"].status: " + G_game.sports[sportName].status);
      setLocaleStorage();
      saveGame2cloud();
      gameScreen();
    });
  });
}

//Pelin kulku, tallennus pilveen siirryttäessä seuraavaan väylään tai refreshattaessa sivu
function gameScreen() {
  $('#NavBtnHome').show();
  $('#NavBtnResults').show();
  $('#NavBtnJatka').hide();

  G_myTeam.status = "sportOn";

  console.log("gameScreen() - G_game:");
  console.log(G_game);
  let sport = G_game.sports[G_myTeam.currentSport]; //REF
  const sportName = sport.name;
  let par = sport.parList[G_myTeam.currentHole];

  $("#gameAppDiv").empty();
  //Luo väylänapit ja pelitaulukko ja kierroksen lopetusnappi
  $("#gameAppDiv").append(`
    <div class="w3-container gameOnScr w3-center">
      <div> ${G_myTeam.currentSport} - ${sport.parNr} väylää (PAR ${sport.totalPar})</div>
    	<div class='nextPrevBtnDiv'>
      	<button id=holeButtonPrev class="w3-btn w3-green w3-medium"> Edellinen </button>
      	<button id=holeButtonNext class="w3-btn w3-green w3-medium"> Seuraava </button>
    	</div>

      <div class="gameGrid w3-small">
        <div class="firstRowOnGameTable gameGrid-item">
          Väylä <span id="holeNrID">${G_myTeam.currentHole}</span> (PAR  <span id="parID">${sport.parList[G_myTeam.currentHole-1]}</span> )
        </div>
        <div class="gameGrid-item"></div><div class="gameGrid-item"></div>
        <div class="gameGrid-item">Lyönnit</div>
        <div class="gameGrid-item"></div>
        <div class="gameGrid-item"> +/- </div>
      </div>
      <div class="w3-container alaNapitGrid">
        <button id="finishSportButton" class="w3-btn alaNapitGrid-item w3-green" style="display:none">Päätä kierros</button>
      </div>

    </div>
    `);



  if (G_myTeam.currentHole == sport.parNr) {
    $('#finishSportButton').show();
  }
  else {
    $('#finishSportButton').hide();
  }

  $(`#holeButtonPrev`).click(() => {
    (G_myTeam.currentHole > 1) && G_myTeam.currentHole--;
    $('#holeNrID').text(G_myTeam.currentHole);
    $('#parID').text(sport.parList[G_myTeam.currentHole - 1]);
    // Scoren päivitys
    Object.keys(G_myTeam.players).forEach(function(key, index) {
      let playerName = G_myTeam.players[key];
      let scoreID = `score_${playerName}`;
      $(`#${scoreID}`).text(G_game.sports[sportName].players[playerName].scoreList[G_myTeam.currentHole - 1]); // Henk. koht. pistemäärä näytölle
      G_game.players[playerName][sportName+'CurrentHole'] = G_myTeam.currentHole; // Henk. koht. tämänhetkinen reikä
    });

    setLocaleStorage();
    saveGame2cloud();
  });

  $(`#holeButtonNext`).click(() => {
    (G_myTeam.currentHole < sport.parNr) && G_myTeam.currentHole++;
    $('#holeNrID').text(G_myTeam.currentHole);
    $('#parID').text(sport.parList[G_myTeam.currentHole - 1]);

    Object.keys(G_myTeam.players).forEach(function(key, index) {
      let playerName = G_myTeam.players[key];
      let scoreID = `score_${playerName}`;
      $(`#${scoreID}`).text(G_game.sports[sportName].players[playerName].scoreList[G_myTeam.currentHole - 1]); // Henk. koht. pistemäärä näytölle
      G_game.players[playerName][sportName+'CurrentHole'] = G_myTeam.currentHole; // Henk. koht. tämänhetkinen reikä
    });

    if (G_myTeam.currentHole == sport.parNr) {
      $('#finishSportButton').show();
    }


    setLocaleStorage();
    saveGame2cloud();
  });

  $(`#finishSportButton`).click(() => {
    G_myTeam.status = "results";
    console.log(G_myTeam.status);
    new Promise((resolve, reject) => saveGame2cloud(resolve, reject))
      .then(showResultTable());
  });

  // Luo rivit
  G_myTeam.players.forEach((playerName, index, arr) => {
    let addBtn = `addOneBtn_${playerName}`;
    let removeBtn = `removeOneBtn_${playerName}`;
    let scoreID = `score_${playerName}`;
    let totScoreID = `totalScore_${playerName}`;

    let sport = G_game.sports[G_myTeam.currentSport]; //REF
    let sportName = sport.name;
    let sportPlayer = sport.players[playerName]; //REF
    let player = G_game.players[playerName]; //REF
    let parList = sport.parList; //REF
    let par = sport.parList[G_myTeam.currentHole - 1];
    let parSum = sport.parList.reduce((total, num) => total + num, 0);
    let score = sportPlayer.scoreList[G_myTeam.currentHole - 1];
    let totScore = player[sportName + "Score"];

    $(".gameGrid").append(`
    <div class="playerNameColumn-item gameGrid-item"> ${playerName}</div>
    <div class="removeSwing gameGrid-item">
      <button id="${removeBtn}" class="w3-large w3-btn w3-dark-grey w3-card-4 w3-circle plusMinuBtn"  > - </button> </div>
    <div id="${scoreID}" class="swingNr-item gameGrid-item"> ${score}  </div>
    <div class="addSwing-item gameGrid-item">
      <button id="${addBtn}" class="w3-large w3-btn w3-dark-grey w3-circle w3-card-4 plusMinuBtn"> + </button> </div>
    <div id="${totScoreID}"  class="totalScore-item gameGrid-item"> ${totScore} </div>
    `);

    // Poista lyönti - Ei päästetä alle nollan
    $(`#${removeBtn}`).data({
      "sportPlayer": sportPlayer,
      "player": player
    });
    $(`#${removeBtn}`).click(function() {
      let sportPlayer = $(this).data("sportPlayer");
      let player = $(this).data("player");
      if (sportPlayer.scoreList[G_myTeam.currentHole - 1] > 1) {
        --sportPlayer.scoreList[G_myTeam.currentHole - 1];
        --player[sportName + 'Score'];
      }
      $(`#${scoreID}`).text(sportPlayer.scoreList[G_myTeam.currentHole - 1]);
      $(`#${totScoreID}`).text(player[sportName + 'Score']);
      saveGame2cloud();
    });

    // Lisää lyönti - Ei mennä yli maksimin ?
    $(`#${addBtn}`).data({
      "sportPlayer": sportPlayer,
      "player": player
    });
    $(`#${addBtn}`).click(function() {
      let sportPlayer = $(this).data("sportPlayer");
      let player = $(this).data("player");
      if (sportPlayer.scoreList[G_myTeam.currentHole - 1] <= sport.maxScore[G_myTeam.currentHole - 1]) {
        console.log("Scorelist of " + sportPlayer.name + " aka " + player.name);
        console.log(sportPlayer.scoreList);
        ++sportPlayer.scoreList[G_myTeam.currentHole - 1];
        console.log(sportPlayer.scoreList);
        ++player[sportName + 'Score'];
      }
      $(`#${scoreID}`).text(sportPlayer.scoreList[G_myTeam.currentHole - 1]);
      $(`#${totScoreID}`).text(player[sportName + 'Score']);
      saveGame2cloud();
    });
  });
}
