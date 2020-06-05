import { close_menu } from "./NavFooter.js"
import { 
    unfreeze_form,
    freeze_form, 
    toast, 
    clean_str
} from "./Utils.js"



function prep(){
    document.body.className = "light-purple blocuri"
    document.querySelector("main").className = "center"
    document.querySelector("title").innerText = "Adauga camera"
    close_menu()
}


async function adauga_camera(event){

    event.preventDefault()

    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)

    console.log(form_data)

    try {

        freeze_form(event.target)

        let foto = form_data.foto
        delete form_data.foto
        form_data.localitate = clean_str(form_data.localitate)
        form_data.pret = Number(form_data.pret.trim())

        let docRef = await firebase.firestore().collection('listing').add(form_data)
        let path = `/listingImage/${docRef.id}/${foto.name}`

        let storageRef = await firebase.storage().ref()
        let snapshot = await storageRef.child(path).put(foto)
        let fotourl = await snapshot.ref.getDownloadURL()
        let uid = await firebase.auth().currentUser.uid
        let date = await firebase.firestore.FieldValue.serverTimestamp()

        let camera_info = {
            foto: fotourl,
            utilizator: uid,
            data: date
        }
 
        await firebase.firestore().collection("listing").doc(docRef.id).update(camera_info)

        unfreeze_form(event.target)
        
        toast("Gata anuntul a fost adaugat!")

        m.route.set("/cont-utilizator")

    } catch (error) {
        console.error(error)
        toast(error.message, false, 8000)
        unfreeze_form(event.target)

        firebase.firestore().collection("listing").doc(docRef.id).delete()
        storageRef.child(path).delete()

    }
    
}


const AdaugaCamera = {
    oninit: async () => {
        if (!(await firebase.auth().currentUser)){
            toast("Trebuie sa fi logat pentru a putea adauga un anunt.", false)
            return m.route.set("/intra-in-cont", {adauga_camera:true})
        }
    },
    oncreate: prep,
    view: () => {

        return m("form", {onsubmit: ev => {adauga_camera(ev)}}, [
            
            m(".input", [
                m("label", {for:"localitate"}, "Localitate"),
                m("input", {type:"text", name:"localitate", id:"localitate", required:"required"})
            ]),
    
            m(".input", [
                m("label", {for:"pret"}, "Pret"),
                m("input", {type:"tel", name:"pret", id:"pret", required:"required"})
            ]),
    
            m(".input", [
                m("label", {for:"descriere"}, "Descriere"),
                m("textarea", {name:"descriere", id:"descriere", required:"required"})
            ]),

            m(".input", [
                m("span", "Pune cat mai multe detalii pentru a face anuntul atractiv.")
            ]),

            m(".input", [
                m("label.fileContainer", [
                    m("div", "Foto camera"),
                    m("input", {type:"file", name:"foto", id:"foto"})
                ])
            ]),
    
            m("button", {type:"submit", class:"btn dark-green"}, "Adauga camera")
    
        ])            
    }
}



export default AdaugaCamera
