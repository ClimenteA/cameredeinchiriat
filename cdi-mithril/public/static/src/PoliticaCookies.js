function prep() {
    window.scrollTo({ top: 0 })
}



const PoliticaCookies = {
    oninit: prep,
    view: () => {
        return m("h1", "PoliticaCookies")
    }
}




export default PoliticaCookies