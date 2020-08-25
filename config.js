import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyARQthnMEzNY__cMazpIY4m9eigTNs7fEA",
    authDomain: "wily-eb804.firebaseapp.com",
    databaseURL: "https://wily-eb804.firebaseio.com",
    projectId: "wily-eb804",
    storageBucket: "wily-eb804.appspot.com",
    messagingSenderId: "600929637137",
    appId: "1:600929637137:web:0156760061324ad404f2b0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()