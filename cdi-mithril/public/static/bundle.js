(function(){'use strict';const logo_path = "./static/svg/logo.svg";
const menu_path = "./static/svg/menu.svg";
const close_path = "./static/svg/close.svg";

function show_menu() {
    let menu_container = document.querySelector("#menu");
    menu_container.className = "menu-expanded show";
}

function close_menu() {
    let menu_container = document.querySelector("#menu");
    menu_container.className = "menu-expanded hide";
}


const Nav = {
    view: () => {
        return m("div", [

            m("nav", [
                m("a", {href:"#!/"}, [
                    m("img", {class:"logo", src:logo_path, alt:"camere de inchiriat"}),
                ]),

                m("img", {class:"menu", src:menu_path, alt:"menu", onclick:show_menu}),

            ]),

            m("div", {class:"menu-expanded hide", id:"menu"}, [
                m("img", {src:close_path, alt:"close", onclick:close_menu}),
                m("ul", [
                    m("li", m("a", {href:"#!/intra-in-cont"}, "Intra in cont")),
                    m("li", m("a", {href:"#!/adauga-camera"}, "Adauga camera")),
                    m("li", m("a", {href:"#!/vezi-anunturi"}, "Vezi anunturi")),
                    m("li", m("a", {href:"#!/iesi-din-cont"}, "Iesi din cont")),
                ])
            ])
    
    ])}
};


const Footer = {
    view: () => {
        return m("div", {class:"footer"}, [
            m("a", {href:"#!/politica-cookies"}, "Politica cookies"),
            m("a", {href:"#!/politica-de-confidentialitate"}, "Politica de Confidentialitate"),
            m("a", {href:"#!/termeni-si-conditii"}, "Termeni si conditii"),
            m("a", {href:"#!/raporteaza-problema"}, "Raporteaza o problema"),
            m("a", {href:"#!/contact"}, "Contact"),
        ])
    }
};// import { set, get, clear } from "../idb.js"
 

// HACK to trigger firebase auth
async function callFirebaseAuth(){
    try {
        await firebase.auth().currentUser;    
    } catch (error) {
        
    }
}

callFirebaseAuth();


function disable_children(el){
    [...el.elements].forEach(child => {
        child.disabled = true;
    });
}

function enable_children(el){
    [...el.elements].forEach(child => {
        child.disabled = false;
    });
}


function disable_helpers(){
    let helpers = document.querySelector(".helpers");
    helpers.className = "helpers hide";
}

function enable_helpers(){
    let helpers = document.querySelector(".helpers");
    helpers.className = "helpers";
}

function freeze_form(el){
    try {
        disable_children(el);
        disable_helpers();    
    } catch (error) {
        // console.error(error)
    }
}


function unfreeze_form(el){
    try {
        enable_children(el);
        enable_helpers();
    } catch (error) {
        // console.error(error)
    }
}


function toast(msg, success=true, ms=3000) {


    let div = document.createElement("div");

    div.setAttribute("id", "toast");
    div.innerText = msg;

    document.body.appendChild(div);
    
    if(success) {
        div.style.background = "#4A9E33";
    }
    else {
        div.style.background = "#F23737";
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    div.addEventListener("click", (event) => {
        event.target.remove();
    });

    setTimeout(() => {
        div.remove();
    }, ms);

}


function name_from_email(email) {
    let name = email.split("@")[0];
    name = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ");
    name = name.replace(/\s{2,}/g," ");
    return name 
}



function save_json(key, json_obj){
    let json_str = JSON.stringify(json_obj);
    sessionStorage.setItem(key, json_str);
}

function get_json(key){
    return JSON.parse(sessionStorage.getItem(key))
}


function clear_json(key=null){
    if (key){
        sessionStorage.removeItem(key);
    }
    else {
        sessionStorage.clear();
    }
}


function clean_str(str) {
    str = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    str = str.replace(/\s+/g,' ').trim();
    return str
}const type_motive = _ => {

    const motive = [
        "un apartament al tau",
        "o Tesla",
        "nunta",
        "un macbook",
        "botez",
        "restante",
        "ziua ta",
        "ciocolata",
        "bere",
        "un telefon nou",
        "o afacere",
        "altceva"
        ];
    
    try {
        new Typewriter('#motive', {
            strings: motive,
            autoStart: true,
            loop: true // TODO find a way to stop at a word
        });        
    } catch (error) {
        console.error(error);
    }
};


function prep() {
    document.body.className = "light-green blocuri";
    document.querySelector("main").removeAttribute("class");
    document.querySelector("title").innerText = "Camere de inchiriat";
    close_menu();
    type_motive();
    clear_json("last_ref");
}


const Home = {
    oncreate: prep,
    view: () => {
        return m("section", {class:"mt-4"}, [
            m("a", {href:"#!/vezi-anunturi", class:"btn heavy-purple large"}, "Cauta o camera"),
            m("h1", {class:"erica-font flow-text"}, m.trust(`Imparte chiria si pastreaza banii 
            <br> pentru <span id="motive">vacante</span>`))
        ])
    }
};function prep$1(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").className = "center";
    document.querySelector("title").innerText = "Adauga camera";
    close_menu();
}


async function adauga_camera(event){

    event.preventDefault();

    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);

    console.log(form_data);

    try {

        freeze_form(event.target);

        let foto = form_data.foto;
        delete form_data.foto;
        form_data.localitate = clean_str(form_data.localitate);
        form_data.pret = Number(form_data.pret.trim());

        let docRef = await firebase.firestore().collection('listing').add(form_data);
        let path = `/listingImage/${docRef.id}/${foto.name}`;

        let storageRef = await firebase.storage().ref();
        let snapshot   = await storageRef.child(path).put(foto);
        let fotourl    = await snapshot.ref.getDownloadURL();
        let email      = await firebase.auth().currentUser.email;
        let date       = await firebase.firestore.FieldValue.serverTimestamp();

        await firebase.firestore().collection("listing")
        .doc(docRef.id)
        .update({
            foto: fotourl,
            utilizator: email,
            data: date
        });

        unfreeze_form(event.target);
        
        toast("Gata anuntul a fost adaugat!");

        m.route.set("/cont-utilizator");

    } catch (error) {
        console.error(error);
        toast(error.message, false, 8000);
        unfreeze_form(event.target);

        firebase.firestore().collection("listing").doc(docRef.id).delete();
        storageRef.child(path).delete();

    }
    
}


const AdaugaCamera = {
    oninit: async () => {
        if (!(await firebase.auth().currentUser)){
            toast("Trebuie sa fi logat pentru a putea adauga un anunt.", false);
            return m.route.set("/intra-in-cont", {adauga_camera:true})
        }
    },
    oncreate: prep$1,
    view: () => {

        return m("form", {onsubmit: ev => {adauga_camera(ev);}}, [
            
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
};async function intra_in_cont(event, vnode){
    event.preventDefault();

    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);
    // console.log(form_data)

    freeze_form(event.target);

    try {

        await firebase.auth().signInWithEmailAndPassword(form_data.email, form_data.pass1);
        
        if (vnode.attrs.adauga_camera){
            m.route.set("/adauga-camera");
        } else {
            m.route.set("/cont-utilizator");
        }
        
    } 
    catch (error) {

        if ("message" in error){
            if (error.message.includes("password is invalid")){
                toast("Emailul sau parola gresite!", false, 8000);
            }
            else if (error.message.includes("no user record")) {
                toast("Emailul nu este in baza de date! Ai cont?", false, 8000);
            }
            else {
                toast(error.message, false, 8000);
            }   
        }
        else {
            toast(error, false, 5000);
        }
        
        unfreeze_form(event.target);
    }
    
}


function prep$2(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").className = "center";
    document.querySelector("title").innerText = "Intra in cont";
    close_menu();
}



const IntraInCont = {
    oninit: async () => {
        if (await firebase.auth().currentUser) {
            return m.route.set("/cont-utilizator")
        }
    },
    oncreate: prep$2,
    view: vnode => {
        return m("form", {onsubmit: ev => {intra_in_cont(ev, vnode);}}, [
            m(".input", [
                m("label", {for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),

            m(".input", [
                m("label", {for:"pass1"}, "Parola"),
                m("input", {type:"password", name:"pass1", id:"pass1", required:"required"})
            ]),

            m("button", {type:"submit", class:"btn dark-green"}, "Intra in cont"),

            m(".helpers", [
                m("a", {href:"#!/creeaza-un-cont"}, "Nu am cont!"),
                m("a", {href:"#!/reseteaza-parola"}, "Am uitat parola!")
            ])
        ])
    }
};function prep$3(){
    document.querySelector("main").removeAttribute("class");
    document.body.className = "light-green blocuri";
    document.querySelector("title").innerText = "Cont utilizator";
    close_menu();
}


function parse_query_data(query_data){   

    let data = [];
    query_data.forEach(res => {
        let jdata = {id:res.id, data:res.data()};
        data.push(jdata);
    });

    return data[0].data
}


const CardUtilizator = {

    user_data: null,
    user_email: null,

    get_user_data: async _ => {

        let query = firebase.firestore().collection("user");

        if (CardUtilizator.user_email) {
            query.where("email", "==", CardUtilizator.user_email);
        }
        else {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    query.where("email", "==", user.email);
                }
            });
        }
        
        let query_data = await query.get();  
        CardUtilizator.user_data = parse_query_data(query_data);
        console.log(CardUtilizator.user_data);
        m.redraw();
    },

    oninit: () => {
        prep$3();
        CardUtilizator.get_user_data();
    },

    view: () => {

        const user_card = data => [
                m("img", {src:data.foto}),
                m("h6", data.nume),
                m("span", data.localitate + ", " + "buget " + data.buget + " Euro"),
                m("span", data.telefon),
                m("span", data.email)
            ];

        return m("section.user", 
        CardUtilizator.user_data ? 
        user_card(CardUtilizator.user_data) : m("h5", "...") )
    }

    };

    


const AnunturiPostate = {
    anunturi: [],

    oninit: vnode => {
        AnunturiPostate.anunturi = [ {title:"TEST Iasi, buget 120Euro", 
                                    id_camera:"123212"},
                                    {title:"TEST Iasi, buget 50Euro", 
                                    id_camera:"124444"}
                                    ];
    },
    view: () => {
        return m("section.camere-postate", [
            m("h6", "Camere postate"),
            AnunturiPostate.anunturi ? m("ul", AnunturiPostate.anunturi.map(anunt => {
                return m("li", [
                    m("a", {href:`#!/detalii-camera/${anunt.id_camera}`}, anunt.title)
                ]) 
            })) : m("h5", "...")
        ])
    }
};


const ContUtilizator = {
    view: () => {
        return m("div.center.user-layout", [
            m(CardUtilizator),
            m(AnunturiPostate),
            m("a", { href:"#!/actualizeaza-cont", class:"btn moderate-purple"}, "Actualizeaza contul")
        ])
    }
};function disable_show_more_btn(){
    let show_more = document.getElementById("show-more");
    show_more.style.cursor = "default";
    show_more.disabled = true;    
}


function enable_show_more_btn(){
    let show_more = document.getElementById("show-more");
    show_more.style.cursor = "pointer";
    show_more.disabled = false;    
}


function toggle_cauta(){
    try {
        let optiune = document.getElementById("optiune");
        let btn = document.getElementById("cauta");
        btn.innerText = "Cauta " + optiune.value;
        document.querySelector("title").innerText = "Cauta " + optiune.value;
        enable_show_more_btn();

    } catch (error) {
        // console.error(error)   
    }
}


function prep$4(){
    document.body.className = "light-green blocuri";
    document.querySelector("main").className = "center";
    document.querySelector("title").innerText = "Cauta camera";
    close_menu();
}


function parse_ref_data(ref_data){   

    let anunturi = [];
    ref_data.forEach(res => {
        let jdata = {id:res.id, camera:res.data()};
        anunturi.push(jdata);
    });

    return anunturi
}


const pgitems=10;

function build_query(ref, localitate, buget, last_ref){

    // Build query
    if (localitate && buget){   
        ref = ref.where("localitate", "in", [localitate]).where("pret", "<=", buget);         
    }
    else if (localitate){
        ref = ref.where("localitate", "in", [localitate]);                  
    }
    else if (buget){
        ref = ref.where("pret", "<=", buget);
    }

    // Check last ref 
    if (last_ref === null) {
        ref = ref.limit(pgitems);
    }
    else {
        try {
            ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
                .startAfter(last_ref)
                .limit(pgitems);    
        } catch (error) {
            ref = ref.orderBy("pret")
                    .startAfter(last_ref)
                    .limit(pgitems);   
        }   
    }

    return ref
}


async function get_data(form_data){
    
    let localitate;
    let buget;
    let optiune;

    try {
        // form_data = Object.fromEntries(new FormData(form_el))
        localitate = clean_str(form_data.localitate);
        buget = Number(clean_str(form_data.buget));
        optiune = form_data.optiune;   
    } catch (error) {
        //form_el invalid
    }

    console.log(form_data);

    let ref;
    let last_ref = get_json("last_ref");
    let db = firebase.firestore();
    if (optiune === "camera") {
        ref = build_query(db.collection("listing"), localitate, buget, last_ref);
    } 
    else if (optiune === "coleg") {
        ref = build_query(db.collection("user"), localitate, buget, last_ref);
    }
    
    // Parse data
    let ref_data = await ref.get();

    let anunturi;

    try {
        last_ref = ref_data.docs[ref_data.docs.length-1].id;
        
        let prev_last_ref = get_json("last_ref"); 
        
        // console.log(prev_last_ref, last_ref)

        if (prev_last_ref === last_ref) {
            clear_json("last_ref");
            toast("Nu sunt anunturi de aratat!", false, 5000);
            disable_show_more_btn();
            anunturi = [];
        }
        else {
            save_json("last_ref", last_ref);
            anunturi = parse_ref_data(ref_data);
        }

    } catch (error) {
        toast("Nu sunt anunturi de aratat!", false, 5000);
        disable_show_more_btn();
        clear_json("last_ref");
    }

    console.log("anunturi ", anunturi);

    return anunturi
}


const FormAnunturi = {
    view: vnode => {
        return m("form", {onsubmit:event => {
            event.preventDefault();
            freeze_form(event.target);
            vnode.attrs.get_listings(event);
            enable_show_more_btn(); 
            unfreeze_form(event.target);
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
};


function close_modal(){
    document.querySelector(".modal").style.display = "none";
    document.body.style.overflow = "auto";
}


const ModalImage = {
    view: () => {
        return m(".modal", {onclick:close_modal}, [
            m("img.close", {src:"./static/svg/close.svg", onclick:close_modal}),
            m("img.modal-content"),
            m(".caption")
        ])
    }
};


function fullscreen_image(event){

    let modal = document.querySelector(".modal");
    let modalImg = document.querySelector("img.modal-content");
    let captionText = document.querySelector(".caption");

    modal.style.display = "block";
    modalImg.src = event.target.src;
    captionText.innerHTML = event.target.alt;

    document.body.style.overflow = "hidden";

}


const DescriereCamera = (data) => {

    data = data.camera;
    CardUtilizator.user_email = data.utilizator;
    
    console.log("DescriereCamera ", data);
    
    return {
        
        view: _ => {

            return [
                m("img.responsive-img", {src:data.foto}),
                m(".descriere", [
                    m("h5", data.localitate + ", " + data.pret + " Euro"),
                    m("span", data.descriere),
                ]),

                m(CardUtilizator),

                m("button.btn", {type:"button", onclick:() => {
                    document.querySelector("form").classList.remove("none");
                    document.querySelector("section").classList.remove("none");
                    document.querySelector("#show-more").classList.remove("none");
                    document.querySelector("#descriere-anunt").classList.add("none");
                    document.querySelector("main").classList.add("center");
                    window.scrollTo({ top: 70, behavior: 'smooth' });
                }}, "Inapoi la anunturi")
            ]
        }
    }
};



function show_details(data){

    m.mount(document.querySelector("#descriere-anunt"), DescriereCamera(data));

    document.querySelector("#descriere-anunt").classList.remove("none");
    document.querySelector("form").classList.add("none");
    document.querySelector("section").classList.add("none");
    document.querySelector("#show-more").classList.add("none");
    window.scrollTo({ top: 70, behavior: 'smooth' });
 
}



const Camera = {
    view: vnode => {

        let title = vnode.attrs.camera.localitate + ", " + vnode.attrs.camera.pret + " Euro";

        return m(".anunt", {id:vnode.attrs.id}, [
            m("img.foto-camera", {src:vnode.attrs.camera.foto, 
                                alt:title,
                                onclick: event => fullscreen_image(event)}
                                ),
            m("span.title", {onclick: _ => show_details(vnode.attrs) }, title)
        ])
    }
};


const Anunturi = {
    view: vnode => {
        return m("section.anunturi.mb-2", [
            vnode.attrs.listings ? vnode.attrs.listings.map(obj => {
                return m(Camera, obj) 
            }) : toast("Se incarca anunturile...", true, 1000)
        ])
    }
};


const Listings =  {
    listings: [],
    get_listings: async (form_el) => {

            document.getElementById("show-more").classList.remove("hide");
            
            if (form_el !== undefined) {
                console.log(form_el.target.type);
                if (form_el.target.type !== "button") {
                    Listings.listings = []; 
                }
            }
            
            let form_data = {localitate:document.getElementById("localitate").value, 
                            buget:document.getElementById("buget").value, 
                            optiune:document.getElementById("optiune").value};
            
            let objectlist = await get_data(form_data);   
            Listings.listings = Listings.listings.concat(objectlist);
        
            m.redraw();

        },
    oncreate: () => {
            prep$4();
            if (Listings.listings !== []) {
                Listings.get_listings();
            }
        },
    onremove: () => {
        Listings.listings = [];
    },
    view: _ => {
        return [m(FormAnunturi, {get_listings:Listings.get_listings}),
                m(Anunturi, {listings: Listings.listings}),
                m("button.btn#show-more", {type:"button", onclick:Listings.get_listings}, "Arata mai multe"),
                m(ModalImage),
                m("#descriere-anunt")
            ]
        }
};


// https://tinyurl.com/y9zkw4ev
// https://flems.io/#0=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-JUMwDKC4bxcBQNMQFGhFA0REN-aQnQpBoEeM8N4vxsB3mBOzF4u7v4AAFuS0CEGiG9sY90cCHguHQYL7qKDIPObAxgGzKCAA

let VeziAnunturi = Listings;const IesiDinCont = {
    oninit: async () => {
        await firebase.auth().signOut();
        toast("Ai iesit din cont!");
        m.route.set("/");
    },
    oncreate: close_menu,
    view: () => {
        return m("h4", "Ai iesit din cont!")
    }
};const PoliticaCookies = {
    view: () => {
        return m("h1", "PoliticaCookies")
    }
};const PoliticaDeConfidentialitate = {
    view: () => {
        return m("h1", "PoliticaDeConfidentialitate")
    }
};const TermeniSiConditii = {
    view: () => {
        return [
            m("h1", "TermeniSiConditii"),
            m("p", {style:"color:red;background:white;padding:4rem;"}, "Acest website e facut doar in scop demonstrativ. Nu incarcati date sensibile!")
        ]
    }
};const RaporteazaProblema = {
    view: () => {
        return m("h1", "RaporteazaProblema")
    }
};const Contact = {
    view: () => {
        return m("h1", "Contact")
    }
};function check_form(form_data){

    if (form_data.pass1 !== form_data.pass2) {
        throw "Parolele nu sunt identice!"
    }
    else if (form_data.pass1.length < 6) {
        throw "Parola trebuie sa fie mai mare de 6 caractere!"
    } 
}


async function creeaza_cont(event){
    event.preventDefault();

    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);
    // console.log(form_data)

    freeze_form(event.target);

    try {

        check_form(form_data);
        // Add firebase
        let email = form_data.email;
        let password = form_data.pass1;
        
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        await firebase.auth().signInWithEmailAndPassword(email, password);
        await firebase.auth().currentUser.sendEmailVerification();

        toast("Verifica emailul pentru a valida contul!", true, 6000);

        await firebase.firestore().collection('user').add({
            nume: name_from_email(email),
            buget: 100,
            localitate: "Oriunde",
            telefon: "",
            email: email,
            foto: ""
        });

        unfreeze_form(event.target);
        m.route.set("/cont-utilizator");
        
    } 
    catch (error) {

        console.error(error);

        unfreeze_form(event.target);

        if (typeof(error) === typeof("string")){
            toast(error, false, 8000);
        }
        else {
            if (error.message.includes("already in use")) {
                toast("Emailul este folosit. Ti-ai uitat parola!", false, 8000);
            }
            else {
                toast(error.message, false, 8000);
            }
            
        }
    }     
}


function prep$5(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").className = "center";
    document.querySelector("title").innerText = "Creeaza un cont";
    close_menu();
}


const CreeazaUnCont = {
    oninit: async () => {
        if (await firebase.auth().currentUser){
            return m.route.set("/cont-utilizator")
        }
    },
    oncreate: prep$5,
    view: () => {

        return m("form", {onsubmit: ev => {creeaza_cont(ev);}}, [
            m(".input", [
                m("label", {for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),
    
            m(".input", [
                m("label", {for:"pass1"}, "Parola"),
                m("input", {type:"password", name:"pass1", id:"pass1", required:"required"})
            ]),
    
            m(".input", [
                m("label", {for:"pass2"}, "Confirma parola"),
                m("input", {type:"password", name:"pass2", id:"pass2", required:"required"})
            ]),
    
            m("button", {type:"submit", class:"btn dark-green"}, "Creaaza cont"),
    
            m(".helpers", [
                m("a", {href:"#!/intra-in-cont"}, "Am cont!"),
                m("a", {href:"#!/reseteaza-parola"}, "Am uitat parola!")
            ])
    
        ])            
    }
};async function reseteaza_cont(event) {
    event.preventDefault();
    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);
    console.log(form_data);

    try {

        freeze_form(event.target);
        await firebase.auth().sendPasswordResetEmail(form_data.email);
        toast("Ti-am trimis un email de resetare parola!");  
        unfreeze_form();
        m.route.set("/home");      
        
    } catch (error) {
        unfreeze_form();
        // console.error(error)
        toast("Ceva s-a intamplat..incearca mai tarziu.", false, 8000);
    }
}


const ReseteazaParola = {
    view: () => {
        return m("form", {onsubmit: ev => {reseteaza_cont(ev);}}, [
            m(".input", [
                m("label", {for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),
            m("button", {type:"submit", class:"btn dark-green"}, "Reseteaza parola")
        ])
    }
};function prep$6(){
    document.querySelector("main").removeAttribute("class");
    document.body.className = "light-green blocuri";
    document.querySelector("title").innerText = "Detalii camera";
    close_menu();
}



const Camera$1 = {
    oninit: vnode => {

        vnode.state.data = { foto: "./static/svg/1.jpg",
                            
                            descriere: `Avem o camera libera intr-un apartament 
                            cu 3 camere, zona este linistita, magazin 
                            aproape, cautam o persoana care sa stea
                            pe o perioada de minim un an.
                            Pentru alte detalii ma puteti contacta
                            raspun la telefon dupa ora 6.`,

                            titlu: "Iasi, buget 200E",
                            
                            };
    },

    oncreate: prep$6,
    view: vnode => {
        return m("div.center", [
            m("img.responsive-img", {src:vnode.state.data.foto, alt:"Foto camera"}),
            m("div.descriere", [
                m("h6", vnode.state.data.titlu),
                m("span", vnode.state.data.descriere)
            ])
        ])
        
    }
};



const CardUtilizator$1 = {
    oninit: vnode => {
        vnode.state.data = { user_foto: "./static/svg/ca.jpg",
                            displayName: "Climente Alin",
                            interes: "Iasi, buget 200E",
                            telefon: "0724242424",
                            email: "climente.alin@gmail.com"
                    };
    },
    oncreate: prep$6,
    view: vnode => {
        return m("section.user", [
            m("img", {src:vnode.state.data.user_foto}),
            m("h6", vnode.state.data.displayName),
            m("span", vnode.state.data.interes),
            m("span", vnode.state.data.telefon),
            m("span", vnode.state.data.email),
            // m("a", {href:"#!/actualizeaza-cont", 
            //         class:"btn moderate-purple"}, "Actualizeaza contul")
        ])
    }
};



const DetaliiCamera = {
    view: () => {
        return m("div.center", {style:"margin-top:1rem;"},[
            m(Camera$1),
            m(CardUtilizator$1)
        ])
    }
};function prep$7(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").removeAttribute("class");
    document.querySelector("title").innerText = "Actualizeaza cont";
    close_menu();
}


async function sterge_contul() {

    try {

        await firebase.auth().currentUser.delete();
        toast("Contul tau a fost sters!");
        m.route.set("/");

    } catch (error) {
        await firebase.auth().signOut();
        toast("Operatie nereusita! Intra in cont si incearca din nou..", false, 8000);
        m.route.set("/intra-in-cont");
    }

}

async function actualizeaza_cont(event){

    event.preventDefault();

    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);
    
    console.log(form_data);

    try {

        freeze_form(event.target);

        let storageRef = await firebase.storage().ref();
        let path = `/userImage/${firebase.auth().currentUser.email}/${form_data.foto.name}`;
        let snapshot = await storageRef.child(path).put(form_data.foto);
        let fotourl = await snapshot.ref.getDownloadURL();

        let db = firebase.firestore();
     
        firebase.auth().onAuthStateChanged(async user => {
            
            if (user) {

                let qsnap = await db.collection("user").where("email", "==", user.email).get();

                try {
                    qsnap.forEach(async doc => {
                        await db.collection("user").doc(doc.id)
                        .update({
                            nume: form_data.nume,
                            buget: form_data.buget,
                            localitate: form_data.localitate,
                            telefon: form_data.telefon,
                            foto: fotourl
                        });
                    });

                    toast("Datele au fost actualizate!");
                    
                } catch (error) {
                    toast("Nu am putut actualiza datele!", false, 5000);
                }
                
            }
        });
                
        m.route.set("/cont-utilizator");

    } catch (error) {
        console.error(error);
        toast(error.message, false, 8000);
        unfreeze_form(event.target);
    }
    
}


const ActualizeazaCont = {
    oninit: async () => {
        if (!(await firebase.auth().currentUser)){
            toast("Trebuie sa fi logat pentru a putea actualiza contul.", false);
            return m.route.set("/intra-in-cont")
        }
    },
    oncreate: prep$7,
    view: () => {

        return m("div.center", [

            m("form", {onsubmit: ev => {actualizeaza_cont(ev);}}, [
            
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
};const Error404 = {
    view: () => {
        return m("h4.red.white-text", 
        {style:"padding:2rem;border-radius:20px;"},
        "Pagina nu a putut fi gasita..")
    }
};// Initialize firebase
if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
var firebaseConfig = {
  "projectId": "cameredeinchiriat-b7885",
  "appId": "1:841749487216:web:602b8e01ac6561aad4deb5",
  "databaseURL": "https://cameredeinchiriat-b7885.firebaseio.com",
  "storageBucket": "cameredeinchiriat-b7885.appspot.com",
  "locationId": "europe-west6",
  "apiKey": "AIzaSyA4oEHfBeM_8mmYXDiaao01eIHkdfmuIr0",
  "authDomain": "cameredeinchiriat-b7885.firebaseapp.com",
  "messagingSenderId": "841749487216",
  "measurementId": "G-2961KQZJFR"
};
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);
}




const header = document.querySelector("header"); 
const main = document.querySelector("main");
const footer = document.querySelector("footer");


// Static components
m.render(header, m(Nav));
m.render(footer, m(Footer));


// Main contect changed based on route
m.route(main, "/", {
    "/": Home,
    "/intra-in-cont": IntraInCont,
    "/intra-in-cont/:adauga_camera": IntraInCont,
    "/adauga-camera": AdaugaCamera,
    "/vezi-anunturi": VeziAnunturi,
    "/cauta-coleg/:localitate/:buget": VeziAnunturi,
    "/cauta-camera/:localitate/:buget": VeziAnunturi,
    "/iesi-din-cont": IesiDinCont,
    "/politica-cookies": PoliticaCookies,
    "/politica-de-confidentialitate": PoliticaDeConfidentialitate,
    "/termeni-si-conditii": TermeniSiConditii,
    "/raporteaza-problema": RaporteazaProblema,
    "/contact": Contact,
    "/creeaza-un-cont": CreeazaUnCont, 
    "/reseteaza-parola": ReseteazaParola, 
    "/cont-utilizator": ContUtilizator,
    "/actualizeaza-cont": ActualizeazaCont,
    "/detalii-camera/:id_camera": DetaliiCamera, 

    "/:404...": Error404

});}());