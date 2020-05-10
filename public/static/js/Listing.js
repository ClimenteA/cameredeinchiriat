import {
    toast,
    render_template,
    wait_form_submit,
    el
} from "./Utils.js"

import templates from "./Templates.js"



export default class Listing {

    listen() {
        this.add_listing()
        this.show_listings()
    }

    add_listing() {
        el("#adauga_camera").addEventListener("click", event => {
            event.preventDefault()
            //This is checked on the backend also
            if (firebase.auth().currentUser != null) {
                render_template(templates.add_listing)
                wait_form_submit().then((form_data) => {

                    let foto = form_data["foto"]
                    delete form_data["foto"]
                    form_data["Pret"] = Number(form_data["Pret"].trim())

                    firebase.firestore().collection('listing').add(form_data)
                    .then( docRef => {
                       
                        let storageRef = firebase.storage().ref()
                        let path = `/listingImage/${docRef.id}/${foto.name}`

                        storageRef.child(path).put(foto)
                        .then( snapshot => {
                            snapshot.ref.getDownloadURL()
                            .then( url => {
                            
                                firebase.firestore().collection("listing").doc(docRef.id)
                                .update({
                                    Foto: url,
                                    UserId: firebase.auth().currentUser.uid,
                                    DateAdded: firebase.firestore.FieldValue.serverTimestamp()
                                }).catch(error => {
                                   console.error("Update failed: ", error) 
                                   toast("Fotografia nu a putut fi urcata!", "error")
                                   firebase.firestore().collection("listing").doc(docRef.id).delete()
                                })

                                toast("Anuntul a fost adaugat!", "success")
                                render_template("<h1>Super! Anuntul tau a fost adaugat!</h1>")

                            }).catch( error => {
                                console.error("Storage2: ", error)
                                toast("Fotografia nu a putut fi adaugata!", "error")
                                firebase.firestore().collection("listing").doc(docRef.id).delete()
                            })
                        }).catch( error => {
                            console.error("Storage1: ", error)
                            toast("Fotografia nu a putut fi adaugata!", "error")
                            firebase.firestore().collection("listing").doc(docRef.id).delete()
                        })

                    }).catch( error => {
                        console.error("Firestore: ", error)
                        toast("Anuntul nu a putut fi adaugat!", "error")
                        firebase.firestore().collection("listing").doc(docRef.id).delete()
                    })

                })  
            }
            else {
                toast("Intra in cont pentru a putea posta un anunt!", "error")
            }
        })
    }

    show_listings() {
        el("#home").addEventListener("click", event => {
            event.preventDefault()
            firebase.firestore().collection("listing").get().then( querySnapshot => {
                render_template(templates.search_listing(querySnapshot))
            })
        })
    }


    user_listings() {
        
        let snap_anunturi = {}

        firebase.firestore().collection("listing")
        .where("UserId", "==", firebase.auth().currentUser.uid)
        .get()
        .then( querySnapshot => {
            snap_anunturi = querySnapshot
            //return querySnapshot
        })
        .catch(error => {
            console.error(error)
            //toast("", "error")
        })

        return snap_anunturi
    }

    delete_listing() {

    }

}

