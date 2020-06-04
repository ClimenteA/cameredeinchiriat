import {
    toast,
    name_from_email,
    authBtn,
    render_template,
    wait_form_submit,
    el
} from "./Utils.js"

import templates from "./Templates.js"

export default class Auth {

    listen() {
        //console.info("Listening auth..")
        this.monitor_auth()
        this.user_state()
    }

    monitor_auth() {
        this.login()
        this.logout()
        this.register()
        this.reset_password()
        this.update_account()
        this.delete_account()
    }

    user_state() {
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                authBtn.innerText = name_from_email(user.email)
            } else {
                authBtn.innerText = "INTRA DIN CONT"
            }
        })
    }

    login() {
        authBtn.addEventListener("click", event => {
            event.preventDefault()
            if (authBtn.innerText == "INTRA DIN CONT"){
                render_template(templates.login)
                wait_form_submit().then((form_data) => {
                    firebase.auth().signInWithEmailAndPassword(form_data["email"], form_data["pass"])
                    .then(data => {
                        console.info("Esti logat!") 
                        this.user_state()
                        templates.pagina_utilizator()
                    }).catch(error => {
                        console.error(error.message)
                        toast("Email sau parola gresite! Ti-ai uitat parola? Ai cont?", "error")
                        render_template(templates.login)
                    })
                })
            } else {
                templates.pagina_utilizator()
            }
        })
    }

    logout() {
        if (el("#logout")) {
            el("#logout").addEventListener("click", event => {
                console.info("Trying to logout.")
                event.preventDefault()
                firebase.auth().signOut().then(() => {
                    this.user_state()
                    render_template("<h1>Da click pe 'INTRA IN CONT' pentru a te loga.</h1>")
                }).catch((error) => {
                    console.error(error.message)
                    toast("Delogare nereusita!", "error")
                })
            })
        }
    }

    register() {
        if(el("#create_account")) {
            el("#create_account").addEventListener("click", event => {
                event.preventDefault()
                render_template(templates.register)
                wait_form_submit().then((form_data) => {
                    if (form_data["pass"] == form_data["pass1"]) {
                        firebase.auth().createUserWithEmailAndPassword(form_data["email"], form_data["pass"])
                        .then(data => {
                            firebase.auth().currentUser.sendEmailVerification().then(_ => {
                                toast("Ti-am trimis un email de verificare cont!", "success")
                                render_template("<h1>Acceseaza linkul trimis pentru a putea posta anunturi.</h1>")
                                //Add default display name and phone number
                                firebase.auth().currentUser.updateProfile({
                                    displayName: name_from_email(form_data["email"]) + '|' + 'Nespecificat',
                                })
                            }).catch(error => {
                                console.error(error.message)
                                toast("Nu am putut trimite emailul de verificare", "error")
                                this.register()
                            })
                        }).catch(error => {
                            console.error(error.message)
                            this.register()
                            if (error.message.includes("at least 6 characters")){
                                toast("Parola trebuie sa aiba cel putin 6 caractere!", "error")
                            }else {
                                toast("Date introduse incorecte sau emailul este inregistrat!", "error")
                            }
                        })
                    }
                    else {
                        toast("Parolele nu sunt la fel!", "error")
                        this.register()
                    }
                })
            })            
        }
    }

    reset_password() {
        if(el("#reset_password")){
            el("#reset_password").addEventListener("click", event => {
                event.preventDefault()
                render_template(templates.reset_password)   
                wait_form_submit().then((form_data) => {
                    firebase.auth().sendPasswordResetEmail(form_data["email"])
                    .then(data => {
                        toast("Email de resetare parola trimis!", "success")
                        render_template("<h1>Acceseaza linkul trimis prin email pentru a reseta parola.</h1>")
                      })
                      .catch(error => {
                        console.error(error.message)
                        toast("Email de resetare nu a putut fi trimis!", "error")
                      })
                })
            })
        }
    }

    update_account() {
        if(el("#update_account")) {
            el("#update_account").addEventListener("click", event => {
                event.preventDefault()
                render_template(templates.update_account)
                wait_form_submit().then((form_data) => {

                    let storageRef = firebase.storage().ref()
                    let path = `/userImage/${firebase.auth().currentUser.uid}/${form_data["photoURL"].name}`

                
                    storageRef.child(path)
                    .put(form_data["photoURL"]).then( snapshot => {
                        snapshot.ref.getDownloadURL().then( url => {
                            firebase.auth().currentUser.updateProfile({
                                displayName: form_data['displayName'] + '|' + form_data['phoneNumber'],
                                photoURL: url
                            })
                            .then(_ => {
                                toast("Datele au fost actualizate!", "success")
                                render_template("<h1>Da click in dreapta sus pe numele tau.</h1>")
                            })
                        }).catch(error => {
                            console.log(error.message)
                            toast("Datele nu au putut fi actualizate!", "error")
                        })
                    })    
                })
            })
        }
    }
    
    delete_account() {
        if(el("#delete_account")){
            el("#delete_account").addEventListener("click", event => {
                event.preventDefault()
                firebase.auth().currentUser.delete().then( _ => {
                    toast("Cont sters!", "success")
                    render_template("<h1>Contul tau a fost sters.</h1>")
                }).catch( error => {
                    console.log(error.message)
                    toast("Trebuie o autentificare recenta!<br>Iesi din cont apoi intra din nou si repeta operatia.", "error") 
                })
            })
        }
    }
}

