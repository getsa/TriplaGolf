// Käyttöliittymän hallinta



// Yläpalkki infotaulu
function updateInfoDiv(str) {
  $("#infoDiv").empty();

  $("#infoDiv").append(`
    <div class="w3-container" style="display:block;">
        <p class="small-text"><a class="w3-small"> Lisää localStoragen nollaus jos haku epäonnistuu!  </a> </p>
      </div>`);
}

updateInfoDiv();

function hideNavBar() {
  $("#navBar").empty();
}
function showNavBar() {
  $("#navBar").append(`
    <a id="NavBtnHome" class="w3-bar-item w3-button w3-padding-small"><i class='material-icons'> home </i> </a>
    <a id="NavBtnSettings" class="w3-bar-item w3-button w3-padding-small"><i class='material-icons'> settings </i></a>
    <a id="NavBtnResults" class="w3-bar-item w3-button w3-padding-small"> Live seuranta </a>
    <a id="NavBtnJatka" class="w3-bar-item w3-button w3-padding-small"> Jatka </a>
    <button disabled id="quickstart-sign-out" class= "w3-button w3-blue w3-bar-item w3-tiny w3-right" href="#"> Sign out</button>
  	`);

    $('#quickstart-sign-out').click( () => toggleSignIn() );
    $('#NavBtnHome').click( () => startScreen() );
    $('#NavBtnResults').click( () => showResultTable() );
    $('#NavBtnJatka').click( () => gameScreen() );
    $('#NavBtnSettings').click( () => settingsScreen() );

    G_game.name == "empty" && $('#NavBtnResults').hide();

    if (G_myTeam.name == "empty" || !G_myTeam.name) {
      $('#NavBtnJatka').hide();
    }

}

// Listaa pelit, luo uuden pelin, asettaa G_gamen valittuun, nollaa joukkueen
function startScreen() {
  $('#NavBtnHome').hide();

  G_myTeam.status=="sportOn" ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();

  console.log("Näytöllä: startScreen");
  updateInfoDiv('Lets mennään!');
  $("#gameAppDiv").empty();

  $("#gameAppDiv").append(`
    <div class="w3-container">
      <p id="ContinueGameTag" style="display:none;"> Valitse peli: </p>
      <div id="gameListID" class= "listaGrid" style="display:none;"></div>
    </div>
  	`);

  //Listataan pelit:s
  G_database.games.forEach((game, i) => {
    $("#gameListID").show();
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
      Object.assign(G_game,game_obj);
      G_myTeam.gameName = G_game.name;
      G_myTeam.players = [];
      selectGroupScreen();
      $('#NavBtnResults').show();
    });

  });

  $("#gameAppDiv").append(`
    <div class="alaNapitGrid w3-container">
    	<button id="createNewGameBtn" class="w3-btn w3-green alaNapitGrid-item">Uusi peli</button>
    </div>
    	`);

  document.title = 'TriplaGolf App';

  $('#createNewGameBtn').click(function() {
    if (window.confirm('Uusi peli?')) {
      let name = prompt("Pelin nimi:", "");
      console.log(G_database);
      let existingGame = G_database.games.find(e => e.name === name);

      if (existingGame) {
        if (confirm("Peli on olemassa, haluatko muokata peliä?")) {
          G_game = existingGame;
          G_myTeam.gameName = G_game.name;
          G_myTeam.players = [];
          selectSportsScreen();
        }
      }
      else if (name != "") {
        G_game = new Game(name);
        G_myTeam.gameName = G_game.name;
        G_myTeam.players = [];
        selectSportsScreen();
      } else {
        alert("Anna pelille nimi!")
      }
    }
  });
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
  $('#newSportParNrID').on('input', function() {
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

          G_game.sports[sportName] = new Sport(sportName,parNr,[...parList]);
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

      }
    );
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

  console.log("Näytöllä:  selectFirstSport");

  //saveGame2cloud();

  $("#gameAppDiv").empty();
  let listItemID = "";
  $("#gameAppDiv").append(`
    <p>Ensimmäinen laji:</p>
      <div class="alaNapitGrid startSportsListID" style="width:80%; margin-left: auto;margin-right: auto;"><p/>
      </div>
    </p>`);

  Object.keys(G_game.sports).forEach(function(sportName, index) {
    //console.log(obj);
    listItemID = `${sportName}x_sportsListItemID`;
    $(".startSportsListID").append(`
    <button id="${listItemID}" class="alaNapitGrid w3-button w3-green"> ${sportName} </button>
    `);
    $(`#${listItemID}`).data("sportName",sportName);
    $(`#${listItemID}`).click(function() {
      //  console.log("click");
      let sportName = $(this).data("sportName");
      G_myTeam.currentSport = sportName;
      G_myTeam.status = "sportOn";
      setLocaleStorage();
      gameScreen();
    });
  });
}

//Pelin kulku, tallennus pilveen siirryttäessä seuraavaan väylään tai refreshattaessa sivu
function gameScreen() {
  $('#NavBtnHome').show();
  $('#NavBtnResults').show();
  $('#NavBtnJatka').hide();

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

  $(`#holeButtonPrev`).click(() => {
    (G_myTeam.currentHole > 1) && G_myTeam.currentHole--;
    $('#holeNrID').text(G_myTeam.currentHole);
    $('#parID').text(sport.parList[G_myTeam.currentHole - 1]);
    // Scoren päivitys
    Object.keys(sport.players).forEach(function(key, index) {
      let playerObj = sport.players[key];
      let scoreID = `score_${playerObj.name}`;
      $(`#${scoreID}`).text(playerObj.scoreList[G_myTeam.currentHole - 1]);
    });
    $('#finishSportButton').hide();
    setLocaleStorage();
  });

  $(`#holeButtonNext`).click(() => {
    (G_myTeam.currentHole < sport.parNr) && G_myTeam.currentHole++;
    $('#holeNrID').text(G_myTeam.currentHole);
    $('#parID').text(sport.parList[G_myTeam.currentHole - 1]);
    Object.keys(sport.players).forEach(function(key, index) {
      let playerObj = sport.players[key];
      let scoreID = `score_${playerObj.name}`;
      $(`#${scoreID}`).text(playerObj.scoreList[G_myTeam.currentHole - 1]);
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
    let totScore = player[sportName+"Score"];

    $(".gameGrid").append(`
    <div class="playerNameColumn-item gameGrid-item"> ${playerName}</div>
    <div class="removeSwing gameGrid-item">
      <button id="${removeBtn}" class="w3-btn w3-green plusMinuBtn"  > - </button> </div>
    <div id="${scoreID}" class="swingNr-item gameGrid-item"> ${score}  </div>
    <div class="addSwing-item gameGrid-item">
      <button id="${addBtn}" class="w3-btn w3-green plusMinuBtn"> + </button> </div>
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
        console.log("Scorelist of "+ sportPlayer.name + " aka "+player.name);
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

// Kokonaistilanne, lajikohtaiset tulokset, hakee muitten tulokset pilvestä
function showResultTable() {

  G_myTeam.status = "results";
  let tableObjectArr = []; //Alustus, Datavektori bootstrap tablelle
  let currentTableName = "Total";
  setLocaleStorage();
  $("#gameAppDiv").empty();

  // Ylärivin valintanapit (muuttuva grid jako)
  $("#gameAppDiv").append(`
    <div id="selectResultTableDiv" class="resTableSelGrid">
      <button id="totalResultsBtn" class="w3-button w3-green resTableSelGrid-item w3-small">Kokonaistilanne</button>
    </div>`);
  $(`#totalResultsBtn`).click(() => {
      showTable('Total');
    });
  const sportsKeys = Object.keys(G_game.sports);
  $(".resTableSelGrid").css("grid-template-columns", `repeat(${sportsKeys.length+1}, 1fr)`);
  for (const sport of sportsKeys) {
    $("#selectResultTableDiv").append(`<button class="w3-button w3-green resTableSelGrid-item w3-small" id = "totalResultsBtn_${sport}" >${sport}</button>`);
    $(`#totalResultsBtn_${sport}`).click(() => {
      showTable(sport);
      //console.log(sport);
    });
  }

  // pistetaulukko

  $("#gameAppDiv").append(`
    <table id="resultTable" class="table-sm table_condensed" data-sortable="true" ></table>`);

  // alanapit
  $("#gameAppDiv").append(`<div id="alaNapitDiv" class="alaNapitGrid"></div>`);
  $("#alaNapitDiv").append('<button id="updateBtn" class="w3-btn w3-green alaNapitGrid-item"> Päivitä </button>');
  $("#alaNapitDiv").append('<div class="alaNapitGrid-item"> </div>');
  $("#alaNapitDiv").append('<div class="alaNapitGrid-item"> </div>');
  $("#alaNapitDiv").append('<button id="backBtn" class="w3-btn w3-green alaNapitGrid-item"> Takasin </button>');
  $("#alaNapitDiv").append('<button id="continueBtn" class="w3-btn w3-green alaNapitGrid-item">Lopeta/Jatka</button>');

  $("#updateBtn").click( () => {
    //console.log("UPDATE");
    new Promise((resolve, reject) => updateGameDataFromCloud(resolve, reject))
    .then( () => updateRanking() )
    .then(()=>formTableData())
    .then(()=>showTable())
    .catch(console.log("Error in updateGameDataFromCloud() when Päivitysnappi was pushed"));
  });
  $("#backBtn").click( () => gameScreen());
  $("#continueBtn").click( () => {
    G_myTeam = new MyTeam;
    setLocaleStorage();
    //loadFirebaseInitialData();
    startScreen();
  });

  // Hae data pilvestä ja päitiä taulukko vasta sitten
  new Promise((resolve, reject) => updateGameDataFromCloud(resolve, reject))
  .then( () => updateRanking() )
  .then( () => formTableData() )
  .then( () => showTable() )
  .catch( () => console.log("Error in updateGameDataFromCloud when loading showResultTable()") );


  function updateRanking() {
    console.log("update ranking");
    // Lajisijoitukset => lajipisteet
    let sportNames = Object.keys(G_game.sports);
    let playersArr = [];
    let totalRanking = [];

    // PLayers to array
    Object.keys(G_game.players).forEach((playerName,ind,arr) => {
      playersArr.push(G_game.players[playerName]); //ARRAY OF REFS

    });
    console.log(G_game.players);
    // PLayer sport positions
    Object.keys(G_game.sports).forEach((sportName,ind,arr) => {

      //playersArr.sort(function(a, b) {
      //  return a[sportName+'Score'] - b[sportName+'Score'];
      //});

      //    let scoreArrays = [];
      let maxScore = Math.max.apply( Math, playersArr.map( obj => { return obj[sportName+'Score']}) );
      // Lajitellaan pelaajaobjektit scoren mukaisesti ryhmiin
      let scoreArrays = []; //Array of Arrays of Objects
      for (var i = 0; i <= maxScore+100; i++) {
        scoreArrays[i] = [];
      };
      playersArr.forEach( (player,ind) => {
        scoreArrays[player[sportName+'Score']+100].push(player);
      });
      // POISTA TYHJÄT
      scoreArrays = scoreArrays.filter( (el) => {
        return el.length > 0;
      });
      let nextPosition = 0;
      scoreArrays.forEach( (scoreArr,ind) => {
        scoreArr.forEach((player,index)=>{
          let pos = nextPosition;
          player[sportName+'Position'] = nextPosition +1;
          player.setPoints();
        })
        nextPosition += scoreArr.length; //0 0 1 1 0
      });
    });



    //  TOTAL POSITIONIN LASKENTA
    let pointsArrays = []; //Array of Arrays of Objects
    let maxPoints = Math.max.apply( Math, playersArr.map( obj => { return obj.pointsTot } ) );

    for (var i = 0; i <= maxPoints; i++) {
      pointsArrays[i] = [];
    };
    playersArr.forEach( (player,ind) => {
      pointsArrays[player.pointsTot].push(player);
    });
    pointsArrays = pointsArrays.filter( (el) => {
      return el.length > 0;
    });
    let nextPosition = 0;
    let index_reversed = 0;

    for (var i = pointsArrays.length-1; i >= 0 ; i--) {
      pointArr = pointsArrays[i];
      pointArr.forEach((player,index)=>{
        player.position = nextPosition + index_reversed + 1;
      })
      nextPosition = pointArr.length-1;
      index_reversed++;
    }
  }


  function formTableData() {
    console.log("formTableData()");
    tableObjectArr  = []; //Alustus, Data vektori bootstrap tablelle
    //let sportPlayers = G_game.sports[G_myTeam.currentSport].players; //REF
    let tableObject = new Object;
    let tableColumns = [];

    // Poimi pelaajadata
    Object.keys(G_game.players).forEach((playerName, index, array)=> {
      let tableObject = new Object;
      tableObject.name = playerName;
      tableObject.pointsTot = G_game.players[playerName].pointsTot;
      tableObject.position = G_game.players[playerName].position;

      // Poimi Tulosdata
      Object.keys(G_game.sports).forEach((sportName, ind2, arr2) => {
        tableObject[sportName] = {};
        tableObject[sportName+'Points'] = G_game.players[playerName][sportName+'Points'];
        tableObject[sportName+'Score'] = G_game.players[playerName][sportName+'Score'];
        tableObject[sportName+'Position'] = G_game.players[playerName][sportName+'Position'];
        //scorelist to object
        const sportScoreList = G_game.sports[sportName].players[playerName].scoreList;

      //  console.log(playerName);
      //  console.log(G_game.sports[sportName].players[playerName]);
        tableObject[sportName].scorelist = {};
        for (var i = 0; i < sportScoreList.length; i++) {
          tableObject[sportName].scorelist[i] = sportScoreList[i];
        }
      })
      tableObjectArr.push(tableObject);
      })
    // console.log('tableObjectArr');
    // console.log(tableObjectArr);
      return tableObjectArr;

    }

  function showTable(tableName=currentTableName) {
    console.log("showTable()");
    currentTableName = tableName;

    tableColumns = [];

    if (tableName == "Total") {
      tableColumns.push({field: 'position',title: '',sortable: true});
      tableColumns.push({field: 'name',title: 'Pelaaja'});
      tableColumns.push({field: 'pointsTot',title: 'Pts.'});
      // Laji scoret ja pisteet
      Object.keys(G_game.sports).forEach((sportName, index, array)=>{
        //console.log(sportName);
        tableColumns.push({field: `${sportName}Position` ,title: `${sportName} sij.`,sortable: true});
        //tableColumns.push({field: `${sportName}Score` ,title: `${sportName} +/-`,sortable: true});
        tableColumns.push({field: `${sportName}Points` ,title: `${sportName} p.`,sortable: true});
      });
    }
    else {
      // Yhden lajin scoret ja pisteet ja väylätulokset
      let sportName = tableName;
      tableColumns.push({field: `${sportName}Position` ,title: `${sportName} sij.`,sortable: true});
      tableColumns.push({field: 'name',title: 'Pelaaja'});
      tableColumns.push({field: sportName+'Points',title: 'p'});

      Object.keys(tableObjectArr[0][sportName].scorelist).forEach((element, index, array)=>{
        tableColumns.push({field: `${sportName}.scorelist.${index}` ,title: index+1});
      });
      tableColumns.push({field: sportName+'Score',title: '+/-',sortable: true});
    }

    //console.log("tableColumns:");
  //  console.log(tableColumns);
    $('#resultTable').bootstrapTable('destroy');
    $('#resultTable').bootstrapTable({
      columns: tableColumns,
      data: tableObjectArr
    })
  }

}

function settingsScreen() {
  console.log("Näytöllä: settingsScreen ");
  $('#NavBtnHome').show();
  $('#NavBtnSettings').hide();

  $("#gameAppDiv").empty();
  //Main elements
  $("#gameAppDiv").append(`
    <div class="w3-container>

    </div>
    `);
}
