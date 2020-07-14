
function prep() {
    window.scrollTo({ top: 0 })
}

const TermeniSiConditii = {
    oninit: prep,
    view: () => {
        return [
            m("h1", "TermeniSiConditii"),
            m("p", {style:"color:red;background:white;padding:4rem;"}, 
            "Acest website e facut doar in scop demonstrativ. Nu incarcati date sensibile!")
        ]
    }
}



export default TermeniSiConditii