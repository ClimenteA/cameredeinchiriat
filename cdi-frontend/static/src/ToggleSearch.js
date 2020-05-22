
const toggle_search = _ => {

    try {
        let camera = document.getElementById("camera")
        let btn = document.getElementById("camera_coleg")

        camera.addEventListener("change", event => {
            if (camera.checked) {
                // console.log("coleg: ", camera.checked)
                btn.innerText = "Cauta coleg"
            } else {
                // console.log("camera: ", camera.checked)
                btn.innerText = "Cauta camera"
            }    
        })
        
    } catch (error) {
        
    }
}


export {
    toggle_search
}