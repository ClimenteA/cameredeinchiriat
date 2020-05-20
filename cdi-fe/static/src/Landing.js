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
        "altceva"
        ]
    
    try {
        new Typewriter('#motive', {
            strings: motive,
            autoStart: true,
            loop: true
        })        
    } catch (error) {
        //ignore
    }
}


export {
    type_motive
}

