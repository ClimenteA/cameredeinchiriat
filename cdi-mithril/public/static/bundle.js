(function(){'use strict';const logo_path = "./static/svg/logo.svg";
const menu_path = "./static/svg/menu.svg";
const close_path = "./static/svg/close.svg";

function show_menu() {
    let menu_container = document.querySelector("#menu-content");
    menu_container.className = "menu-expanded show";
    document.querySelector("#menu").style.display = "none";
}

function close_menu() {
    let menu_container = document.querySelector("#menu-content");
    menu_container.className = "menu-expanded hide";
    document.querySelector("#menu").style.display = "block";
}


const Nav = {
    view: () => {
        return m("div", [

            m("nav", [
                m("a", {href:"#!/"}, [
                    m("img", {class:"logo", src:logo_path, alt:"camere de inchiriat"}),
                ]),

                m("img", {id:"menu", class:"menu", src:menu_path, alt:"menu", onclick:show_menu}),

            ]),

            m("div", {class:"menu-expanded hide", id:"menu-content"}, [
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
};// HACK to trigger firebase auth
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


function clean_str(str) {
    str = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    str = str.replace(/\s+/g,' ').trim();
    return str
}



function parse_query_data(ref_data){   

    let datali = [];
    ref_data.forEach(res => {
        let data = {id:res.id, ...res.data()};
        datali.push(data);
    });

    return datali
}


async function get_user_data(email=undefined) {

    if (email === undefined) {
        email = await firebase.auth().currentUser.email;
    }

    let query_data = await firebase.firestore()
                        .collection("user")
                        .where("email", "==", email)
                        .get();
    
    let user_data = parse_query_data(query_data);
    
    return user_data[0]
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
}


const Home = {
    oncreate: prep,
    view: () => {
        return m("section", {class:"mt-4"}, [
            m("a", {href:"#!/vezi-anunturi", class:"btn heavy-purple large", style:"height:20px;"}, "Cauta o camera"),
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
        form_data.buget = Number(form_data.buget.trim());

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
                m("label", {for:"buget"}, "Pret pe luna"),
                m("input", {type:"tel", name:"buget", id:"buget", required:"required"})
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
    oninit: () => {
        
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                return m.route.set("/cont-utilizator")
            }
        });
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
};const CardUtilizator = {
    
    view: v => {
        
        let title = v.attrs.localitate + ", " + "buget " + v.attrs.buget + " Euro";
        
        if (!v.attrs.foto) { v.attrs.foto = "./static/svg/skull.svg"; }

        return m("section.user.dark-grey", [
            m("img", {src:v.attrs.foto}),
            m("h6", v.attrs.nume),
            m("span", title),
            m("span", v.attrs.telefon),
            m("span", v.attrs.email)
        ])
    }        
};// Model

let items_per_page = 10;

let store; 

function default_store(){
    store = {
        camera: true,
        form_data: {localitate: "", buget: "", optiune: "camera"}, 
        last_ref: undefined,
        items: undefined,
        reached_end: false
    }; 
}

default_store();


// Controller

function prep$3(){
    document.body.className = "light-green blocuri";
    document.querySelector("main").className = "center";
    document.querySelector("title").innerText = "Cauta camera";
    close_menu();
}

function process_option(){
    try {
        let optiune = document.getElementById("optiune");
        let btn = document.getElementById("cauta");
        btn.innerText = "Cauta " + optiune.value;
        document.querySelector("title").innerText = "Cauta " + optiune.value;

        if (optiune.value === "camera") { store.camera = true; } 
        else { store.camera = false; }
        
        store.last_ref = undefined;
        store.items = undefined;

        console.log("option changed: ", store);

        document.getElementById("cauta").click(); 

        enable_show_more_btn();

    } catch (error) {
        // console.error(error)   
    }
}


function store_form_data(event){
    let form = new FormData(event.target); 
    let form_data = Object.fromEntries(form);

    if (form_data !== store.form_data) {
        default_store();
        store.form_data = form_data; 
    } 
    
}

function get_collection(){

    let ref = firebase.firestore();
    
    if (store.form_data.optiune === "camera") {
        ref = ref.collection("listing");
    } else if (store.form_data.optiune === "coleg") {
        ref = ref.collection("user");
    }
    return ref
}


function build_query(){
    
    let ref = get_collection();

    let localitate = store.form_data.localitate;
    let buget      = Number(store.form_data.buget);

    console.info("Filters: ", localitate, buget);
    
    // Build query
    if (localitate && buget){   
        console.info("Filtru localitate && buget: ", localitate, buget);
        ref = ref.where("localitate", "in", [localitate]).where("buget", ">=", buget);         
    }
    else if (localitate){
        console.info("Filtru localitate: ", localitate);
        ref = ref.where("localitate", "in", [localitate]);                  
    }
    else if (buget){
        console.info("Filtru buget: ", buget);
        ref = ref.where("buget", ">=", buget);
    }

    // Add limit of items
    if (store.last_ref === undefined) {
        ref = ref.limit(items_per_page);
    } 

    if (buget && store.last_ref !== undefined) {
        console.info("Sort by buget", buget, store.last_ref);
        ref = ref.orderBy("buget")
            .startAfter(store.last_ref)
            .limit(items_per_page);
    }

    else if (store.last_ref !== undefined) {
        console.info("Sort by id", store.last_ref);
        ref = ref.orderBy(firebase.firestore.FieldPath.documentId())
            .startAfter(store.last_ref)
            .limit(items_per_page);    
    }
        
    console.info("Last ref is ", store.last_ref);

    return ref
}



async function execute_query_and_store_items(ref){

    let ref_data = await ref.get();
    m.redraw();

    if (ref_data.empty) {
        toast("Nu mai sunt anunturi", false, 8000);
        // store.items = undefined
        store.last_ref = undefined;
        store.reached_end = true;
        document.getElementById("show-more").disabled = true;
    }
    else {
        store.last_ref = ref_data.docs[ref_data.docs.length-1].id;
        store.reached_end = false;
        document.getElementById("show-more").disabled = false;
        let data = parse_query_data(ref_data);
        if (store.items === undefined) { store.items = data; } 
        else { store.items = store.items.concat(data); }
    }
}


function get_items() {
    let ref = build_query();
    execute_query_and_store_items(ref);
}


function process_form(event){
    event.preventDefault();
    
    store_form_data(event);

    process_option();
    
    document.getElementById("cauta").disabled = true; 
    get_items();
    document.getElementById("cauta").disabled = false;
    
    store.reached_end = false;
    
    console.log("form submited: ", store);

}



async function show_details(data) {

    let user_data = await get_user_data(data.utilizator);

    data = {...{"user_data": user_data}, ...data};

    console.log("show_details data", data);

    m.mount(desc, {view: () => m(DetaliiCamera, data)});
    
    desc.style.display = "grid"; 
    window.scrollTo({ top: 0 });
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
};


const AscundeDescriere = {
    view: () => {
        return m("button.btn.moderate-purple", 
        { onclick: () => {
            desc.style.display = "none";
        }}, 
        "Ascunde detalii")
    }
};


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
};


const Camera = {

    view: v => {

        let title = v.attrs.localitate + ", " + v.attrs.buget + " Euro";

        return m(".anunt", {id:v.attrs.id}, [
            m("img.foto-camera",
            {src:v.attrs.foto, alt:title, 
                onclick: () => show_details(v.attrs) }
            ),
            m("span.title", {onclick: () => show_details(v.attrs) }, title)
        ])
    }
};



const Anunturi = {
    oncreate: get_items,
    view: () => {
        
        console.info("Show Camera ", store.camera);

        return m("section.anunturi.mb-2", [
            store.items ? store.items.map(obj => {
                return store.camera ? m(Camera, obj) : m(CardUtilizator, obj)
            }) : toast("Se incarca anunturile...", true, 1000)
        ])
    }
};


const ShowMore = {
    view: () => {
        
        return m("button.btn#show-more", {type:"button", 
            onclick: event => {        
                    event.target.disabled = true;
                    event.target.style.cursor = "default";
                    get_items();
                    event.target.disabled = false;
                    event.target.style.cursor = "pointer";
                }
        }, "Arata mai multe")
    }
};

let desc;

const Listings = {
    oninit: prep$3,
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
};const IesiDinCont = {
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


function prep$4(){
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
    oncreate: prep$4,
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
};// Model


let store$1 = {
    user_data: undefined,
    anunturi_postate: undefined
};



// Controller


function prep$5(){
    document.querySelector("main").removeAttribute("class");
    document.body.className = "light-green blocuri";
    document.querySelector("title").innerText = "Cont utilizator";
    close_menu();
}


async function anunturi_postate() {
    
    let email;
    
    try {
        email = await firebase.auth().currentUser.email;    
    } catch (error) {
       m.route.set("/intra-in-cont"); 
    }

    let ref = firebase.firestore();
    let query_data = await ref.collection("listing")
                            .where("utilizator", "==", email)
                            .get();

    let data = parse_query_data(query_data);

    console.log("Anunturi postate", data);

    return data

} 



// View


const AnunturiPostate = {
    oncreate: async () => {
        store$1.anunturi_postate = await anunturi_postate();
        m.redraw();
    },
    view: () => {
        return m("section.camere-postate", [
            m("h6", "Camere postate"),
            store$1.anunturi_postate ? m("ul", store$1.anunturi_postate.map(anunt => {
                return m("li", [
                    m("span", "- " + anunt.localitate + " " + anunt.buget + " Euro")
                ]) 
            })) : m("h5", "...")
        ])
    }
};


const ContUtilizator = {
    oncreate: async () => {
        prep$5();
        store$1.user_data = await get_user_data();
        m.redraw();
        console.log(store$1.user_data);
    },
    view: () => {
        
        return m("div.center.user-layout", [
            store$1.user_data ? m(CardUtilizator, store$1.user_data) : m("h1", "..."),
            m(AnunturiPostate),
            m("a", { href:"#!/actualizeaza-cont", class:"btn moderate-purple"}, "Actualizeaza contul")
        ])

    }
};function prep$6(){
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
                            buget: Number(form_data.buget.trim()),
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
        toast("Nu am putut realiza operatia!", false, 8000);
        // toast(error.message, false, 8000)
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
    oncreate: prep$6,
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
};const header = document.querySelector("header"); 
const main   = document.querySelector("main");
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
    "/vezi-anunturi": Listings,
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
  
    "/:404...": Error404

});}());