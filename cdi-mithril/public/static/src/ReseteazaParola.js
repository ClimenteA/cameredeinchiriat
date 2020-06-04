import {
    toast,
    freeze_form,
    unfreeze_form
} from "./Utils.js"


async function reseteaza_cont(event) {
    event.preventDefault()
    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)
    console.log(form_data)

    try {

        freeze_form(event.target)
        await firebase.auth().sendPasswordResetEmail(form_data.email)
        toast("Ti-am trimis un email de resetare parola!")  
        unfreeze_form()
        m.route.set("/home")      
        
    } catch (error) {
        unfreeze_form()
        // console.error(error)
        toast("Ceva s-a intamplat..incearca mai tarziu.", false, 8000)
    }
}


const ReseteazaParola = {
    view: () => {
        return m("form", {onsubmit: ev => {reseteaza_cont(ev)}}, [
            m(".input", [
                m("label", {for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),
            m("button", {type:"submit", class:"btn dark-green"}, "Reseteaza parola")
        ])
    }
}


export default ReseteazaParola