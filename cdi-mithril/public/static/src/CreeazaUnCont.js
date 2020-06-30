import { close_menu } from "./NavFooter.js"
import {
    toast,
    freeze_form,
    unfreeze_form,
    name_from_email
} from "./Utils.js"


function check_form(form_data){

    if (form_data.pass1 !== form_data.pass2) {
        throw "Parolele nu sunt identice!"
    }
    else if (form_data.pass1.length < 6) {
        throw "Parola trebuie sa fie mai mare de 6 caractere!"
    } 
}


async function creeaza_cont(event){
    event.preventDefault()

    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)
    // console.log(form_data)

    freeze_form(event.target)

    try {

        check_form(form_data)
        // Add firebase
        let email = form_data.email
        let password = form_data.pass1
        
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        await firebase.auth().signInWithEmailAndPassword(email, password)
        await firebase.auth().currentUser.sendEmailVerification()

        toast("Verifica emailul pentru a valida contul!", true, 6000)

        await firebase.firestore().collection('user').add({
            nume: name_from_email(email),
            buget: 100,
            localitate: "Oriunde",
            telefon: "",
            email: email,
            foto: ""
        })

        unfreeze_form(event.target)
        m.route.set("/cont-utilizator")
        
    } 
    catch (error) {

        console.error(error)

        unfreeze_form(event.target)

        if (typeof(error) === typeof("string")){
            toast(error, false, 8000)
        }
        else {
            if (error.message.includes("already in use")) {
                toast("Emailul este folosit. Ti-ai uitat parola!", false, 8000)
            }
            else {
                toast(error.message, false, 8000)
            }
            
        }
    }     
}


function prep(){
    document.body.className = "light-purple blocuri"
    document.querySelector("main").className = "center"
    document.querySelector("title").innerText = "Creeaza un cont"
    close_menu()
}


const CreeazaUnCont = {
    oninit: async () => {
        if (await firebase.auth().currentUser){
            return m.route.set("/cont-utilizator")
        }
    },
    oncreate: prep,
    view: () => {

        return m("form", {onsubmit: ev => {creeaza_cont(ev)}}, [
            m(".input", [
                m("label", {for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),
    
            m(".input", [
                m("label", {for:"pass1"}, "Parola"),
                m("input", {type:"password", name:"pass1", id:"pass1", required:"required"})
            ]),
    
            m(".input", [
                m("label", {for:"pass2"}, "Confirma parola"),
                m("input", {type:"password", name:"pass2", id:"pass2", required:"required"})
            ]),
    
            m("button", {type:"submit", class:"btn dark-green"}, "Creaaza cont"),
    
            m(".helpers", [
                m("a", {href:"#!/intra-in-cont"}, "Am cont!"),
                m("a", {href:"#!/reseteaza-parola"}, "Am uitat parola!")
            ])
    
        ])            
    }
}


export default CreeazaUnCont