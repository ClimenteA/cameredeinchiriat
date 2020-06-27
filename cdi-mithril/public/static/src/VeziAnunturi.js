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


const pgitems=10

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
        try {
            ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
                .startAfter(last_ref)
                .limit(pgitems)    
        } catch (error) {
            ref = ref.orderBy("pret")
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
    }

    console.log(form_data)

    let last_ref = get_json("last_ref")
    let ref = firebase.firestore().collection("listing")
    ref = build_query(ref, localitate, buget, last_ref)

    // Parse data
    let ref_data = await ref.get()
    
    try {
        last_ref = ref_data.docs[ref_data.docs.length-1].id
        save_json("last_ref", last_ref)
    } catch (error) {
        toast("Nu sunt anunturi de aratat!", false, 5000)
        clear_json("last_ref")
    }
    
    let anunturi = parse_ref_data(ref_data)

    console.log("anunturi ", anunturi)

    return anunturi
}


const FormAnunturi = {
    view: vnode => {
        return m("form", {onsubmit:event => {
            event.preventDefault()
            freeze_form(event.target)
            vnode.attrs.get_listings(event) 
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


function close_modal(){
    document.querySelector(".modal").style.display = "none"
    document.body.style.overflow = "auto"
}


const ModalImage = {
    view: () => {
        return m(".modal", {onclick:close_modal}, [
            m("img.close", {src:"./static/svg/close.svg", onclick:close_modal}),
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



// <main class="center">
    

//     <img class="responsive-img" src="./static/1.jpg" alt="Foto camera">

//     <div class="descriere">
//         <h6>Iasi, 100Euro</h6>
//         <span>
//             Avem o camera libera intr-un apartament 
//             cu 3 camere, zona este linistita, magazin 
//             aproape, cautam o persoana care sa stea
//             pe o perioada de minim un an.
//             Pentru alte detalii ma puteti contacta
//             raspun la telefon dupa ora 6. 
//         </span>
//     </div>


//     <div class="user dark-purple">

//         <img src="./static/ca.jpg" alt="User image">
//         <h6>Climente Alin</h6>

//         <span>Iasi, buget 200E</span>
//         <span>0724242424</span>
//         <span>climente.alin@gmail.com</span>

//     </div>


// </main>


const DescriereCamera = (data) => {

    console.log(data)

    data = {
        fotoUser: "fotoUser",
        displayName: "displayName",
        title: "Iasi, buget 200E",
        telefon: "0724242424",
        email: "climente.alin@gmail.com",
        foto: "https://firebasestorage.googleapis.com/v0/b/cameredeinchiriat-b7885.appspot.com/o/listingImage%2Fyb0MWcFWAravpyg3oAT7%2F1.jpg?alt=media&token=b8bacaa2-98ac-4f88-8b02-78f284603ff4"
    }

    return {
        
        view: _ => {

            return [
                m("img.responsive-img", {src:data.foto}),
                m(".descriere", [
                    m("h6", data.title),
                    m("span", data.descriere),
                ]),

                m(".user.dark-purple", [
                    m("img", {src:data.fotoUser}),
                    m("h6", data.displayName),
                    m("span", data.title),
                    m("span", data.telefon),
                    m("span", data.email)
                ])
            ]
        }
    }
}



function show_details(data){
    m.mount(document.querySelector("#descriere-anunt"), DescriereCamera)

    document.querySelector("form").style.display = "none"
    document.querySelector("section").style.display = "none"
    document.querySelector("#show-more").style.display = "none"
    window.scrollTo({ top: 4, behavior: 'smooth' })
    
    console.log(data)
}



const Camera = {
    view: vnode => {

        let title = vnode.attrs.camera.localitate + ", " + vnode.attrs.camera.pret + " Euro"

        return m(".anunt", {id:vnode.attrs.id}, [
            m("img.foto-camera", {src:vnode.attrs.camera.foto, 
                                alt:title,
                                onclick: event => fullscreen_image(event)}
                                ),
            m("span.title", {onclick: _ => show_details(vnode.attrs) }, title)
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


const Listings =  {
    listings: [],
    get_listings: async (form_el) => {
        
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
            Listings.get_listings()
        },
    view: vnode => {
        return [m(FormAnunturi, {get_listings:Listings.get_listings}),
                m(Anunturi, {listings: Listings.listings}),
                m("button.btn#show-more", {type:"button", onclick:Listings.get_listings}, "Arata mai multe"),
                ModalImage.view(),
                m("#descriere-anunt")
            ]
        }
}


// https://tinyurl.com/y9zkw4ev
// https://flems.io/#0=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-JUMwDKC4bxcBQNMQFGhFA0REN-aQnQpBoEeM8N4vxsB3mBOzF4u7v4AAFuS0CEGiG9sY90cCHguHQYL7qKDIPObAxgGzKCAA

let VeziAnunturi = Listings

export default VeziAnunturi

