import {hide_menu} from "./Nav.js"


const type_motive = _ => {

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
        ]
    
    try {
        new Typewriter('#motive', {
            strings: motive,
            autoStart: true,
            loop: true // TODO find a way to stop at a word
        })        
    } catch (error) {
        //ignore
    }
}


const landing_page =`
<section class="mt-4">

        <a href="/creaaza-un-cont" class="btn heavy-purple large">Creaza un cont</a>
    
        <h1 class="erica-font flow-text">
            Imparte chiria si pastreaza banii 
            <br> pentru <span id="motive">vacante</span>
        </h1>
    
</section>

`

function render_landing_page(){
    let main = document.getElementsByTagName("main")[0]
    main.innerHTML = landing_page
    main.className = ""
    document.body.className = "light-green blocuri"
    type_motive()
    hide_menu()
}




export {
    render_landing_page
}

