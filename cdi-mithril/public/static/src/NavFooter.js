
const logo_path = "./static/svg/logo.svg"
const menu_path = "./static/svg/menu.svg"
const close_path = "./static/svg/close.svg"

function show_menu() {
    let menu_container = document.querySelector("#menu-content")
    menu_container.className = "menu-expanded show"
    document.querySelector("#menu").style.display = "none"
}

function close_menu() {
    let menu_container = document.querySelector("#menu-content")
    menu_container.className = "menu-expanded hide"
    document.querySelector("#menu").style.display = "block"
}


const Nav = {
    view: () => {
        return m("div", [

            m("nav", [
                m("a", {href:"#!/"}, [
                    m("img", {class:"logo", src:logo_path, alt:"camere de inchiriat"}),
                ]),

                m("img", {id:"menu", class:"menu", src:menu_path, alt:"menu", onclick:show_menu}),

            ]),

            m("div", {class:"menu-expanded hide", id:"menu-content"}, [
                m("img", {src:close_path, alt:"close", onclick:close_menu}),
                m("ul", [
                    m("li", m("a", {href:"#!/intra-in-cont"}, "Intra in cont")),
                    m("li", m("a", {href:"#!/adauga-camera"}, "Adauga camera")),
                    m("li", m("a", {href:"#!/vezi-anunturi"}, "Vezi anunturi")),
                    m("li", m("a", {href:"#!/iesi-din-cont"}, "Iesi din cont")),
                ])
            ])
    
    ])}
}



const Footer = {
    view: () => {
        return m("div", {class:"footer"}, [
            m("a", {href:"#!/politica-cookies"}, "Politica cookies"),
            m("a", {href:"#!/politica-de-confidentialitate"}, "Politica de Confidentialitate"),
            m("a", {href:"#!/termeni-si-conditii"}, "Termeni si conditii"),
            m("a", {href:"#!/raporteaza-problema"}, "Raporteaza o problema"),
            m("a", {href:"#!/contact"}, "Contact"),
        ])
    }
}


export {
    Nav,
    Footer,
    close_menu
}


