import { close_menu } from "./NavFooter.js"
import {
    freeze_form,
    unfreeze_form,
    toast,
    save_json,
    get_json,
    clear_json,
    parse_form,
    clean_str,
    get_form_data
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


function get_search_data() {

    let localitate = ""
    let buget = ""
    let optiune = ""

    let form_data = get_form_data()

    if (form_data){
        localitate = clean_str(form_data.localitate)
        buget = Number(clean_str(form_data.buget))
        optiune = form_data.optiune    
    }

    return localitate, buget, optiune
}


const pgitems=2

function build_query(ref, localitate, buget, last_ref){

    // Build query
    if (localitate && buget){   
        ref = ref.where("localitate", "in", [localitate]).where("pret", "<=", buget)         
    }
    else if (localitate){
        ref = ref.where("localitate", "in", [localitate])                  
    }
    else if (buget){
        ref = ref.where("pret", "<=", buget)
    }

    // Check last ref 
    if (last_ref === null) {
        ref = ref.limit(pgitems)
    }
    else {
        ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
                 .startAfter(last_ref)
                 .limit(pgitems)
    }

    return ref
}


async function get_data(){

    let last_ref = get_json("last_ref")
    let localitate, buget, optiune = get_search_data()

    let ref = firebase.firestore().collection("listing")
    ref = build_query(ref, localitate, buget, last_ref)

    // Parse data

    let ref_data = await ref.get()
    
    try {
        last_ref = ref_data.docs[ref_data.docs.length-1].id
        save_json("last_ref", last_ref)
    } catch (error) {
        toast("Nu mai sunt anunturi!", false, 5000)
    }
    
    let anunturi = parse_ref_data(ref_data)
    
    return anunturi
}


const FormAnunturi = {
    oncreate: prep,
    view: vnode => {
        return m("form", {onsubmit:event => {
            event.preventDefault()
            freeze_form(event.target)
            vnode.attrs.get_more_data() //NOK..
            unfreeze_form(event.target)
            m.redraw()
        }}, [
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
        return m(".anunt", {id:vnode.attrs.id}, [
            m("img.foto-camera", {src:vnode.attrs.camera.foto}),
            m("span.title", 
            vnode.attrs.camera.localitate + ", " + vnode.attrs.camera.pret + " Euro")
        ])
    }
}


const Anunturi = {
    view: vnode => {
        return m("section.anunturi.mb-2", [
            vnode.attrs.listings ? vnode.attrs.listings.map(obj => {
                return m(Camera, obj) 
            }) : toast("Se incarca anunturile...", true, 1000)
        ])
    }
}


const VeziAnunturi = () => {

    let listings 

    function get_more_data(){
        get_data().then(data => {
            listings=data
            m.redraw()
        })
    }
    
    get_more_data()
    
    return {
        oninit: prep,
        view: vnode => {
            return [m(FormAnunturi, {get_more_data:get_more_data}),
                    m(Anunturi, {listings: listings}),
                    m("button.btn", {onclick:get_more_data}, "Arata mai multe")
                ]
        }
    }
}



export default VeziAnunturi

