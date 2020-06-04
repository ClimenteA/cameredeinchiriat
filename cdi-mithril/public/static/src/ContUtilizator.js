import { close_menu } from "./NavFooter.js"
import { toast } from "./Utils.js"


function prep(){
    document.querySelector("main").removeAttribute("class")
    document.body.className = "light-green blocuri"
    document.querySelector("title").innerText = "Cont utilizator"
    close_menu()
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
            m("a", {href:"#!/actualizeaza-cont", 
                    class:"btn moderate-purple"}, "Actualizeaza contul")
        ])
    }
}


const AnunturiPostate = {
    oninit: vnode => {
        vnode.state.data = [ {title:"Iasi, buget 120Euro", 
                              id_camera:"123212"},
                            {title:"Iasi, buget 50Euro", 
                              id_camera:"124444"}
                            ]
    },
    view: vnode => {
        return m("section.camere-postate", [
            m("h6", "Camere postate"),
            m("ul", vnode.state.data.map(anunt => {
                return m("li", [
                    m("a", {href:`#!/detalii-camera/${anunt.id_camera}`}, anunt.title)
                ])
            }))
        ])
    }
}


const ContUtilizator = {
    view: () => {
        return m("div.center.user-layout", [
            m(CardUtilizator),
            m(AnunturiPostate)
        ])
    }
}


export default ContUtilizator