import * as firebase from 'firebase/app'

// order important
require('firebase/auth')
require('firebase/firestore')

// initialize firebase
if (firebase && firebase.initializeApp) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD0wuHFVnF7W2B5uPunzittKP4IXwbeROo',
    authDomain: 'orbit-motion-dev.firebaseapp.com',
    databaseURL: 'https://orbit-motion-dev.firebaseio.com',
    projectId: 'orbit-motion-dev',
    storageBucket: 'orbit-motion-dev.appspot.com',
    messagingSenderId: '790826289951',
  })
}
