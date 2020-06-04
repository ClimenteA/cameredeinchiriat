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
                    m("li", m("a", {href:"#!/cauta-camera"}, "Cauta camera")),
                    m("li", m("a", {href:"#!/cauta-coleg"}, "Cauta coleg")),
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
};const type_motive = _ => {

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
    document.querySelector("main").className = "";
    close_menu();
    type_motive();
}


const Home = {
    oncreate: prep,
    view: () => {
        return m("section", {class:"mt-4"}, [
            m("a", {href:"#!/cauta-camera", class:"btn heavy-purple large"}, "Cauta o camera"),
            m("h1", {class:"erica-font flow-text"}, m.trust(`Imparte chiria si pastreaza banii 
            <br> pentru <span id="motive">vacante</span>`))
        ])
    }
};const AdaugaCamera = {
    oncreate: close_menu,
    view: () => {
        return m("h1", "Adauga o camera")
    }
};// HACK to trigger firebase auth
async function callFirebaseAuth(){
    await firebase.auth().currentUser;
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
}async function intra_in_cont(event){
    event.preventDefault();

    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);
    // console.log(form_data)

    freeze_form(event.target);

    try {

        await firebase.auth().signInWithEmailAndPassword(form_data.email, form_data.pass1);
        m.route.set("/cont-utilizator");
    } 
    catch (error) {

        if ("message" in error){
            if (error.message.includes("password is invalid")){
                toast("Emailul sau parola gresite!", false, 8000);
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


function prep$1(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").className = "center";
    close_menu();
}



const IntraInCont = {
    oninit: async () => {
        if (await firebase.auth().currentUser){
            return m.route.set("/cont-utilizator")
        }
    },
    oncreate: prep$1,
    view: () => {
        return m("form", {onsubmit: ev => {intra_in_cont(ev);}}, [
            m(".input", [
                m("label", {class:"white-text", for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),

            m(".input", [
                m("label", {class:"white-text", for:"pass1"}, "Parola"),
                m("input", {type:"password", name:"pass1", id:"pass1", required:"required"})
            ]),

            m("button", {type:"submit", class:"btn dark-green"}, "Intra in cont"),

            m(".helpers", [
                m("a", {href:"#!/creeaza-un-cont"}, "Nu am cont!"),
                m("a", {href:"#!/reseteaza-parola"}, "Am uitat parola!")
            ])
        ])
    }
};function toggle_cauta(){

    try {
        let camera = document.getElementById("camera_check");
        let camera_val = document.getElementById("camera");
        let btn = document.getElementById("camera_coleg");

        camera.addEventListener("change", event => {
            if (camera.checked) {
                // console.log("coleg: ", camera.checked)
                camera_val.value = "coleg";
                btn.innerText = "Cauta coleg";
            } else {
                // console.log("camera: ", camera.checked)
                camera_val.value = "camera";
                btn.innerText = "Cauta camera";
            }    
        });
        
    } catch (error) {
        // console.error(error)   
    }
}


function prep$2(){
    document.body.className = "light-green blocuri";
    document.querySelector("main").className = "center";
    close_menu();
}



function cauta_camera(event){
    event.preventDefault();

    let form_data = new FormData(event.target);
    form_data = Object.fromEntries(form_data);
    console.log(form_data);

    freeze_form(event.target);

}



const CautaCamera = {
    oninit: vnode => {
        console.log(vnode.attrs);
    },
    oncreate: prep$2,
    view: () => {
        return m("form", {onsubmit:ev=>{cauta_camera(ev);}}, [
            m(".input", [
                m("label", {class:"white-text", for:"localitate"}, "Localitate"),
                m("input", {type:"text", name:"localitate", id:"localitate"})
            ]),

            m(".input", [
                m("label", {class:"white-text", for:"buget"}, "Buget"),
                m("input", {type:"tel", name:"buget", id:"buget"})
            ]),

            m("input", {type:"hidden", name:"camera", id:"camera", value:"camera"}),

            m("button", {type:"submit", class:"btn large heavy-purple", id:"camera_coleg"}, "Cauta camera"),
            
            m(".mt-2", [
                m(".switch", [
                    m("label", {onclick:toggle_cauta}, [
                        m("span.light-green-text", {style:"margin-right:8px;"}, "Camera"),
                        m("span", [
                            m("input", {type:"checkbox", id:"camera_check"}),
                            m("span.lever")
                        ]),
                        m("span.light-purple-text", {style:"margin-left:-1px"}, "Coleg")
                    ])
                ])
            ])

        ])
    }
};const CautaColeg = {
    oncreate: close_menu,
    view: () => {
        return m("h1", "Cauta un coleg")
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
        return m("h1", "TermeniSiConditii")
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
        await firebase.auth().currentUser.updateProfile({
            displayName: name_from_email(email) + '|' + '100',
        });

        await firebase.auth().currentUser.sendEmailVerification();
        toast("Verifica emailul pentru a valida contul!", true, 6000);
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


function prep$3(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").className = "center";
    close_menu();
}


const CreeazaUnCont = {
    oninit: async () => {
        if (await firebase.auth().currentUser){
            return m.route.set("/cont-utilizator")
        }
    },
    oncreate: prep$3,
    view: () => {

        return m("form", {onsubmit: ev => {creeaza_cont(ev);}}, [
            m(".input", [
                m("label", {class:"white-text", for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),
    
            m(".input", [
                m("label", {class:"white-text", for:"pass1"}, "Parola"),
                m("input", {type:"password", name:"pass1", id:"pass1", required:"required"})
            ]),
    
            m(".input", [
                m("label", {class:"white-text", for:"pass2"}, "Confirma parola"),
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
                m("label", {class:"white-text", for:"email"}, "Email"),
                m("input", {type:"email", name:"email", id:"email", required:"required"})
            ]),
            m("button", {type:"submit", class:"btn dark-green"}, "Reseteaza parola")
        ])
    }
};function prep$4(){
    document.querySelector("main").removeAttribute("class");
    document.body.className = "light-green blocuri";
    close_menu();
}


const CardUtilizator = {
    oninit: vnode => {
        vnode.state.data = { user_foto: "./static/svg/ca.jpg",
                            displayName: "Climente Alin",
                            interes: "Iasi, buget 200E",
                            telefon: "0724242424",
                            email: "climente.alin@gmail.com"
                    };
    },
    oncreate: prep$4,
    view: vnode => {
        return m("section.user", [
            m("img", {src:vnode.state.data.user_foto}),
            m("h6", vnode.state.data.displayName),
            m("span", vnode.state.data.interes),
            m("span", vnode.state.data.telefon),
            m("span", vnode.state.data.email),
            m("a", {href:"#!/actualizeaza-cont", 
                    class:"btn moderate-purple"}, "Actualizeaza contul")
        ])
    }
};


const AnunturiPostate = {
    oninit: vnode => {
        vnode.state.data = [ {title:"Iasi, buget 120Euro", 
                              id_camera:"123212"},
                            {title:"Iasi, buget 50Euro", 
                              id_camera:"124444"}
                            ];
    },
    view: vnode => {
        return m("section.camere-postate", [
            m("h6", "Camere postate"),
            m("ul", vnode.state.data.map(anunt => {
                return m("li", [
                    m("a", {href:`#!/detalii-camera/${anunt.id_camera}`}, anunt.title)
                ])
            }))
        ])
    }
};


const ContUtilizator = {
    view: () => {
        return m("div.center", [
            m(CardUtilizator),
            m(AnunturiPostate)
        ])
    }
};const Camera = {
    view: vnode => {
        return m("h4", "Anuntul id: " + vnode.attrs.id_camera)
    }
};const Coleg = {
    view: () => {
        return m("h1", "Coleg")
    }
};function prep$5(){
    document.body.className = "light-purple blocuri";
    document.querySelector("main").className = "center";
    close_menu();
}

const ActualizeazaCont = {
    oncreate: prep$5,
    view: () => {
        return m("h1", "ActualizeazaCont")
    }
};const Error404 = {
    view: () => {
        return m("h4.red.white-text", 
        {style:"padding:2rem;border-radius:20px;"},
        "Pagina nu a putut fi gasita..")
    }
};const header = document.querySelector("header"); 
const main = document.querySelector("main");
const footer = document.querySelector("footer");


// Static components
m.mount(header, Nav);
m.mount(footer, Footer);



// Main contect changed based on route
m.route(main, "/", {
    "/": Home,
    "/intra-in-cont": IntraInCont,
    "/adauga-camera": AdaugaCamera,
    "/cauta-coleg": CautaColeg,
    "/cauta-camera": CautaCamera,
    "/cauta-coleg/:localitate/:buget": CautaColeg,
    "/cauta-camera/:localitate/:buget": CautaCamera,
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
    "/detalii-coleg/:id_coleg": Coleg,
    "/detalii-camera/:id_camera": Camera, 

    "/:404...": Error404

});}());