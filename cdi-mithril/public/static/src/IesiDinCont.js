import { close_menu } from "./NavFooter.js"
import { toast } from "./Utils.js"


const IesiDinCont = {
    oninit: async () => {
        await firebase.auth().signOut()
        toast("Ai iesit din cont!")
        m.route.set("/")
    },
    oncreate: close_menu,
    view: () => {
        return m("h4", "Ai iesit din cont!")
    }
}


export default IesiDinCont