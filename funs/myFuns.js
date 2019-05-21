 
//function database
function Database() {
	this.players = [];
	this.sports = [];
	this.games = [];
}

// Game constructor
function Game(name) {
	this.name = name;
	this.sports = {};
	this.players = {};
	this.teamCount = 0;
	this.playerCount = 0;
	this.status = 'empty'; // '','laji1.name','laji2.name',...'finished'
	this.groups = {};

	this.calcPlayers = function() {return Object.keys(this.players).length}

}

// Player constructor
function Player(name) {
	this.name = name;
	this.pointsTot = 0;
	this.position = 0;

	this.addSportPoints = function(sportName) {
		this[sportName + 'Points'] = 0;
		this[sportName + 'Score'] = 0;
		this[sportName + 'Position'] = 0;
	}
	this.addSportResults = function(sportObj) {
		this.scoreList = [...sportObj.parList];
	}
	this.setPoints = function() {
		this.pointsTot = 0;
		Object.keys(G_game.sports).forEach((sportName,ind,arr)=>{
			if(this[sportName + 'Position'] > G_points.length) {
				this[sportName + 'Points'] = G_points[G_points.length-1];
				this.pointsTot +=  this[sportName + 'Points'];
			}
			else {
				this[sportName + 'Points'] = G_points[this[sportName + 'Position']];
				this.pointsTot +=  this[sportName + 'Points'];
			}

		}, this) // HUOM! Thissin käyttö

	}
}

function MyTeam() {
	this.players = [];
	this.status = "empty";
	this.currentHole = 1;
	this.gameName = "empty";
	this.currentSport = "empty";
}

function Sport(sportName,parNr=0,parList=[0]){
	this.name = sportName;
	this.parNr = parNr;
	this.parList = parList;
	this.maxScore = parList.map(x => x + 10);
	this.players = {};
	this.totalPar = [...parList].reduce( (a,b) => a+b ,0);
};


function singleGame() {
	this.name = '';
	this.gameStatus = 0;
	this.parlist = [];
	this.ihanne = [];
}



function setParLists(laji_tmp) {
	var parNtmp = window.prompt(laji_tmp+' Väylien määrä: ','')

  var tempList = [];
  for (var i = 0; i < parNtmp; i++) {
    var parTmp = window.prompt(laji_tmp+' Väylä '+(i+1)+' par: ','')
    tempList.push(Number(parTmp));
  }
  switch (laji_tmp) {
    case 'Golf': parListG = [];parListG=tempList; break;
    case 'DiscGolf': parListDG = [];parListDG=tempList; break;
    case 'MiniGolf': parListMG = [];parListMG=tempList; break;
  }
//Tähän pelaajien pisteiden päivitys

}
