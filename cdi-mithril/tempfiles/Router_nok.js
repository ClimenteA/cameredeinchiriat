

// Simple path : "home"
// Path with parameters: "listing/:city/:price"

// ONLY FLAT ROUTES ARE HANDLED, FIRST ELEMENT SERVES AS KEY 
// FIRST ELEMENT IS IGNORED AS A PARAMETER

// Listen on click for all elements with data-route attribute
// Render template/view based on route
// Separate elements with data-route atribute in 2
// forms (because we get formsData) and 
// other (simple get request with or without parameters)


export default class Router {
    
    constructor (urlpatterns){
        this.el_data_routes = document.querySelectorAll("[data-route]")
        this.urlpatterns = urlpatterns
        this.listen()

    }

    path_params(path) {
        // Extract all parameters in a list from a path 
        // convert to int if 'int:' prefix is found
        let params = [] 
        path.split("/").forEach(item => {
            if (item.startsWith(":")) {
                params.push(item.substring(1))
            }
            else if (item.startsWith("int:")) {
                params.push(Number(item.substring(4)))
            }
        })

        return params
    }

    call_view(path, form_data=undefined) {
        
        let params = this.path_params(path)

        if (path.includes(":")) {                    
            Object.keys(this.urlpatterns).forEach(item => {
                if (item.startsWith(path.split("/")[0])){
                    let paramsli = this.path_params(item)
                    let paramsobj = {}
                    paramsli.forEach((item, index) => {
                        paramsobj[item] = params[index]
                    })
                    this.urlpatterns[item](paramsobj)
                }
            })
        }

        else if (form_data) {
            this.urlpatterns[path](form_data)
        }

        else {
            this.urlpatterns[path]()
        }

        document.location.pathname = path
    }

    el_data_forms(el) {
        // Add a listener onsubmit to all forms
        // pass in the view the form data
        el.onsubmit = event => {
            event.preventDefault()
            let path = event.target.dataset.route
            let form_data = new FormData(event.target)
            form_data = Object.fromEntries(form_data)
            this.call_view(path, form_data)
        }
    }

    el_data_not_forms(el){
        //Listen and call view described in urlpatterns
        //Apply for all elements except form elements
        el.addEventListener("click", event => {
            event.preventDefault()
            let path = event.target.dataset.route
            this.call_view(path)
        })
    }

    listen() {   
        // Add listeners to all elements with data-route attribute

        this.el_data_routes.forEach(el => {

            if (el.tagName == "FORM") {
                this.el_data_forms(el)
            }
            else {
                this.el_data_not_forms(el)
            }
        })
    }
    
}






