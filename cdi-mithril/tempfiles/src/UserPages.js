import {hide_menu} from "./Nav.js"

const login_form = `

<form method="POST" action="/login">

<div class="input">
    <label class="white-text" for="email">Email</label>
    <input type="email" name="email" id="email">    
</div>

<div class="input">
    <label class="white-text" for="pass1">Parola</label>
    <input type="password" name="pass1" id="pass1">    
</div>

<button type="submit" class="btn dark-green">Intra in cont</button>

<div class="helpers">
    <a href="/creaaza-un-cont">Nu am cont!</a>
    <a href="/reseteaza-parola">Am uitat parola!</a>
</div>

</form>

`

const register_form = `

<form method="POST" action="/creaaza-un-cont">

<div class="input">
    <label class="white-text" for="email">Email</label>
    <input type="email" name="email" id="email">    
</div>

<div class="input">
    <label class="white-text" for="pass1">Parola</label>
    <input type="password" name="pass1" id="pass1">    
</div>

<div class="input">
    <label class="white-text" for="pass2">Confirma parola</label>
    <input type="password" name="pass2" id="pass2">    
</div>


<button type="submit" class="btn dark-green">Creaaza cont</button>

<div class="helpers">
    <a href="/login">Am cont!</a>
    <a href="/reseteaza-parola">Am uitat parola!</a>
</div>

</form>

`

const reset_password_form = `

<form method="POST" action="/reseteaza-parola">

    <div class="input">
        <label class="white-text" for="email">Email</label>
        <input type="email" name="email" id="email">    
    </div>

    <button type="submit" class="btn dark-green">Reseteaza parola</button>
    
</form>

`


const user_page = `

<section class="user">

<img src="./static/ca.jpg" alt="User image">
<h6>Climente Alin</h6>

<span>Iasi, buget 200E</span>
<span>0724242424</span>
<span>climente.alin@gmail.com</span>

<a href="/actualizeaza-profil" class="btn moderate-purple">
    Actualizeaza contul
</a>

</section>

<section class="anunturi-postate">
<h6>Anunturi postate</h6>
<ul>
    <li>
        <a href="#">Iasi, 120E : Ap. cu 2 camere in z...</a>
        <span class="btn red close">sterge</span> 
    </li>
</ul>      
</section>

`

const update_profile_form = `

<form method="POST" action="/actualizeaza-profil">

<div class="input">
    <label class="white-text" for="nume">Nume complet</label>
    <input type="text" name="nume" id="nume">    
</div>

<div class="input">
    <label class="white-text" for="localitate">Caut chirie in orasul</label>
    <input type="text" name="localitate" id="localitate">    
</div>

<div class="input">
    <label class="white-text" for="buget">Buget pe luna</label>
    <input type="tel" name="buget" id="buget">    
</div>

<div class="input">
    <label class="white-text" for="telefon">Numar telefon</label>
    <input type="tel" name="telefon" id="telefon">    
</div>

<div class="input">
    <label class="fileContainer">
        Foto profil
        <input type="file" name="foto" id="foto"/>
    </label>
</div>

<button type="submit" class="btn dark-green">Aplica modificarile</button>
</form>

<div class="mt-2">
<a href="/sterge-contul" class="btn red">Sterge contul</a>
</div>

`
 


var main = document.getElementsByTagName("main")[0]


function user_page_background() {
    main.className = "center"
    document.body.className = "light-purple blocuri"
    hide_menu()
}

function render_register_page() {
    main.innerHTML = register_form
    user_page_background()
}

function render_login_page() {
    main.innerHTML = login_form
    user_page_background()
}

function render_reseteaza_parola_page() {
    main.innerHTML = reset_password_form
    user_page_background()
}


function render_user_page() {

    //Todo link firebase auth
    let user_is_authentificated = true 

    if (user_is_authentificated) {         
        main.innerHTML = user_page
    } else {
        main.innerHTML = login_form
    }

    user_page_background()

}


function render_update_profile_page(){
    main.innerHTML = update_profile_form
    user_page_background()
}




export {
    render_user_page,
    render_register_page,
    render_login_page,
    render_reseteaza_parola_page,
    render_update_profile_page
}
