
function prep() {
    window.scrollTo({ top: 0 })
}


const RaporteazaProblema = {
    oninit: prep,
    view: () => {
        return m("h1", "RaporteazaProblema")
    }
}

export default RaporteazaProblema