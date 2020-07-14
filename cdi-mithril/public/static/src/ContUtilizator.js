import { close_menu } from "./NavFooter.js"
import { 
    toast, 
    parse_query_data,
    get_user_data
} from "./Utils.js"

import CardUtilizator from "./CardUtilizator.js"


// Model


let store = {
    user_data: undefined,
    anunturi_postate: undefined
}



// Controller


function prep(){
    document.querySelector("main").removeAttribute("class")
    document.body.className = "light-green blocuri"
    document.querySelector("title").innerText = "Cont utilizator"
    close_menu()
}


async function anunturi_postate() {
    
    let email
    
    try {
        email = await firebase.auth().currentUser.email    
    } catch (error) {
       m.route.set("/intra-in-cont") 
    }

    let ref = firebase.firestore()
    let query_data = await ref.collection("listing")
                            .where("utilizator", "==", email)
                            .get()

    let data = parse_query_data(query_data)

    console.log("Anunturi postate", data)

    return data

} 



// View


const AnunturiPostate = {
    oncreate: async () => {
        store.anunturi_postate = await anunturi_postate()
        m.redraw()
    },
    view: () => {
        return m("section.camere-postate", [
            m("h6", "Camere postate"),
            store.anunturi_postate ? m("ul", store.anunturi_postate.map(anunt => {
                return m("li", [
                    m("span", "- " + anunt.localitate + " " + anunt.buget + " Euro")
                ]) 
            })) : m("h5", "...")
        ])
    }
}


const ContUtilizator = {
    oncreate: async () => {
        prep()
        store.user_data = await get_user_data()
        m.redraw()
        console.log(store.user_data)
    },
    view: () => {
        
        return m("div.center.user-layout", [
            store.user_data ? m(CardUtilizator, store.user_data) : m("h1", "..."),
            m(AnunturiPostate),
            m("a", { href:"#!/actualizeaza-cont", class:"btn moderate-purple"}, "Actualizeaza contul")
        ])

    }
}


export default ContUtilizator