import {render_landing_page} from "./Landing.js"
import {
    render_user_page,
    render_login_page,
    render_register_page,
    render_reseteaza_parola_page,
    render_update_profile_page
} from "./UserPages.js"

import {
    render_add_listing_page,
    render_listings_page,
    render_coleagues_page,
    add_listing

} from "./Listings.js"

import { 
    render_cookies_page,
    render_gdpr_page,
    render_terms_and_cond_page,
    render_report_problem_page,
    render_contact_page
} from "./Footer.js"


import {
    creaaza_un_cont,
    login,
    reset_password,
    update_profile

} from "./User.js"


// ROUTES
const go_to_page = (path, form_data=null) => {

    if (path.includes("/index")) {
        render_landing_page()
    }
    else if (path.includes("/cont-utilizator")) {
        render_user_page()
    }
    else if (path.includes("/creaaza-un-cont")) {
        if (form_data) {
            creaaza_un_cont(form_data)
        }
        else {
            render_register_page()
        }
    }
    else if (path.includes("/login")) {
        if (form_data){
            login(form_data)
        }
        else {
            render_login_page()
        }
    }

    else if (path.includes("/reseteaza-parola")) {
        if (form_data){
            reset_password(form_data)
        }
        else {
            render_reseteaza_parola_page()
        }
    }

    else if (path.includes("/actualizeaza-profil")) {
        if (form_data) {
            update_profile(form_data)
        }
        else {
            render_update_profile_page()
        }
    }

    else if (path.includes("/adauga-anunt")) {
        if (form_data) {
            add_listing(form_data)
        }
        else {
            render_add_listing_page()
        }
           
    }

    else if (path.includes("/anunturi-camere")) {
        render_listings_page()   
    }

    else if (path.includes("/colegi-de-camera")) {
        render_coleagues_page()   
    }

    else if (path.includes("/politica-cookies")) {
        render_cookies_page()   
    }

    else if (path.includes("/politica-de-confidentialitate")) {
        render_gdpr_page()   
    }

    else if (path.includes("/termeni-si-conditii")) {
        render_terms_and_cond_page()   
    }

    else if (path.includes("/raporteaza-o-problema")) {
        render_report_problem_page()   
    }

    else if (path.includes("/contact")) {
        render_contact_page()   
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    handle_main_links()

}


function on_link_click(event) {
    event.preventDefault()
    let path = event.target.pathname
    go_to_page(path)
}

function on_form_submit(event) {
    event.preventDefault()
    let path = event.target.action
    let form_data = new FormData(event.target)
    form_data = Object.fromEntries(form_data)
    go_to_page(path, form_data)
}

function listen_links_onclick(links) {
    
    links.forEach(link => {
        link.removeEventListener("click", on_link_click)
        link.addEventListener("click", on_link_click)
    })
}


function listen_on_submit(forms){
    
    forms.forEach(form => {

        form.removeEventListener("submit", on_form_submit)
        form.addEventListener("submit", on_form_submit)
    })

}

const handle_links = _ => {
    
    let links = document.querySelectorAll("a")
    listen_links_onclick(links)

    let forms = document.querySelectorAll("form")
    listen_on_submit(forms)
    
}

const handle_main_links = _ => {
    
    let links = document.querySelectorAll("main a")
    listen_links_onclick(links)

    let forms = document.querySelectorAll("main form")
    listen_on_submit(forms)
    
}





export {
    handle_links,
    handle_main_links
}