

export default function toast(msg, success=true, ms=3000) {


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