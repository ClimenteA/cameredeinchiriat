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

// This is verry crappy code.. Done to learn firebase/SPA, needs to be redone

function disable_show_more_btn(){
    let show_more = document.getElementById("show-more")
    show_more.style.cursor = "default"
    show_more.disabled = true    
}


function enable_show_more_btn(){
    let show_more = document.getElementById("show-more")
    show_more.style.cursor = "pointer"
    show_more.disabled = false    
}


function toggle_cauta(){
    try {
        let optiune = document.getElementById("optiune")
        let btn = document.getElementById("cauta")
        btn.innerText = "Cauta " + optiune.value
        document.querySelector("title").innerText = "Cauta " + optiune.value
        enable_show_more_btn()
        save_json("optiune", optiune.value)

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


const pgitems=10

function build_query(localitate, buget, optiune){

    let last_ref

    let ref = firebase.firestore()
    if (optiune === "camera") {
        last_ref = get_json("camera_ref")
        console.log("Caut camera", last_ref)
        ref = ref.collection("listing")
    } 
    else if (optiune === "coleg") {
        last_ref = get_json("coleg_ref")
        console.log("Caut coleg", last_ref)
        ref = ref.collection("user")
    }

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


        // Check last ref 
        if (last_ref === null) {
            ref = ref.limit(pgitems)
        }
    else {
        try {
            ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
                .startAfter(last_ref)
                .limit(pgitems)    
        } catch (error) {
            ref = ref.orderBy("buget")
                    .startAfter(last_ref)
                    .limit(pgitems)   
        }   
    }

    return ref
}


async function get_data(form_data){
    
    let localitate
    let buget
    let optiune

    try {
        // form_data = Object.fromEntries(new FormData(form_el))
        localitate = clean_str(form_data.localitate)
        buget = Number(clean_str(form_data.buget))
        optiune = form_data.optiune   
    } catch (error) {
        //form_el invalid
        return
    }

    console.log(form_data)

    let ref = build_query(localitate, buget, optiune)
    
    // Parse data
    let ref_data = await ref.get()

    console.log("ref_data ", ref_data)

    let last_ref

    if (ref_data.empty) {
        console.log("ref_data.empty")
        toast("Nu sunt anunturi de aratat!", false, 5000)
        disable_show_more_btn()
        clear_json("coleg_ref")
        clear_json("camera_ref")
        return []
    } 
    else {
        last_ref = ref_data.docs[ref_data.docs.length-1].id
    }

    let anunturi

    try {

        console.log("New ref ", last_ref)
        
        if (optiune === "camera") {
            save_json("camera_ref", last_ref)
        } 
        else if (optiune === "coleg") {
            save_json("coleg_ref", last_ref)
        }

        anunturi = parse_ref_data(ref_data)
        console.log("anunturi ", anunturi)

    } catch (error) {
        toast("Nu sunt anunturi de aratat!", false, 5000)
        disable_show_more_btn()
        clear_json("coleg_ref")
        clear_json("camera_ref")
    }

    return anunturi
}


const FormAnunturi = {
    view: vnode => {
        return m("form", {onsubmit:event => {
            event.preventDefault()
            freeze_form(event.target)
            vnode.attrs.get_listings(event)
            enable_show_more_btn() 
            unfreeze_form(event.target)
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



const ModalImage = {
    view: () => {
        return m(".modal", [
            m("img.close", {
            src:"./static/svg/close.svg", 
            onclick: () => {
                document.querySelector(".modal").style.display = "none"
                document.body.style.overflow = "auto"
                }
            }),
            m("img.modal-content"),
            m(".caption")
        ])
    }
}


function fullscreen_image(event){

    let modal = document.querySelector(".modal")
    let modalImg = document.querySelector("img.modal-content")
    let captionText = document.querySelector(".caption")

    modal.style.display = "block"
    modalImg.src = event.target.src
    captionText.innerHTML = event.target.alt

    document.body.style.overflow = "hidden"

}


const DescriereCamera = (data) => {

    data = data.camera
    CardUtilizator.user_email = data.utilizator
    
    console.log("DescriereCamera ", data)
    
    return {
        
        view: _ => {

            return [
                m("img.responsive-img", {src:data.foto}),
                m(".descriere", [
                    m("h5", data.localitate + ", " + data.buget + " Euro"),
                    m("span", data.descriere),
                ]),

                m(CardUtilizator),

                m("button.btn", {type:"button", onclick:() => {
                    document.querySelector("form").classList.remove("none")
                    document.querySelector("section").classList.remove("none")
                    document.querySelector("#show-more").classList.remove("none")
                    document.querySelector("#descriere-anunt").classList.add("none")
                    document.querySelector("main").classList.add("center")
                    window.scrollTo({ top: 70, behavior: 'smooth' })
                }}, "Inapoi la anunturi")
            ]
        }
    }
}



function show_details(data){

    m.mount(document.querySelector("#descriere-anunt"), DescriereCamera(data))

    document.querySelector("#descriere-anunt").classList.remove("none")
    document.querySelector("form").classList.add("none")
    document.querySelector("section").classList.add("none")
    document.querySelector("#show-more").classList.add("none")
    window.scrollTo({ top: 70, behavior: 'smooth' })
 
}



const Camera = {
    view: vnode => {

        let title = vnode.attrs.camera.localitate + ", " + vnode.attrs.camera.buget + " Euro"

        return m(".anunt", {id:vnode.attrs.id}, [
            m("img.foto-camera", {src:vnode.attrs.camera.foto, 
                                alt:title,
                                onclick: event => fullscreen_image(event)}
                                ),
            m("span.title", {onclick: _ => show_details(vnode.attrs) }, title)
        ])
    }
}


const Anunturi = () => {

    function camera_coleg(data) {
        let optiune = get_json("optiune")

        if (optiune === "coleg") {
            console.log("show users", optiune)
            CardUtilizator.all_users = true
            // CardUtilizator.user_email = data.camera.utilizator
            document.querySelector("main").className = "center"
            return m(CardUtilizator)
        }else {
            console.log("show rooms", optiune)
            return m(Camera, data) 
        }
    }

    return {
        view: vnode => {

        return m("section.anunturi.mb-2", [
            vnode.attrs.listings ? vnode.attrs.listings.map(obj => {
                return camera_coleg(obj) 
            }) : toast("Se incarca anunturile...", true, 1000)
        ])
    }

    }
    
}


const Listings =  {
    listings: [],
    get_listings: async (form_el) => {

            document.getElementById("show-more").classList.remove("hide")
            
            if (form_el !== undefined) {
                console.log(form_el.target.type)
                if (form_el.target.type !== "button") {
                    Listings.listings = [] 
                }
            }
            
            let form_data = {localitate:document.getElementById("localitate").value, 
                            buget:document.getElementById("buget").value, 
                            optiune:document.getElementById("optiune").value}
            
            let objectlist = await get_data(form_data)   
            Listings.listings = Listings.listings.concat(objectlist)
        
            m.redraw()

        },
    oncreate: () => {
            prep()
            if (Listings.listings !== []) {
                Listings.get_listings()
            }
        },
    onremove: () => {
        Listings.listings = []
    },
    view: _ => {
        return [m(FormAnunturi, {get_listings:Listings.get_listings}),
                m(Anunturi, {listings: Listings.listings}),
                m("button.btn#show-more", {type:"button", onclick:Listings.get_listings}, "Arata mai multe"),
                m(ModalImage),
                m("#descriere-anunt")
            ]
        }
}


// https://tinyurl.com/y9zkw4ev
// https://flems.io/#0=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-JUMwDKC4bxcBQNMQFGhFA0REN-aQnQpBoEeM8N4vxsB3mBOzF4u7v4AAFuS0CEGiG9sY90cCHguHQYL7qKDIPObAxgGzKCAA

let VeziAnunturi = Listings

export default VeziAnunturi

