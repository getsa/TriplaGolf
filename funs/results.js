// Kokonaistilanne, lajikohtaiset tulokset, hakee muitten tulokset pilvestä
function showResultTable() {
  G_myTeam.players.length > 0 ? $('#NavBtnJatka').show() : $('#NavBtnJatka').hide();
  G_myTeam.status = "results";
  let tableObjectArr = []; //Datavektori bootstrap tablelle
  let currentTableName = "Total";
  setLocaleStorage();
  $("#gameAppDiv").empty();

  // Ylärivin valintanapit (muuttuva grid jako lajien määrän mukaan)
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
    });
  }

  // pistetaulukko
  $("#gameAppDiv").append(`
    <table id="resultTable" class="table-sm table_condensed" data-sortable="true" data-sort-name="position" ></table>`);

  // alanapit
  $("#gameAppDiv").append(`
    <div id="alaNapitDiv" class="alaNapitGrid">
      <button id="updateBtn" class="w3-btn w3-green alaNapitGrid-item"> Päivitä </button>
      <div class="alaNapitGrid-item"> </div>
      <div class="alaNapitGrid-item"> </div>
      <button id="backBtn" class="w3-btn w3-green alaNapitGrid-item"> Takasin </button>
      <button id="continueBtn" class="w3-btn w3-green alaNapitGrid-item">Lopeta ${G_myTeam.currentSport}</button>
    </div>`);

  $("#updateBtn").click(() => {
    //console.log("UPDATE");
    new Promise((resolve, reject) => updateGameDataFromCloud(resolve, reject))
      .then(() => updateRanking())
      .then(() => formTableData())
      .then(() => showTable())
      .catch(console.log("Error in updateGameDataFromCloud() when Päivitysnappi was pushed"));
  });

//  console.log(G_myTeam.players.length > 0);

  if (G_myTeam.players.length == 0) {
    $("#backBtn").hide();
    $("#continueBtn").hide();
  }
  else {
    $("#backBtn").click(() => gameScreen());
    $("#continueBtn").click(() => {
      console.log();
      G_game.sports[G_myTeam.currentSport].status = "finished";
      G_myTeam = new MyTeam;
      setLocaleStorage();
      //loadFirebaseInitialData();
      G_database = new Database;
      loadFirebaseInitialData()
      //startScreen();
    });
  }


  // Hae data pilvestä ja päitiä taulukko vasta sitten
  new Promise((resolve, reject) => updateGameDataFromCloud(resolve, reject))
    .then(() => updateRanking())
    .then(() => formTableData())
    .then(() => showTable())
    .catch(() => console.log("Error in updateGameDataFromCloud when loading showResultTable()"));


  function updateRanking() {
    console.log("updating ranking...");
    // Lajisijoitukset => lajipisteet
    let sportNames = Object.keys(G_game.sports);
    let playersArr = [];
    let totalRanking = [];

    // PLayers to array
    Object.keys(G_game.players).forEach((playerName, ind, arr) => {
      playersArr.push(G_game.players[playerName]); //ARRAY OF REFS

    });
  //  console.log(G_game.players);
    // PLayer sport positions
    Object.keys(G_game.sports).forEach((sportName, ind, arr) => {

      //playersArr.sort(function(a, b) {
      //  return a[sportName+'Score'] - b[sportName+'Score'];
      //});

      //    let scoreArrays = [];
      let maxScore = Math.max.apply(Math, playersArr.map(obj => {
        return obj[sportName + 'Score']
      }));
      // Lajitellaan pelaajaobjektit scoren mukaisesti ryhmiin
      let scoreArrays = []; //Array of Arrays of Objects
      for (var i = 0; i <= maxScore + 100; i++) {
        scoreArrays[i] = [];
      };
      playersArr.forEach((player, ind) => {
        scoreArrays[player[sportName + 'Score'] + 100].push(player);
      });
      // POISTA TYHJÄT
      scoreArrays = scoreArrays.filter((el) => {
        return el.length > 0;
      });
      let nextPosition = 0;
      scoreArrays.forEach((scoreArr, ind) => {
        scoreArr.forEach((player, index) => {
          let pos = nextPosition;
          player[sportName + 'Position'] = nextPosition + 1;
          player.setPoints();
        })
        nextPosition += scoreArr.length; //0 0 1 1 0
      });
    });



    //  TOTAL POSITIONIN LASKENTA
    let pointsArrays = []; //Array of Arrays of Objects
    let maxPoints = Math.max.apply(Math, playersArr.map(obj => {
      return obj.pointsTot
    }));

    for (var i = 0; i <= maxPoints; i++) {
      pointsArrays[i] = [];
    };
    playersArr.forEach((player, ind) => {
      pointsArrays[player.pointsTot].push(player);
    });
    pointsArrays = pointsArrays.filter((el) => {
      return el.length > 0;
    });
    let nextPosition = 0;
    let index_reversed = 0;

    for (var i = pointsArrays.length - 1; i >= 0; i--) {
      pointArr = pointsArrays[i];
      pointArr.forEach((player, index) => {
        player.position = nextPosition + index_reversed + 1;
      })
      nextPosition = pointArr.length - 1;
      index_reversed++;
    }
  }


  function formTableData() {
    console.log("formTableData()");
    tableObjectArr = []; //Alustus, Data vektori bootstrap tablelle
    //let sportPlayers = G_game.sports[G_myTeam.currentSport].players; //REF
    let tableObject = new Object;
    let tableColumns = [];

    // Poimi pelaajadata
    Object.keys(G_game.players).forEach((playerName, index, array) => {
      let tableObject = new Object;
      tableObject.name = playerName;
      tableObject.pointsTot = G_game.players[playerName].pointsTot;
      tableObject.position = G_game.players[playerName].position;

      // Poimi Tulosdata
      Object.keys(G_game.sports).forEach((sportName, ind2, arr2) => {
        tableObject[sportName] = {};
        // Aseta viivat pisteiden tilalle jos lajia ei ole aloitettu

        console.log("G_game.sports["+sportName+"].status: " + G_game.sports[sportName].status);

        //Korjaa?
        if  (G_game.sports[sportName].status == "notStarted") {
          tableObject[sportName + 'Points'] = "-";
          tableObject[sportName + 'Score'] = "-";
          tableObject[sportName + 'Position'] = "-";
        }
        else {
          tableObject[sportName + 'Points'] = G_game.players[playerName][sportName + 'Points'];
          tableObject[sportName + 'Score'] = G_game.players[playerName][sportName + 'Score'];
          tableObject[sportName + 'Position'] = G_game.players[playerName][sportName + 'Position'];
        }
        //scorelist to object
        const sportScoreList = G_game.sports[sportName].players[playerName].scoreList;

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

  function showTable(tableName = currentTableName) {
    console.log("showTable()");
    currentTableName = tableName;

    tableColumns = [];

    if (tableName == "Total") {
      tableColumns.push({
        field: 'position',
        title: '',
        sortable: true
      });
      tableColumns.push({
        field: 'name',
        title: 'Pelaaja'
      });
      tableColumns.push({
        field: 'pointsTot',
        title: 'Pts.'
      });
      // Laji scoret ja pisteet
      Object.keys(G_game.sports).forEach((sportName, index, array) => {
        //console.log(sportName);
        tableColumns.push({
          field: `${sportName}Position`,
          title: `${sportName} sij.`,
          sortable: true
        });
        //tableColumns.push({field: `${sportName}Score` ,title: `${sportName} +/-`,sortable: true});
        tableColumns.push({
          field: `${sportName}Points`,
          title: `${sportName} p.`,
          sortable: true
        });
      });
    } else {
      // Yhden lajin scoret ja pisteet ja väylätulokset
      let sportName = tableName;
      tableColumns.push({
        field: `${sportName}Position`,
        title: `${sportName} sij.`,
        sortable: true
      });
      tableColumns.push({
        field: 'name',
        title: 'Pelaaja'
      });
      tableColumns.push({
        field: sportName + 'Points',
        title: 'p'
      });

      Object.keys(tableObjectArr[0][sportName].scorelist).forEach((element, index, array) => {
        tableColumns.push({
          field: `${sportName}.scorelist.${index}`,
          title: index + 1
        });
      });
      tableColumns.push({
        field: sportName + 'Score',
        title: '+/-',
        sortable: true
      });
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
