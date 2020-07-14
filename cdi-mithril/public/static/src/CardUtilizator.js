
const CardUtilizator = {
    
    view: v => {
        
        let title = v.attrs.localitate + ", " + "buget " + v.attrs.buget + " Euro"
        
        if (!v.attrs.foto) { v.attrs.foto = "./static/svg/skull.svg" }

        return m("section.user.dark-grey", [
            m("img", {src:v.attrs.foto}),
            m("h6", v.attrs.nume),
            m("span", title),
            m("span", v.attrs.telefon),
            m("span", v.attrs.email)
        ])
    }        
}



export default CardUtilizator
