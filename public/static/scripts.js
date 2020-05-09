"use strict"

const form_creaza_cont = `
<form id="creeaza-cont"> 

    <h3>Creeaza un cont</h3>
    <hr>

    <label for="email">Email:</label>
    <input type="email" name="email" id="email">

    <label for="pass">Parola:</label>
    <input type="password" name="pass" id="pass">

    <label for="pass1">Confirma parola:</label>
    <input type="password" name="pass1" id="pass1">

    <button type="submit">Creeaza un cont</button>

    <div class="grey-text">
        <a href="#" id="mi-am-uitat-parola">Mi-am uitat parola!</a>
    </div>

</form>
`

const form_intra_in_cont = `
<form id="intra-in-cont">

    <h3>Intra in cont</h3>
    <hr>

    <label for="email">Email:</label>
    <input type="email" name="email" id="email">

    <label for="email">Parola:</label>
    <input type="password" name="pass" id="pass">

    <button type="submit">Intra in cont</button>

    <div class="grey-text">
        <a href="#" id="nu-am-cont">Nu am cont!</a>
        <a href="#" class="ml-4" id="mi-am-uitat-parola">Mi-am uitat parola!</a>
    </div>

</form>
`

const form_reseteaza_parola = `
<form id="reseteaza-parola">
    
    <h3>Reseteaza parola</h3>
    <hr>

    <label for="email">Email:</label>
    <input type="email" name="email" id="email">

    <button type="submit">Reseteaza parola</button>

</form>
`

const form_adauga_anunt = `
<form autocomplete="off" id="adauga-camera-de-inchiriat">
    <h3>Adauga o camera de inchiriat</h3>
    <hr>

    <label for="Localitate">Localitate:</label>
    <input type="text" list="localitati" name="Localitate" id="Localitate">

    <datalist id="localitati">
        <option value="Bucuresti">
        <option value="Cluj">
        <option value="Iasi">
        <option value="Timisoara">
        <option value="Brasov">
    </datalist>

    <label for="Zona">Zona:</label>
    <input type="text" name="Zona" id="Zona">

    <label for="Pret">Pret:</label>
    <input type="tel" name="Pret" id="Pret">

    <label for="Descriere">Descriere:</label>
    <textarea name="Descriere" id="Descriere" cols="30" rows="4"> 
    </textarea>

    
    <label for="foto">Adauga o fotografie:</label>
    <input type="file" id="foto" name="foto" accept="image/*">

    <label for="Mobilat">Mobilat complet:</label>
    <input type="text" name="Mobilat" id="Mobilat" value="Da">
    <span>*Da daca are cel putin un dulap, o masa, 
    un scaun si cate un pat sau canapea in fiecare camera.
    Daca nu atunci specifica ce lipseste.
    </span>

    <label for="Electrocasnice">Electrocasnice de baza:</label>
    <input type="text" name="Electrocasnice" id="Electrocasnice" value="Da">
    <span>
    *Da daca are cel putin masina de spalat si aragaz. 
    Daca nu atunci specifica ce lipseste.
    </span>

    <label for="Racordari">Racordari de baza:</label>
    <input type="text" name="Racordari" id="Racordari" value="Da">
    <span>
    *Da daca este racordat la energie electrica, 
    apa curenta, gaz, canalizare, internet, cablu tv. 
    Daca nu atunci specifica ce lipseste.
    </span>

    <label for="Transport">Transport in comun:</label>
    <input type="text" name="Transport" id="Transport" value="Da">
    <span>
    *Da daca o statie de transport in comun 
    se afla la o distanta de  max.  500 metri fata de locuinta.
    Daca nu specifica distanta aproximativa.
    </span>

    <label for="Magazin">Magazin alimentar in apropiere:</label>
    <input type="text" name="Magazin" id="Magazin" value="Da">
    <span>
    *Da daca magazinul alimentar 
    se afla la o distanta de max. 500 metri fata de locuinta.
    Daca nu specifica distanta aproximativa.
    </span>

    <button type="submit">Adauga anunt</button>

</form>

`

const pagina_utilizator = (user_data) => {
    return `
    <div class="boxed form">
        <img class="avatar" src="${user_data['fotoUrl']}" alt="img">
        <h4>${user_data['nume']}</h4>
        <span>${user_data['localitate']}, buget ${user_data['buget']}&euro;</span>
        <span>&#128241; ${user_data['tel']}</span>
        <span>&#128231; ${user_data['email']}</span>
    </div>    
    
    <button class="grey mt-2 mb-2" id="iesi-din-cont">Iesi din cont</button>
    
    <div class="boxed form">
        <h4>Anunturi active</h4>
        <ul id="anunturi-active">
            <li>Camera in ${user_data['anunt']}&euro; <span title="sterge anuntul" class="hand red-text p-2">X</span></li>
        </ul>
    </div>
    
    <button class="mt-2" id="actualizeaza-datele">Actualizeaza datele</button>
    <button class="red mt-2 " id="sterge-contul">Sterge contul</button>
    `    
} 


const form_actualizare_cont = `
<form autocomplete="off">

    <h3>Actualizeaza datele personale</h3>
    <hr>

    <label for="Nume">Nume prenume:</label>
    <input type="text" name="Nume" id="Nume">

    <label for="caut-ofer-in-localitatea">Caut/Ofer in localitatea:</label>
    <input type="text" name="caut-ofer-in-localitatea" id="caut-ofer-in-localitatea">

    <label for="Buget">Buget:</label>
    <input type="tel" name="Buget" id="Buget">

    <label for="Telefon">Telefon:</label>
    <input type="tel" name="Telefon" id="Telefon">

    <label for="Email">Email:</label>
    <input type="email" name="Email" id="Email">

    <label for="profil">Adauga o poza de profil:</label>
    <input type="file" id="profil" name="profil" accept="image/*">

    <button type="submit">Actualizeaza datele</button>

</form>
`


const form_sterge_cont = `
<form id="sterge-cont">
    
    <h3>Sterge contul</h3>
    <hr>

    <label for="email">Confirma emailul:</label>
    <input type="email" name="email" id="email">

    <button type="submit">Sterge contul</button>

</form>
`


//pgrep "ng serve" - stop a running node server
        

// const db = firebase.firestore()

// db.collection("users").add({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id)
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error)
// })



const toast = (message, bg="rgb(56, 56, 56)", color="white", ms="30000") => {

    if (bg == "error") {
        bg = "rgb(211, 88, 88)"
    } 
    else if (bg == "success") {
        bg = "rgb(86, 165, 86)"
    }  

    let div = document.createElement("div")
    div.innerHTML = message 
    div.style.height = "40px"
    div.style.lineHeight = "40px"
    div.style.paddingLeft = "1rem"
    div.style.color = color
    div.style.background = bg
    div.style.cursor = "pointer"
    div.style.borderBottom = "1px solid grey"
    div.setAttribute("title", "sterge")
    
    window.scrollTo({ top: 0, behavior: 'smooth' })

    document.querySelector("header").appendChild(div)

    div.addEventListener("click", (event) => {
        event.target.remove()
    })

    setTimeout(() => {
        div.remove()
    }, ms)

}



const cont = document.getElementById("intra-in-cont")
const main = document.querySelector("main")


//Adauga un anunt

document.getElementById("adauga-camera")
.addEventListener('click', (event) => {
    event.preventDefault()

    if (firebase.auth().currentUser == null) {
        console.warn("Trebuie sa te loghezi pentru a adauga un anunt!")
        toast("Trebuie sa te loghezi pentru a adauga un anunt!", "error")
        auth_render(render_adauga_anunt)
    } else {
        render_adauga_anunt()
    }
})


const render_adauga_anunt = () => {
    if (firebase.auth().currentUser.emailVerified) {
        main.innerHTML = form_adauga_anunt
        document.querySelector("h3").scrollIntoView()
        document.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault() 
            const form_data = new FormData(event.target)
            const form_obj = Object.fromEntries(form_data)
            console.log(form_obj)

            console.log(form_obj["foto"].name)
            
            let canvas = document.createElement('canvas')
        
            pica.resize(form_obj["foto"], canvas).then((img_shrinked) => {
                console.info("Image shrinked!")
                form_obj["foto"] = img_shrinked
                console.log(form_obj)
            })

        })

    } else {
        toast("Confirma adresa ta de email inainte de a posta un anunt!")
        render_anunturi()
    }
    
}


const render_anunturi = () => {
    main.innerHTML = "<h1>Lista Anunturi</h1>"
    window.scrollTo({ top: 0, behavior: 'smooth' })
}



//Auth 

const name_from_email = (email) => {
    // var name = firebase.auth().currentUser.email.split("@")[0]
    var name = email.split("@")[0]
    var name = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
    var name = name.replace(/\s{2,}/g," ")
    return name 
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user != null) {
        cont.innerText = name_from_email()
    } else {
        cont.innerText = "INTRA DIN CONT"
    }
})


const iesi_din_cont = () => {

    document.getElementById("iesi-din-cont").addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            console.info("Delogare reusita!")
            toast("Ai iesit din cont!")
            cont.innerText = "INTRA IN CONT"
            auth_render(render_cont)
        }).catch((error) => {
            console.error("Delogare nereusita!", error.message)
            toast("Delogare nereusita!", "error")
        })

    })
}




cont.addEventListener('click', (event) => {
    event.preventDefault()

    if (cont.innerText != "INTRA DIN CONT") {
        console.info("Redare pagina utilizator")

        let user_data = {
            'fotoUrl': '',
            'nume': '',
            'localitate': '',
            'buget': '',
            'tel': '',
            'email': '',
            'anunt': ''
        }

        main.innerHTML = pagina_utilizator(user_data)

        iesi_din_cont()




//Update user profil

// const storage = firebase.storage()


// // Updates the user attributes:
firebase.auth().currentUser.updateProfile({
    displayName: "Climente Alin",
    // photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then(function() {
    // Profile updated successfully!
    // "Jane Q. User"
    var displayName = user.displayName
    console.info("Nume schimbat: ", displayName)
    // "https://example.com/jane-q-user/profile.jpg"
    // var photoURL = user.photoURL;
  }, function(error) {
    // An error happened.
    console.error(error.message)
  })


    } else {
        auth_render(render_anunturi)
    }

})


const auth_render = (template) => {
    render_cont(template)
    render_nu_am_cont(template)
    render_am_uitat_parola(template)
}


const render_cont = (template) => {
    main.innerHTML = form_intra_in_cont
    document.querySelector("h3").scrollIntoView()
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault() 

        const form_data = new FormData(event.target)
        let email = form_data.get("email")
        let password = form_data.get("pass")
        
        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            template()
        })
        .catch(function(error) {
            console.error(error.message)
            toast("Email sau parola gresite!", "error")
        })
      
    })
}


const render_nu_am_cont = () => {
    document.getElementById("nu-am-cont").addEventListener("click", (event) => {
        event.preventDefault()

        main.innerHTML = form_creaza_cont
        document.querySelector("h3").scrollIntoView()

        render_am_uitat_parola()

        document.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault() 

            pass = document.getElementById('pass') 
            pass1 = document.getElementById('pass1') 
            
            if (pass.value == pass1.value) {

                const form_data = new FormData(event.target)
                let email = form_data.get("email")
                let password = form_data.get("pass")

                firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {

                    main.innerHTML = ""
                    window.scrollTo({ top: 0, behavior: 'smooth' })
            
                    firebase.auth().currentUser.sendEmailVerification()
                    .then(function() {
                        toast("Ti-am trimis un email de verificare cont!")
                    }).catch(function(error) {
                        console.error(error.message)
                        toast("Nu am putut trimite emailul de verificare", "error")
                    })

                })
                .catch(function(error) {
                    console.error(error.message)
                    toast("Date introduse incorecte sau emailul este inregistrat!", "error")
                })

            } else {
                toast("Parolele nu sunt la fel!", "error")
            }

        })
    })
}


const render_am_uitat_parola = () => {
    document.getElementById("mi-am-uitat-parola").addEventListener("click", () => {
        event.preventDefault()
        main.innerHTML = form_reseteaza_parola
        document.querySelector("h3").scrollIntoView()

        document.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault() 
            
            const form_data = new FormData(event.target)
            let email = form_data.get("email")

            firebase.auth()
            .sendPasswordResetEmail(email)
            .then(function() {
                console.info("Email de resetare parola trimis!")
                toast("Email de resetare parola trimis!")
                main.innerHTML = ""
                window.scrollTo({ top: 0, behavior: 'smooth' })

              })
              .catch(function(error) {
                console.error(error.message)
                toast("Email de resetare nu a putut fi trimis!", "error")
              })

        })
    })
}


