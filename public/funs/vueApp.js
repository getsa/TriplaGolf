Vue.component('maxsettingCard',{
  template: '<li>This is a todo</li>'
})
//<p> Max. tulos yli paarin  <input v-model="TempGameSettings.maxOverPar" class="settingInput" type="number" value="gameSettings.maxOverPar"></input>( {{gameSettings.maxOverPar}})</p>

//<div class="OkButtonGrid settingsButtonGrid-item">
//  <button class="OkButtonGrid-item w3-btn w3-green" v-on:click="screenState='startScreen';gameSettings = TempGameSettings">Tallenna</button>
//  <button class="OkButtonGrid-item w3-btn w3-green"v-on:click="screenState='startScreen'" >Peruuta</button>
//</div>



// <button class="w3-btn w3-green alaNapitGrid-item" v-on:click="screenState='settingsScreen'"> Peliasetukset </button><p/>
// <nappi1 v-on:click="screenState='settingsScreen'"> Peliasetukset </nappi1>



//New game card
Vue.component( 'newgamecard', {
  name: 'newgamecard',
  props: ['prop'],
  template: `
    <div >
    <h1> Uusi peli</h1>
    </div>`,
})


// <div id="newGameCardDiv" v-if="screenState=='setNewGameScreen'">
//
// </div>
//
//   <div id="id01" class="w3-modal">
//     <div class="w3-modal-content">
//       <div class="w3-content">
//         <span onclick="document.getElementById('id01').style.display='block'" class="w3-btn w3-display-topright">&times;</span>
//           <p>Laji:</p><input id="newSportNameID" class="w3-input" type="text"> </input>
//           <p>Väylämäärä / Eriä: </p>
//           <input id="newSportParNrID" type="number" name="parNr" class="w3-input"> </input>
//           <div id="newSportParListID"></div>
//           <button id="inputNewSportOKBtn" class="w3-btn w3-green" > OK </button>
//           <button id="inputNewSportCancelBtn" class="w3-btn w3-green"> Peruuta </button>
//           <p/>
//       </div>
//     </div>
//   </div>
// </div>



Vue.component('settings', {
  name: 'settings',
  props:[],
  template: `
  		<div id="settingsScreenDiv" class="w3-container settingsButtonGrid" >
  			<h3> Pelikohtaiset asetukset ja yleiset erikseen?</h3>
        <button class="settingsButtonGrid-item w3-btn w3-green w3-border" v-on:click="logthis" > Pistejako </button>
  			<button class="settingsButtonGrid-item w3-btn w3-green w3-border"> Maksimilyönnit </button>
        <button class="settingsButtonGrid-item w3-btn w3-green w3-border"> muu asetus.. </button>
  			<div class="settingsButtonGrid-item"></div>
  			<div class="settingsButtonGrid-item">
  				<button class="OkButtonGrid-item w3-btn w3-green"  v-on:click="screenState='startScreen'">Takaisin</button>
  			</div>
  			<div class='w3-bottom'>
  				<button class=" w3-btn w3-red" v-on:click="toggleSignIn;screenState='loginScreen'"> Logout </button>
  			</div>
  		</div>
      `,
    methods: {
      logthis: function() {
        logthis
      },
      toggleSignIn: function() {
          if (!firebase.auth().currentUser) {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            firebase.auth().signInWithRedirect(provider);
          } else {
            firebase.auth().signOut();
          }
      }
    }
})


const vueApp = new Vue({
  el: '#vueApp',
  component: ['settings', 'newgamecard'],
  data: {
   loginState: 'logging in',
   screenState: 'loginScreen',
   gameState: 'empty',
   MainTitle: 'TriplaGolf App',
   gameSettings: {maxOverPar:7, points:[5, 4, 3, 2, 1]},
   TempGameSettings: {maxOverPar:7},
   game: new Game("empty"),  //Yksi ladattu peli, päivitys pilveen/pilvestä
   database: new Database, //Kaikki data kaikista peleistä ja pelaajista
   myTeam: new MyTeam //Pidetään kirjaa ketä on tässä pelissä mukana (vektori pelaajien nimistä)

  },
 	methods: {
    toggleSignIn: function() {
        if (!firebase.auth().currentUser) {
          var provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/plus.login');
          firebase.auth().signInWithRedirect(provider);
        } else {
          firebase.auth().signOut();
        }
    },
    logthis: function() {
      console.log("LOGGED!");
    }
  },
  created: function(){
    console.log('vue created');
  },
  mounted: function(){
    console.log('mounted');
  }
 })
