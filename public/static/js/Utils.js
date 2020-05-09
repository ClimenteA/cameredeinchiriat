import Auth from "./Auth.js"


const main = document.querySelector("main")
const authBtn = document.getElementById("autentificare")

const toast = (message, bg="rgb(56, 56, 56)", color="white", ms="30000") => {

    if (bg == "error") {
        bg = "rgb(211, 88, 88)"
    } 
    else if (bg == "success") {
        bg = "rgb(86, 165, 86)"
    }  

    let div = document.createElement("div")
    div.innerHTML = message 
    div.style.minHeight = "40px"
    div.style.lineHeight = "40px"
    div.style.paddingLeft = "1rem"
    div.style.color = color
    div.style.background = bg
    div.style.cursor = "pointer"
    div.style.borderBottom = "1px solid grey"
    div.setAttribute("title", "sterge")
    div.setAttribute("id", "toast")
    
    window.scrollTo({ top: 0, behavior: 'smooth' })

    document.querySelector("header").appendChild(div)

    div.addEventListener("click", (event) => {
        event.target.remove()
    })

    setTimeout(() => {
        div.remove()
    }, ms)

}

const name_from_email = (email) => {
    var name = email.split("@")[0]
    var name = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
    var name = name.replace(/\s{2,}/g," ")
    return name 
}

const render_template = (template, scrollTo="h3") => {

    main.innerHTML = ""

    if(template === template.toString()){
        main.innerHTML = template
    }else{
        main.appendChild(template)
    }
        
    try {
        document.querySelector(scrollTo).scrollIntoView()
    }
    catch {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } 
    finally {
        //console.info("Render page. Reinitialize.")
        var auth = new Auth()
        auth.listen()
    }
}

const el = selector => {
    return document.querySelector(selector)
}


//Listen to a form submit and return form data json
const wait_form_submit = _ => {
    return new Promise((resolve) => {
        document.querySelector('form').onsubmit = event => {
            event.preventDefault()
            var form_data = new FormData(event.target)
            form_data = Object.fromEntries(form_data) 
            resolve(form_data)
        }
    })
}


export {
    toast,
    name_from_email,
    main,
    authBtn,
    render_template,
    wait_form_submit,
    el
}