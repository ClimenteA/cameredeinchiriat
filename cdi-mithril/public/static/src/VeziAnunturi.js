import { close_menu } from "./NavFooter.js"
import { 
    toast, 
    parse_query_data,
    get_user_data
} from "./Utils.js"

import CardUtilizator from "./CardUtilizator.js"


// Model

let items_per_page = 10

let store 

function default_store(){
    store = {
        camera: true,
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
    window.scrollTo({ top: 0 })
    close_menu()
}

function process_option(){
    try {
        let optiune = document.getElementById("optiune")
        let btn = document.getElementById("cauta")
        btn.innerText = "Cauta " + optiune.value
        document.querySelector("title").innerText = "Cauta " + optiune.value

        if (optiune.value === "camera") { store.camera = true } 
        else { store.camera = false }
        
        store.last_ref = undefined
        store.items = undefined

        console.log("option changed: ", store)

        document.getElementById("cauta").click() 

        enable_show_more_btn()

    } catch (error) {
        // console.error(error)   
    }
}


function store_form_data(event){
    let form = new FormData(event.target) 
    let form_data = Object.fromEntries(form)

    if (form_data !== store.form_data) {
        default_store()
        store.form_data = form_data 
    } 
    
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
    let buget      = Number(store.form_data.buget)

    console.info("Filters: ", localitate, buget)
    
    // Build query
    if (localitate && buget){   
        console.info("Filtru localitate && buget: ", localitate, buget)
        ref = ref.where("localitate", "in", [localitate]).where("buget", ">=", buget)         
    }
    else if (localitate){
        console.info("Filtru localitate: ", localitate)
        ref = ref.where("localitate", "in", [localitate])                  
    }
    else if (buget){
        console.info("Filtru buget: ", buget)
        ref = ref.where("buget", ">=", buget)
    }

    // Add limit of items
    if (store.last_ref === undefined) {
        ref = ref.limit(items_per_page)
    } 

    if (buget && store.last_ref !== undefined) {
        console.info("Sort by buget", buget, store.last_ref)
        ref = ref.orderBy("buget")
            .startAfter(store.last_ref)
            .limit(items_per_page)
    }

    else if (store.last_ref !== undefined) {
        console.info("Sort by id", store.last_ref)
        ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
            .startAfter(store.last_ref)
            .limit(items_per_page)    
    }
        
    console.info("Last ref is ", store.last_ref)

    return ref
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
        let data = parse_query_data(ref_data)
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

    process_option()
    
    document.getElementById("cauta").disabled = true 
    get_items()
    document.getElementById("cauta").disabled = false
    
    store.reached_end = false
    
    console.log("form submited: ", store)

}



async function show_details(data) {

    let user_data = await get_user_data(data.utilizator)

    data = {...{"user_data": user_data}, ...data}

    console.log("show_details data", data)

    m.mount(desc, {view: () => m(DetaliiCamera, data)})
    
    desc.style.display = "grid" 
    window.scrollTo({ top: 0 })
}




// View

const FormAnunturi = {
    view: () => {
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


const AscundeDescriere = {
    view: () => {
        return m("button.btn.moderate-purple", 
        { onclick: () => {
            desc.style.display = "none"
        }}, 
        "< Inapoi")
    }
}


const DetaliiCamera = {

    view: v => {
        return m(".modal.blocuri", [

            m(AscundeDescriere),
            m("img.responsive-img", {src:v.attrs.foto}),
            
            m(".center.user-layout", [
                
                m(".descriere", [
                    m("h5", v.attrs.localitate + ", " + v.attrs.buget + " Euro"),
                    m("span", v.attrs.descriere),
                ]),
    
                m(CardUtilizator, v.attrs.user_data),

            ]),
            
            m(AscundeDescriere)            

        ])
    }
}


const Camera = {

    view: v => {

        let title = v.attrs.localitate + ", " + v.attrs.buget + " Euro"

        return m(".anunt", {id:v.attrs.id}, [
            m("img.foto-camera",
            {src:v.attrs.foto, alt:title, 
                onclick: () => show_details(v.attrs) }
            ),
            m("span.title", {onclick: () => show_details(v.attrs) }, title)
        ])
    }
}



const Anunturi = {
    oncreate: get_items,
    view: () => {
        
        console.info("Show Camera ", store.camera)

        return m("section.anunturi.mb-2", [
            store.items ? store.items.map(obj => {
                return store.camera ? m(Camera, obj) : m(CardUtilizator, obj)
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

let desc

const Listings = {
    oninit: prep,
    oncreate: () => desc = document.querySelector("#descriere-anunt"),
    onremove:default_store,
    view: () => {
        return [
            m(FormAnunturi),
            m(Anunturi),
            m(ShowMore),
            m("#descriere-anunt")
        ]
    }
}



export default Listings