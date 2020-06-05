import { close_menu } from "./NavFooter.js"
import {
    freeze_form,
    unfreeze_form,
    toast,
    save_json,
    get_json,
    clear_json
} from "./Utils.js"


function toggle_cauta(){
    try {
        let optiune = document.getElementById("optiune")
        let btn = document.getElementById("cauta")
        btn.innerText = "Cauta " + optiune.value
        document.querySelector("title").innerText = "Cauta " + optiune.value
    } catch (error) {
        // console.error(error)   
    }
}


function prep(){
    document.body.className = "light-green blocuri"
    document.querySelector("main").removeAttribute("class")
    document.querySelector("title").innerText = "Cauta camera"
    close_menu()
}



// // [START paginate]
// var first = db.collection("cities")
// .orderBy("population")
// .limit(25);

// return first.get().then(function (documentSnapshots) {
// // Get the last visible document
// var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
// console.log("last", lastVisible);

// // Construct a new query starting at this document,
// // get the next 25 cities.
// var next = db.collection("cities")
//   .orderBy("population")
//   .startAfter(lastVisible)
//   .limit(25);
// });
// // [END paginate]



// .where("pret", "<=", 100)
// .where("localitate", "in", ["Iasi"])


function parse_ref_data(ref_data){
    
    let anunturi = []
    ref_data.forEach(res => {
        let jdata = {id:res.id, camera:res.data()}
        anunturi.push(jdata)
    })

    return anunturi
}


async function get_data(form_data, last_ref=null){

    let pgitems = 2
    let localitate = form_data.localitate.trim()
    let buget = Number(form_data.buget.trim())
    
 
    let ref = firebase.firestore().collection("listing")

    console.log("Inital last_ref: ", last_ref)
    
    if (localitate && buget){     

        if (last_ref === null){
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .where("pret", "<=", buget)
                                    .limit(pgitems)
                                    .get()
        }
        else {
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .where("pret", "<=", buget)
                                    .orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
        
        console.log("localitate & buget filter: ", localitate, buget)                
    
    }

    else if (localitate){

        if (last_ref === null){
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .limit(pgitems)
                                    .get()
        }
        else {
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
        
        console.log("localitate filter: ", localitate, buget)
        
    }
    else if (buget){

        if (last_ref === null){
            var ref_data = await ref.where("pret", "<=", buget)
                                    .limit(pgitems)
                                    .get()
        }
        else {
            var ref_data = await ref.where("pret", "<=", buget)
                                    .orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }

        console.log("buget filter: ", localitate, buget)
        
    }

    else {

        if (last_ref === null){
            var ref_data = await ref.limit(pgitems)
                                    .get()

        }
        else {

            var ref_data = await ref.orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
   
        console.log("no filter: ",localitate, buget)

    }



    var last_ref = ref_data.docs[ref_data.docs.length-1].id

    save_json("last_ref", last_ref)

    let anunturi = parse_ref_data(ref_data)

    // console.log("last_ref ", last_ref)
    // console.log("ref_data ", ref_data)
    // console.log("anunturi ", anunturi)

    return anunturi
}



async function get_listings(){

    let form_data

    try {
        let form_el = document.querySelector("form")
        form_data = new FormData(form_el)
        form_data = Object.fromEntries(form_data)
    } catch (error) {
        form_data = {localitate: "", buget: "", optiune: "camera"}    
    }
    
    try {
        
        let last_ref = get_json("last_ref")
        let anunturi = await get_data(form_data, last_ref)
        return anunturi

    } catch (error) {
        console.error(error)
        toast("Nu mai sunt anunturi", false, 8000)
    }
    
}




async function cauta_anunturi(event){
    event.preventDefault()

    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)

    console.log(form_data)

    try {

        freeze_form(event.target)

        await get_data(form_data)

        unfreeze_form(event.target)
        

    } catch (error) {
        console.error(error)

    }
    
}



const Camera = {
    view: vnode => {
        return m(".anunt", [
            m("img.foto-camera", {src:camera.foto, alt:"Foto camera"}),
            m("img.foto-user", {src:camera.fotoUser, alt:"Foto user"}),
            m("span.title", camera.localitate + camera.pret)
        ])
    }
}



const Listings = () => {
    
    let list
    
    get_listings().then(data => {
        list = data
        m.redraw()
    })

    

    return {
      view: () =>
        m("section.anunturi.mb-4",
          list && list.map(data => 
            m("span", JSON.stringify(data, undefined, 2))
          )
        )
    }
  }
  

// m("button", {class: "btn", onclick: get_listings}, "Show more")


const FormAnunturi = {
    oncreate: prep,
    view: () => {
        return m("form", {onsubmit:ev=>{cauta_anunturi(ev)}}, [
            m(".input", [
                m("label", {for:"localitate"}, "Localitate"),
                m("input", {type:"text", name:"localitate", id:"localitate"})
            ]),

            m(".input", [
                m("label", {for:"buget"}, "Buget"),
                m("input", {type:"tel", name:"buget", id:"buget"})
            ]),

            m("button", {type:"submit", class:"btn large heavy-purple", id:"cauta"}, "Cauta camera"),

            m(".input", {style:"margin-top:1rem;"}, [
                m("select", {name:"optiune", id:"optiune", onchange:toggle_cauta}, [
                    m("option", {value:"camera"}, "Camera"),
                    m("option", {value:"coleg"}, "Coleg"),
                ])
            ]),

        ])
    }
}


const VeziAnunturi = {
    oninit: () => {
        clear_json("last_ref")
    },
    view: vnode => {
        return m("div.center", [
            m(FormAnunturi),
            m(Listings)
        ])
    }
}


export default VeziAnunturi



import { close_menu } from "./NavFooter.js"
import {
    freeze_form,
    unfreeze_form,
    toast,
    save_json,
    get_json,
    clear_json,
    parse_form
} from "./Utils.js"


function toggle_cauta(){
    try {
        let optiune = document.getElementById("optiune")
        let btn = document.getElementById("cauta")
        btn.innerText = "Cauta " + optiune.value
        document.querySelector("title").innerText = "Cauta " + optiune.value
    } catch (error) {
        // console.error(error)   
    }
}


function prep(){
    document.body.className = "light-green blocuri"
    document.querySelector("main").className = "center"
    document.querySelector("title").innerText = "Cauta camera"
    close_menu()
}


function parse_ref_data(ref_data){   

    let anunturi = []
    ref_data.forEach(res => {
        let jdata = {id:res.id, camera:res.data()}
        anunturi.push(jdata)
    })

    return anunturi
}


function parse_localitate_buget(localitate, buget) {
    try {
        localitate = localitate.trim()
        buget = Number(buget.trim())
    } catch (error) {
        // console.error(error)
        console.log("localitate & buget undefined")
        localitate = undefined
        buget = undefined
    }

    return localitate, buget
}



async function get_data(localitate=undefined, buget=0, last_ref=undefined){
    
    let pgitems=2

    localitate, buget = parse_localitate_buget(localitate, buget)
    
    let ref = firebase.firestore().collection("listing")

    console.log("Inital last_ref: ", last_ref)
    
    if (localitate && buget){   
        console.log("localitate && buget ", localitate, buget)
        if (last_ref){
            console.log("ref: ", last_ref)     
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .where("pret", "<=", buget)
                                    .limit(pgitems)
                                    .get()
        }
        else {
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .where("pret", "<=", buget)
                                    .orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
        
    }

    else if (localitate){

        console.log("localitate", localitate)
        if (last_ref){
            console.log("ref: ", last_ref) 
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .limit(pgitems)
                                    .get()
        }
        else {
            var ref_data = await ref.where("localitate", "in", [localitate])
                                    .orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
        
    }
    else if (buget){
        console.log("buget", buget)
        if (last_ref){
            console.log("ref: ", last_ref) 
            var ref_data = await ref.where("pret", "<=", buget)
                                    .limit(pgitems)
                                    .get()
        }
        else {
            var ref_data = await ref.where("pret", "<=", buget)
                                    .orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
    }

    else {
        console.log("Fara localitate si buget")
        if (last_ref){
            console.log(last_ref)
            var ref_data = await ref.limit(pgitems)
                                    .get()

        }
        else {
            var ref_data = await ref.orderBy(firebase.firestore.FieldPath.documentId())
                                    .startAfter(last_ref)
                                    .limit(pgitems)
                                    .get()
        }
    
    }

    try {
        var last_ref = ref_data.docs[ref_data.docs.length-1].id
        save_json("last_ref", last_ref)
    } catch (error) {
        console.log("last_ref undefined")
    }
    
    let anunturi = parse_ref_data(ref_data)

    return anunturi
}



async function cauta_anunturi(event){
    event.preventDefault()

    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)

    console.log(form_data)

    try {

        freeze_form(event.target)

        let last_ref = get_json("last_ref")
        await get_data(form_data.localitate, form_data.buget, last_ref)

        unfreeze_form(event.target)
        

    } catch (error) {
        console.error(error)

    }
    
}


const FormAnunturi = {
    oncreate: prep,
    view: () => {
        return m("form", {onsubmit:ev=>{cauta_anunturi(ev)}}, [
            m(".input", [
                m("label", {for:"localitate"}, "Localitate"),
                m("input", {type:"text", name:"localitate", id:"localitate"})
            ]),

            m(".input", [
                m("label", {for:"buget"}, "Buget"),
                m("input", {type:"tel", name:"buget", id:"buget"})
            ]),

            m("button", {type:"submit", class:"btn large heavy-purple", id:"cauta"}, "Cauta camera"),

            m(".input", {style:"margin-top:1rem;"}, [
                m("select", {name:"optiune", id:"optiune", onchange:toggle_cauta}, [
                    m("option", {value:"camera"}, "Camera"),
                    m("option", {value:"coleg"}, "Coleg"),
                ])
            ]),

        ])
    }
}



const Camera = {
    view: vnode => {
        console.log("vnode.attrs: ", vnode.attrs)

        return m(".anunt", {id:vnode.attrs.id}, [
            m("img.foto-camera", {src:vnode.attrs.camera.foto}),
            m("span.title", 
            vnode.attrs.camera.localitate + ", " + vnode.attrs.camera.pret + " Euro")
        ])
    }
}


const Anunturi = vnode => {
    
    console.log("Anunturi vnode ", vnode)

    let listings
    get_data().then(data => {
        listings = data
        m.redraw()
    })
    
    return {
        view: vnode => {
            return m("section.anunturi.mb-4", [
                listings ? listings.map(obj => {
                    return m(Camera, obj) 
                }) : toast("Se incarca anunturile...", true, 1000)
            ])
        }
    }

}


const VeziAnunturi = {
    oninit: prep,
    view: () => {
        return [m(FormAnunturi),
                m(Anunturi)]
    }
}



export default VeziAnunturi

