
// function messageListener() {
//   //console.log("Message listener activated!");
//   mesRef.onSnapshot(function(snapshot) {
//     //console.log("MessageData muuttunut pilvessä!");
//     loadMessage()
//     //var source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
//     //console.log(source, " data: ", snapshot.data());
//
//   });
// }
//
// function loadMessage() {
//   //console.log("loadMessage()...");
//   mesRef.get().then(function (doc) {
//     if (doc && doc.exists) {
//       const myData = doc.data();
//       G_messages = myData.messages;
//       rollMessages();
//     }
//   })
//   .catch(function (error) {
//     console.log("Got an error: ", error);
//   });
// }
//
// function saveMessage() {
//   //console.log("saveMessage()...");
//   mesRef.set({
//     messages: G_messages
//   }).then(function() {
//   }).catch(function (error) {
//     console.log("Got an error: ", error);
//   });
// }
//
// function rollMessages() {
//   //G_messages;
//   for (var i = 0; i < G_messages.length; i++) {
//     eval("document.getElementById(('imes'+"+i+")).style.display='block';");
//     eval("document.getElementById(('imes'+"+i+")).innerHTML=G_messages["+i+"];");
//   }
// }
 
