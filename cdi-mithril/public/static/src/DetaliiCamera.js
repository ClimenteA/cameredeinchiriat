
import { close_menu } from "./NavFooter.js"


function prep(){
    document.querySelector("main").removeAttribute("class")
    document.body.className = "light-green blocuri"
    document.querySelector("title").innerText = "Detalii camera"
    close_menu()
}



const Camera = {
    oninit: vnode => {

        vnode.state.data = { foto: "./static/svg/1.jpg",
                            
                            descriere: `Avem o camera libera intr-un apartament 
                            cu 3 camere, zona este linistita, magazin 
                            aproape, cautam o persoana care sa stea
                            pe o perioada de minim un an.
                            Pentru alte detalii ma puteti contacta
                            raspun la telefon dupa ora 6.`,

                            titlu: "Iasi, buget 200E",
                            
                            }
    },

    oncreate: prep,
    view: vnode => {
        return m("div.center", [
            m("img.responsive-img", {src:vnode.state.data.foto, alt:"Foto camera"}),
            m("div.descriere", [
                m("h6", vnode.state.data.titlu),
                m("span", vnode.state.data.descriere)
            ])
        ])
        
    }
}



const CardUtilizator = {
    oninit: vnode => {
        vnode.state.data = { user_foto: "./static/svg/ca.jpg",
                            displayName: "Climente Alin",
                            interes: "Iasi, buget 200E",
                            telefon: "0724242424",
                            email: "climente.alin@gmail.com"
                    }
    },
    oncreate: prep,
    view: vnode => {
        return m("section.user", [
            m("img", {src:vnode.state.data.user_foto}),
            m("h6", vnode.state.data.displayName),
            m("span", vnode.state.data.interes),
            m("span", vnode.state.data.telefon),
            m("span", vnode.state.data.email),
            // m("a", {href:"#!/actualizeaza-cont", 
            //         class:"btn moderate-purple"}, "Actualizeaza contul")
        ])
    }
}



const DetaliiCamera = {
    view: () => {
        return m("div.center", {style:"margin-top:1rem;"},[
            m(Camera),
            m(CardUtilizator)
        ])
    }
}



export default DetaliiCamera