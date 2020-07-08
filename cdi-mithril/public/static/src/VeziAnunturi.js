import { close_menu } from "./NavFooter.js"
import {
    freeze_form,
    unfreeze_form,
    toast,
    save_json,
    get_json,
    clear_json,
    parse_form,
    clean_str
} from "./Utils.js"

import {CardUtilizator} from "./ContUtilizator.js"



// Model

let items_per_page = 1

let store 

function default_store(){
    store = {
        form_data: {localitate: "", buget: "", optiune: "camera"}, 
        last_ref: undefined,
        items: undefined,
        reached_end: false
    } 
}

default_store()


// Controller

function prep(){
    document.body.className = "light-green blocuri"
    document.querySelector("main").className = "center"
    document.querySelector("title").innerText = "Cauta camera"
    close_menu()
}

function process_option(){
    try {
        let optiune = document.getElementById("optiune")
        let btn = document.getElementById("cauta")
        btn.innerText = "Cauta " + optiune.value
        document.querySelector("title").innerText = "Cauta " + optiune.value
        
        store.last_ref = undefined
        store.items = undefined

        console.log("option changed: ", store)
        
        enable_show_more_btn()

    } catch (error) {
        // console.error(error)   
    }
}


function store_form_data(event){
    let form = new FormData(event.target) 
    let form_data = Object.fromEntries(form)
    store.form_data = form_data
}

function get_collection(){

    let ref = firebase.firestore()
    
    if (store.form_data.optiune === "camera") {
        ref = ref.collection("listing")
    } else if (store.form_data.optiune === "coleg") {
        ref = ref.collection("user")
    }
    return ref
}


function build_query(){
    
    let ref = get_collection()

    let localitate = store.form_data.localitate
    let buget      = store.form_data.buget
    
    // Build query
    if (localitate && buget){   
        ref = ref.where("localitate", "in", [localitate]).where("buget", "<=", buget)         
    }
    else if (localitate){
        ref = ref.where("localitate", "in", [localitate])                  
    }
    else if (buget){
        ref = ref.where("buget", "<=", buget)
    }

    // Add limit of items
    if (store.last_ref === undefined) {
        ref = ref.limit(items_per_page)
    } 
    else {
        try {
            ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
                .startAfter(store.last_ref)
                .limit(items_per_page)    
        } catch (error) {
            ref = ref.orderBy("buget")
                    .startAfter(last_ref)
                    .limit(items_per_page)   
        }
    }

    return ref

}


function parse_ref_data(ref_data){   

    let datali = []
    ref_data.forEach(res => {
        let data = {id:res.id, ...res.data()}
        datali.push(data)
    })

    return datali
}


async function execute_query_and_store_items(ref){

    let ref_data = await ref.get()
    m.redraw()

    if (ref_data.empty) {
        toast("Nu mai sunt anunturi", false, 8000)
        // store.items = undefined
        store.last_ref = undefined
        store.reached_end = true
        document.getElementById("show-more").disabled = true
    }
    else {
        store.last_ref = ref_data.docs[ref_data.docs.length-1].id
        store.reached_end = false
        document.getElementById("show-more").disabled = false
        let data = parse_ref_data(ref_data)
        if (store.items === undefined) { store.items = data } 
        else { store.items = store.items.concat(data) }
    }
}


function get_items() {
    let ref = build_query()
    execute_query_and_store_items(ref)
}


function process_form(event){
    event.preventDefault()
    
    store_form_data(event)
    
    document.getElementById("cauta").disabled = true 
    get_items()
    document.getElementById("cauta").disabled = false
    
    store.reached_end = false
    
    console.log("form submited: ", store)

}


// View

const FormAnunturi = {
    view: vnode => {
        return m("form", {onsubmit:event => process_form(event)}, [
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
                m("select", {name:"optiune", id:"optiune", onchange:process_option}, [
                    m("option", {value:"camera"}, "Camera"),
                    m("option", {value:"coleg"}, "Coleg"),
                ])
            ]),

        ])
    }
}


const Camera = {
    view: vnode => {

        let title = vnode.attrs.localitate + ", " + vnode.attrs.buget + " Euro"

        return m(".anunt", {id:vnode.attrs.id}, [
            m("img.foto-camera",
            {src:vnode.attrs.foto, alt:title, 
                onclick: event => fullscreen_image(event) }
            ),
            m("span.title", {onclick: _ => show_details(vnode.attrs) }, title)
        ])
    }
}


const Anunturi = {
    oncreate: get_items,
    onremove: () => {
        store.items = undefined
    },
    view: () => {
        return m("section.anunturi.mb-2", [
            store.items ? store.items.map(obj => {
                return m(Camera, obj)
            }) : toast("Se incarca anunturile...", true, 1000)
        ])
    }
}


const ShowMore = {
    view: () => {
        
        return m("button.btn#show-more", {type:"button", 
            onclick: event => {        
                    event.target.disabled = true
                    event.target.style.cursor = "default"
                    get_items()
                    event.target.disabled = false
                    event.target.style.cursor = "pointer"
                }
        }, "Arata mai multe")
    }
}



const Listings = {
    oninit: prep,
    view: () => {
        return [
            m(FormAnunturi),
            m(Anunturi),
            m(ShowMore)
        ]
    }
}



export default Listings