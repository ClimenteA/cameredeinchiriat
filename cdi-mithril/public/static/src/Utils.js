import { set, get, clear } from "../idb.js"
 

// HACK to trigger firebase auth
async function callFirebaseAuth(){
    await firebase.auth().currentUser
}

callFirebaseAuth()


function disable_children(el){
    [...el.elements].forEach(child => {
        child.disabled = true
    })
}

function enable_children(el){
    [...el.elements].forEach(child => {
        child.disabled = false
    })
}


function disable_helpers(){
    let helpers = document.querySelector(".helpers")
    helpers.className = "helpers hide"
}

function enable_helpers(){
    let helpers = document.querySelector(".helpers")
    helpers.className = "helpers"
}

function freeze_form(el){
    try {
        disable_children(el)
        disable_helpers()    
    } catch (error) {
        // console.error(error)
    }
}


function unfreeze_form(el){
    try {
        enable_children(el)
        enable_helpers()
    } catch (error) {
        // console.error(error)
    }
}


function toast(msg, success=true, ms=3000) {


    let div = document.createElement("div")

    div.setAttribute("id", "toast")
    div.innerText = msg

    document.body.appendChild(div)
    
    if(success) {
        div.style.background = "#4A9E33"
    }
    else {
        div.style.background = "#F23737"
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })

    div.addEventListener("click", (event) => {
        event.target.remove()
    })

    setTimeout(() => {
        div.remove()
    }, ms)

}


function name_from_email(email) {
    let name = email.split("@")[0]
    name = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
    name = name.replace(/\s{2,}/g," ")
    return name 
}


// function getCircularReplacer() {

//     const seen = new WeakSet()
    
//     return (key, value) => {
//       if (typeof value === "object" && value !== null) {
//         if (seen.has(value)) {
//           return
//         }
//         seen.add(value)
//       }
//       return value
//     }
// }
  



function save_json(key, json_obj){
    let json_str = JSON.stringify(json_obj)
    sessionStorage.setItem(key, json_str)
}

function get_json(key){
    return JSON.parse(sessionStorage.getItem(key))
}


function clear_json(key=null){
    if (key){
        sessionStorage.removeItem(key)
    }
    else {
        sessionStorage.clear()
    }
}


clear_json()
    

export {
    freeze_form,
    unfreeze_form,
    toast,
    name_from_email,
    save_json,
    get_json,
    clear_json
}