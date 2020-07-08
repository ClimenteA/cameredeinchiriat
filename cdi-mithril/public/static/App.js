
// Components
// Minify bundle with rollup.js
// https://rollupjs.org/guide/en/
// rollup App.js --file bundle.js --format iife
// rollup App.js --file bundle.js --compact --format iife
// https://www.npmjs.com/package/idb-keyval


// TODO mithril example
// https://tinyurl.com/yavo4lv7

// Update a doc by field value
// https://stackoverflow.com/questions/49682327/how-to-update-a-single-firebase-firestore-document/49682615

// https://awesomeopensource.com/project/orbitbot/awesome-mithril


import {
    Nav, 
    Footer
} from "./src/NavFooter.js"

import Home from "./src/Home.js"
import AdaugaCamera from "./src/AdaugaCamera.js"
import IntraInCont from "./src/IntraInCont.js"
import Listings from "./src/VeziAnunturi.js"
import IesiDinCont from "./src/IesiDinCont.js"
import PoliticaCookies from "./src/PoliticaCookies.js"
import PoliticaDeConfidentialitate from "./src/PoliticaDeConfidentialitate.js"
import TermeniSiConditii from "./src/TermeniSiConditii.js"
import RaporteazaProblema from "./src/RaporteazaProblema.js"
import Contact from "./src/Contact.js"
import CreeazaUnCont from "./src/CreeazaUnCont.js"
import ReseteazaParola from "./src/ReseteazaParola.js"
import {ContUtilizator} from "./src/ContUtilizator.js"
import DetaliiCamera from "./src/DetaliiCamera.js"
import ActualizeazaCont from "./src/ActualizeazaCont.js"
import Error404 from "./src/404.js"


// Initialize firebase
if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
var firebaseConfig = {
  "projectId": "cameredeinchiriat-b7885",
  "appId": "1:841749487216:web:602b8e01ac6561aad4deb5",
  "databaseURL": "https://cameredeinchiriat-b7885.firebaseio.com",
  "storageBucket": "cameredeinchiriat-b7885.appspot.com",
  "locationId": "europe-west6",
  "apiKey": "AIzaSyA4oEHfBeM_8mmYXDiaao01eIHkdfmuIr0",
  "authDomain": "cameredeinchiriat-b7885.firebaseapp.com",
  "messagingSenderId": "841749487216",
  "measurementId": "G-2961KQZJFR"
};
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
}




const header = document.querySelector("header") 
const main = document.querySelector("main")
const footer = document.querySelector("footer")


// Static components
m.render(header, m(Nav))
m.render(footer, m(Footer))


// Main contect changed based on route
m.route(main, "/", {
    "/": Home,
    "/intra-in-cont": IntraInCont,
    "/intra-in-cont/:adauga_camera": IntraInCont,
    "/adauga-camera": AdaugaCamera,
    "/vezi-anunturi": Listings,
    "/iesi-din-cont": IesiDinCont,
    "/politica-cookies": PoliticaCookies,
    "/politica-de-confidentialitate": PoliticaDeConfidentialitate,
    "/termeni-si-conditii": TermeniSiConditii,
    "/raporteaza-problema": RaporteazaProblema,
    "/contact": Contact,
    "/creeaza-un-cont": CreeazaUnCont, 
    "/reseteaza-parola": ReseteazaParola, 
    "/cont-utilizator": ContUtilizator,
    "/actualizeaza-cont": ActualizeazaCont,
  
    "/:404...": Error404

})

