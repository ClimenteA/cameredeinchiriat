
function prep() {
    window.scrollTo({ top: 0 })
}


const PoliticaDeConfidentialitate = {
    oninit: prep,
    view: () => {
        return m("h1", "PoliticaDeConfidentialitate")
    }
}



export default PoliticaDeConfidentialitate