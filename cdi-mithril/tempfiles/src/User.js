import {
    render_user_page,
    render_login_page,
    render_register_page,
    render_reseteaza_parola_page,
    render_update_profile_page
} from "./UserPages.js"



import {
    handle_main_links
} from "./Links.js"


import toast from "./Toast.js"


// const auth = firebase.auth()
// const db = firebase.firestore()
// const storage = firebase.storage()


function keys_have_values(data){
    return Object.keys(data).every((k) => data[k].trim())
}


function check_form(form_data) {
    if (!(form_data.pass1 === form_data.pass2)) {
        throw "Parolele nu sunt la fel!"
    }

    if (form_data.pass1.length < 6) {
        throw "Parola trebuie sa aiba cel putin 6 caractere!"
    }

    if (!keys_have_values(form_data)) {
        throw "Toate campurile trebuie completate!"
    }
}


function show_errors(error) {

    if (error == "Parolele nu sunt la fel!") {
        toast("Parolele nu sunt la fel!", false, 5000)
    }
    else if (error.includes("cel putin 6 caractere!")) {
        toast("Parola trebuie sa aiba cel putin 6 caractere!", false, 5000)
    }
    else if (error == "Toate campurile trebuie completate!"){
        toast("Toate campurile trebuie completate!", false, 5000)
    }
    else if (error.message.includes("Try again later.")) {
        toast("Serviciu indisponibil, incearca mai tarziu.", false, 5000)
    }
    else if (error.message.includes("in use")) {
        toast("Emailul este in folosit! Ti-ai uitat parola?", false, 5000)
    }
    else {
        toast("Ceva nu e in regula..", false, 5000)
    }

}
 

async function creaaza_un_cont(form_data) {

    console.log(form_data)

    try {
        check_form(form_data)
        await firebase.auth().createUserWithEmailAndPassword(form_data.email, form_data.pass1)
        toast("Verifica adresa de email pentru validarea contului!")
    } 
    catch (error) {

        console.error(error)
        show_errors(error)

        render_register_page()
        handle_main_links()
    }

}


function login(form_data) {
    console.log(form_data)
}


function reset_password(form_data) {
    console.log(form_data)
}


function update_profile(form_data) {
    console.log(form_data)
}


 export {
    creaaza_un_cont,
    login,
    reset_password,
    update_profile
}