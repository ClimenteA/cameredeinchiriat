import {hide_menu} from "./Nav.js"

import {render_login_page} from "./UserPages.js"


const toggle_search = _ => {

    try {
        let camera = document.getElementById("camera")
        let btn = document.getElementById("camera_coleg")

        camera.addEventListener("change", event => {
            if (camera.checked) {
                // console.log("coleg: ", camera.checked)
                btn.innerText = "Cauta coleg"
            } else {
                // console.log("camera: ", camera.checked)
                btn.innerText = "Cauta camera"
            }    
        })
        
    } catch (error) {
        
    }
}

const add_listing_form = `

<form method="POST" action="/adauga-anunt">

<div class="input">
    <label class="white-text" for="localitate">Localitate</label>
    <input type="text" name="localitate" id="localitate">    
</div>

<div class="input">
    <label class="white-text" for="pret">Pret</label>
    <input type="tel" name="pret" id="pret">    
</div>

<div class="input">
    <label class="white-text" for="descriere">Descriere</label>
    <textarea name="descriere" id="descriere">
    </textarea>
</div>

<div class="input">
    <span>
        Pune cat mai multe detalii pentru a face anuntul atractiv.
    </span>
</div>

<div class="input">
    <label class="fileContainer">
        Foto camera
        <input type="file" name="foto" id="foto"/>
    </label>
</div>

<button type="submit" class="btn dark-green">Adauga anunt</button>
</form>


`


function listings_background() {
    
    document.body.className = "light-green blocuri"
    hide_menu()
    let main = document.querySelector("main")
    main.className = "center"
    main.innerHTML = search_form
    toggle_search()

}


function render_add_listing_page() {

    let main = document.querySelector("main")
    
    //Todo link firebase auth
    let user_is_authentificated = true 

    if (user_is_authentificated) {         
        main.innerHTML = add_listing_form
        main.className = "center"
        document.body.className = "light-purple blocuri"
        hide_menu()  
    } 
    else {
        render_login_page()
    }
    
}


const search_form = `

<form method="POST" action="/cauta">

<div class="input center-text">
    <label class="white-text" for="localitate">Localitate</label>
    <input type="text" name="localitate" id="localitate">    
</div>

<div class="input center-text">
    <label class="white-text" for="buget">Buget</label>
    <input type="tel" name="buget" id="buget">    
</div>

<button type="submit" class="btn large heavy-purple" id="camera_coleg">Cauta</button>

<div class="mt-2">
    <div class="switch">
        <label>
            <span class="light-green-text">Camera</span> 
            <span>
                <input type="checkbox" name="camera" id="camera">
                <span class="lever"></span>
            </span>
            <span class="light-purple-text">Coleg</span>
        </label>
    </div>
</div>

</form>

<section class="anunturi mb-4">

</section>

`


function render_listings_page() {

    listings_background()
    
    // TODO get data from firebase
    let listings  = {}

    let listings_container = document.querySelector(".anunturi.mb-4")

    for (let id_anunt of Array(30).keys()) {
        console.log(id_anunt)

        let anunt_str = `  
            <img class="foto-camera" src="./static/1.jpg" alt="Foto camera">
            <img class="foto-user" src="./static/ca.jpg" alt="Foto user">
            <span class="title" id="${id_anunt}">Iasi, 220Euro</span>
        `
        let anunt_el = document.createElement("div")
        anunt_el.className = "anunt"
        anunt_el.innerHTML = anunt_str
        listings_container.appendChild(anunt_el)
    }
    
}


function render_coleagues_page(){

    listings_background()

    // TODO get data from firebase
    let coleagues  = {}

    let coleagues_container = document.querySelector(".anunturi.mb-4")

    for (let id_coleg of Array(30).keys()) {
        console.log(id_coleg)

        let coleg_str = `  
            <img src="./static/ca.jpg" alt="User image">
            <h6>Climente Alin</h6>
            
            <span>Iasi, buget 200E</span>
            <span>0724242424</span>
            <span>climente.alin@gmail.com</span>
        `
        let coleg_el = document.createElement("div")
        coleg_el.className = "user moderate-purple"
        coleg_el.innerHTML = coleg_str
        coleagues_container.appendChild(coleg_el)
    }



}


function end_if_incomplete(data){
    if (!Object.keys(data).every((k) => data[k].trim())) {
        throw "Toate campurile trebuie completate!"
    } 
}


function add_listing(form_data){
    
    console.log(form_data)

    try {
        end_if_incomplete(form_data)

        


        
    } catch (error) {
        console.error(error)

    }

}




export {
    render_add_listing_page,
    render_listings_page,
    render_coleagues_page,
    add_listing

}