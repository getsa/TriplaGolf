// Käyttöliittymä / "screenit"



// Listaa pelit, luo uuden pelin, asettaa G_gamen valittuun, nollaa joukkueen
function startScreen() {




  $("#gameAppDiv").show();
  //G_myTeam.status == "sportOn" ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();
  G_game.name == "empty" ? $('#NavBtnResults').hide() : $('#NavBtnResults').show();
  G_myTeam.players.length > 0 ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();

  console.log("Näytöllä: startScreen");
  //  updateInfoDiv('Lets mennään!');
  $("#gameAppDiv").empty();
  $("#gameAppDiv").append(`
    <div class="alaNapitGrid w3-container">
      <img id="logo" src="triplagolf.gif" >
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
function setNewGame() {
  $('#id01').slideDown()
}


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

function loginScreen() {
$("#vueApp").append(`
  <login-button id="quickstart-sign-in" v-show="loginButtonDisplay=='loginActive'" ></login-button>
	<login-button-inactive id="quickstart-sign-in-inactive" v-show="loginButtonDisplay=='loginInActive'"></login-button>
  `)
}
