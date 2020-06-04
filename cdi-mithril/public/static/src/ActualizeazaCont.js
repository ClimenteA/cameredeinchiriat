import { close_menu } from "./NavFooter.js"
import { toast, freeze_form, unfreeze_form } from "./Utils.js"


function prep(){
    document.body.className = "light-purple blocuri"
    document.querySelector("main").removeAttribute("class")
    document.querySelector("title").innerText = "Actualizeaza cont"
    close_menu()
}


async function sterge_contul() {

    try {

        await firebase.auth().currentUser.delete()
        toast("Contul tau a fost sters!")
        m.route.set("/")

    } catch (error) {
        await firebase.auth().signOut()
        toast("Operatie nereusita! Intra in cont si incearca din nou..", false, 8000)
        m.route.set("/intra-in-cont")
    }

}

async function actualizeaza_cont(event){

    event.preventDefault()

    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)
    
    console.log(form_data)

    try {

        freeze_form(event.target)

        let storageRef = await firebase.storage().ref()
        let path = `/userImage/${firebase.auth().currentUser.uid}/${form_data.foto.name}`
        let snapshot = await storageRef.child(path).put(form_data.foto)
        let fotourl = await snapshot.ref.getDownloadURL()

        let user_data = {
            displayName: form_data.nume +"|"+ form_data.localitate +"|"+ form_data.buget +"|"+ form_data.telefon,
            photoURL: fotourl
        }

        await firebase.auth().currentUser.updateProfile(user_data)
        
        toast("Datele au fost actualizate!")
        
        m.route.set("/cont-utilizator")

    } catch (error) {
        console.error(error)
        toast(error.message, false, 8000)
        unfreeze_form(event.target)
    }
    
}


const ActualizeazaCont = {
    oninit: async () => {
        if (!(await firebase.auth().currentUser)){
            toast("Trebuie sa fi logat pentru a putea actualiza contul.", false)
            return m.route.set("/intra-in-cont")
        }
    },
    oncreate: prep,
    view: () => {

        return m("div.center", [

            m("form", {onsubmit: ev => {actualizeaza_cont(ev)}}, [
            
                m(".input", [
                    m("label", {for:"nume"}, "Nume complet"),
                    m("input", {type:"text", name:"nume", id:"nume", required:"required"})
                ]),
        
                m(".input", [
                    m("label", {for:"localitate"}, "Caut chirie in orasul"),
                    m("input", {type:"text", name:"localitate", id:"localitate", required:"required"})
                ]),
        
                m(".input", [
                    m("label", {for:"buget"}, "Buget disponibil lunar"),
                    m("input", {type:"tel", name:"buget", id:"buget", required:"required"})
                ]),
    
                m(".input", [
                    m("label", {for:"telefon"}, "Numar telefon"),
                    m("input", {type:"tel", name:"telefon", id:"telefon"})
                ]),
    
                m(".input", [
                    m("label.fileContainer", [
                        m("div", "Foto profil"),
                        m("input", {type:"file", name:"foto", id:"foto"})
                    ])
                ]),
        
                m("button", {type:"submit", class:"btn dark-green"}, "Aplica modificarile")
        
            ]),
    
        m(".mt-2", [
                m("a.btn.red", {onclick:sterge_contul}, "Sterge contul")
            ])

        ])
    }
}



export default ActualizeazaCont