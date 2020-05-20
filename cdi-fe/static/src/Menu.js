


const show_menu = _ => {
    document.querySelector(".menu").addEventListener("click", event => {
        // console.log("open menu clicked")
        document.querySelector(".menu-expanded").className = "menu-expanded show"  
    })
}

const hide_menu = _ => {
    document.querySelector("#close-menu").addEventListener("click", event => {
        // console.log("close menu clicked")
        document.querySelector(".menu-expanded").className = "menu-expanded hide"
    })
}

const toggle_menu = _ => {
    show_menu()
    hide_menu()
}


export {
    toggle_menu
}