import * as firebase from "firebase";

var config = {
    apiKey: "AIzaSyBpRx6xmkuu9CuQS8qCV2ITMs9v9ll27RQ",
    authDomain: "task-monitor101.firebaseapp.com",
    databaseURL: "https://task-monitor101.firebaseio.com",
    projectId: "task-monitor101",
    storageBucket: "task-monitor101.appspot.com",
    messagingSenderId: "809895032505"
};

firebase.initializeApp(config);


export const databaseRef = firebase.database().ref('/tasks'); 