import { close_menu } from "./NavFooter.js"



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
        console.error(error)
    }
}


function prep() {
    document.body.className = "light-green blocuri"
    document.querySelector("main").removeAttribute("class")
    document.querySelector("title").innerText = "Camere de inchiriat"
    close_menu()
    type_motive()
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
}



export default Home