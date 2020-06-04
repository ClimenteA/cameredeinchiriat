import { close_menu } from "./NavFooter.js"
import {
    toast,
    freeze_form,
    unfreeze_form
} from "./Utils.js"


async function intra_in_cont(event, vnode){
    event.preventDefault()

    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)
    // console.log(form_data)

    freeze_form(event.target)

    try {

        await firebase.auth().signInWithEmailAndPassword(form_data.email, form_data.pass1)
        
        if (vnode.attrs.adauga_camera){
            m.route.set("/adauga-camera")
        } else {
            m.route.set("/cont-utilizator")
        }
        
    } 
    catch (error) {

        if ("message" in error){
            if (error.message.includes("password is invalid")){
                toast("Emailul sau parola gresite!", false, 8000)
            }
            else if (error.message.includes("no user record")) {
                toast("Emailul nu este in baza de date! Ai cont?", false, 8000)
            }
            else {
                toast(error.message, false, 8000)
            }   
        }
        else {
            toast(error, false, 5000)
        }
        
        unfreeze_form(event.target)
    }
    
}


function prep(){
    document.body.className = "light-purple blocuri"
    document.querySelector("main").className = "center"
    document.querySelector("title").innerText = "Intra in cont"
    close_menu()
}



const IntraInCont = {
    oninit: async () => {
        if (await firebase.auth().currentUser) {
            return m.route.set("/cont-utilizator")
        }
    },
    oncreate: prep,
    view: vnode => {
        return m("form", {onsubmit: ev => {intra_in_cont(ev, vnode)}}, [
            m(".input", [
                m("label", {for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),

            m(".input", [
                m("label", {for:"pass1"}, "Parola"),
                m("input", {type:"password", name:"pass1", id:"pass1", required:"required"})
            ]),

            m("button", {type:"submit", class:"btn dark-green"}, "Intra in cont"),

            m(".helpers", [
                m("a", {href:"#!/creeaza-un-cont"}, "Nu am cont!"),
                m("a", {href:"#!/reseteaza-parola"}, "Am uitat parola!")
            ])
        ])
    }
}



export default IntraInCont
