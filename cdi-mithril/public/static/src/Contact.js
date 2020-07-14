
function prep() {
    window.scrollTo({ top: 0 })
}


const Contact = {
    oninit: prep,
    view: () => {
        return m("h1", "Contact")
    }
}


export default Contact