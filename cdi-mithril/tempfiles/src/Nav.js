import {render_landing_page} from "./Landing.js"

const show_menu = _ => {
    document.querySelector(".menu").addEventListener("click", event => {
        // console.log("open menu clicked")
        document.querySelector(".menu-expanded").className = "menu-expanded show"  
        document.querySelector(".menu").style.visibility = "hidden"
    })
}

const close_menu = _ => {
    document.querySelector("#close-menu").addEventListener("click", event => {
        // console.log("close menu clicked")
        document.querySelector(".menu-expanded").className = "menu-expanded hide"
        document.querySelector(".menu").style.visibility = "visible"
    })
}


const hide_menu = _ => {
    document.querySelector(".menu-expanded").className = "menu-expanded hide"
    document.querySelector(".menu").style.visibility = "visible"
}


const go_to_landing_page = _ => {
    document.getElementsByClassName("logo")[0].addEventListener("click", event => {
        event.preventDefault()
        render_landing_page()
        location.reload()
    })
}


const handle_nav = _ => {
    show_menu()
    close_menu()
    go_to_landing_page()
}


export {
    handle_nav,
    hide_menu
}