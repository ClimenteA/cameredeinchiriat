import {
    toast,
    render_template,
} from "./Utils.js"


let templates
export default templates = {

    login: `
    <form method="POST">
    
        <h3>Intra in cont</h3>
        <hr>
    
        <label for="email">Email:</label>
        <input type="email" name="email" id="email">
    
        <label for="email">Parola:</label>
        <input type="password" name="pass" id="pass">
    
        <button type="submit">Intra in cont</button>
    
        <div class="grey-text">
            <a href="#" id="create_account">Nu am cont!</a>
            <a href="#" class="ml-4" id="reset_password">Mi-am uitat parola!</a>
        </div>
    
    </form>
    `,

    register: `
    <form method="POST"> 
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
            <a href="#" id="reset_password">Mi-am uitat parola!</a>
        </div>
    
    </form>
    `,

    user_page: (anunturi_string) => {
        
        let user = firebase.auth().currentUser

        return `
        <div class="boxed form">
            <img class="avatar" src="${user.photoURL}">
            <h4 style="text-transform: capitalize">${user.displayName.split("|")[0]}</h4>
            <span>&#128241; ${user.displayName.split("|")[1]}</span>
            <span>&#128231; ${user.email}</span>
        </div>    
        
        <button class="grey mt-2 mb-2" id="logout">Iesi din cont</button>
        
        <div class="boxed form">
            <h4>Anunturi active</h4>
            <ul id="anunturi-active">
                ${anunturi_string}
            </ul>
        </div>
        
        <button class="mt-2" id="update_account">Actualizeaza datele</button>
        <button class="red mt-2 " id="delete_account">Sterge contul</button>
        `
    },

    pagina_utilizator: () => {

        firebase.firestore().collection("listing")
        .where("UserId", "==", firebase.auth().currentUser.uid)
        .get()
        .then( querySnapshot => {

            let anunturi_utilizator = []
            querySnapshot.forEach( doc => {

                let id = doc.id
                let data = doc.data()

                let li = `<li id="${id}" class="mb-20"><span title="sterge anuntul" class="hand red-text">X</span>
                          Camera in ${data["Localitate"]}-${data["Zona"]} ${data["Pret"]}&euro;</li>` 
                
                anunturi_utilizator.push(li)
            })

            let anunturi_string = anunturi_utilizator.join(" ")

            render_template(templates.user_page(anunturi_string))
    
        })
        .catch(error => {
            console.error(error)
            toast("Momentan nu ai postat nici un anunt.")
        })
    },


    update_account: `
    <form autocomplete="off">
    
        <h3>Actualizeaza datele personale</h3>
        <hr>
    
        <label for="Nume">Nume complet:</label>
        <input type="text" name="displayName" id="Nume">
    
        <label for="Telefon">Numar telefon:</label>
        <input type="tel" name="phoneNumber" id="Telefon" pattern="[0-9]{10}">
    
        <label for="photoURL">Adauga o poza de profil:</label>
        <input type="file" id="photoURL" name="photoURL" accept="image/*">
    
        <button type="submit">Actualizeaza datele</button>
    
    </form>
    `,
    
    reset_password: `
    <form method="POST">
        
        <h3>Reseteaza parola</h3>
        <hr>
    
        <label for="email">Email:</label>
        <input type="email" name="email" id="email">
    
        <button type="submit">Reseteaza parola</button>
    
    </form>
    `,

    add_listing:`
    <form autocomplete="off">
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
    `,

    listing_search_form:`
    <form autocomplete="off">

        <h3>Cauta o camera de inchiriat</h3>
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
        
        <button type="submit">Cauta camera</button>
        
    </form>
    `,

    search_listing: (listings) => {

        let lista_anunturi = []
        listings.forEach( doc => {
            //console.log(doc.id, " => ", doc.data())

            let id = doc.id
            let data = doc.data()

            let anunt = `
            <div class="card boxed" id="${id}">
                <img src="${data["Foto"]}" alt="img">
                <h2><a href="#">${data["Pret"]}&euro;, camera in ${data["Localitate"]}-${data["Zona"]}</a></h2>
            </div>       
            `
            lista_anunturi.push(anunt)
        })

        let anunturi = document.createElement("div")
        anunturi.setAttribute("class", "anunturi")
        anunturi.innerHTML = lista_anunturi.join(" ")

        let container = document.createElement("div")
    
        container.innerHTML = templates.listing_search_form
        container.appendChild(anunturi)

        return container
    }




}
