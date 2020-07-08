import { close_menu } from "./NavFooter.js"
import { toast } from "./Utils.js"


function prep(){
    document.querySelector("main").removeAttribute("class")
    document.body.className = "light-green blocuri"
    document.querySelector("title").innerText = "Cont utilizator"
    close_menu()
}


function parse_query_data(query_data){   

    let data = []
    query_data.forEach(res => {
        let jdata = {id:res.id, data:res.data()}
        data.push(jdata)
    })

    return data[0].data
}


const CardUtilizator = {
    all_users: false,
    user_data: null,
    user_email: null,

    get_user_data: async _ => {

        let query = firebase.firestore().collection("user")

        if (CardUtilizator.all_users) {
            // No filter
        }
        else if (CardUtilizator.user_email) {
            query.where("email", "==", CardUtilizator.user_email)
        } 
        else {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    query.where("email", "==", user.email)
                }
            })
        }
        
        let query_data = await query.get()  
        CardUtilizator.user_data = parse_query_data(query_data)
        console.log(CardUtilizator.user_data)
        
        m.redraw()
    },

    oninit: () => {
        prep()
        CardUtilizator.get_user_data()
    },

    view: () => {

        const user_card = data => [
                m("img", {src:data.foto}),
                m("h6", data.nume),
                m("span", data.localitate + ", " + "buget " + data.buget + " Euro"),
                m("span", data.telefon),
                m("span", data.email)
            ]

        return m("section.user", 
        CardUtilizator.user_data ? 
        user_card(CardUtilizator.user_data) : m("h5", "...") )
    }

    }

    


const AnunturiPostate = {
    anunturi: [],

    oninit: vnode => {
        AnunturiPostate.anunturi = [ {title:"TEST Iasi, buget 120Euro", 
                                    id_camera:"123212"},
                                    {title:"TEST Iasi, buget 50Euro", 
                                    id_camera:"124444"}
                                    ]
    },
    view: () => {
        return m("section.camere-postate", [
            m("h6", "Camere postate"),
            AnunturiPostate.anunturi ? m("ul", AnunturiPostate.anunturi.map(anunt => {
                return m("li", [
                    m("a", {href:`#!/detalii-camera/${anunt.id_camera}`}, anunt.title)
                ]) 
            })) : m("h5", "...")
        ])
    }
}


const ContUtilizator = {
    view: () => {
        return m("div.center.user-layout", [
            m(CardUtilizator),
            m(AnunturiPostate),
            m("a", { href:"#!/actualizeaza-cont", class:"btn moderate-purple"}, "Actualizeaza contul")
        ])
    }
}


export {
    CardUtilizator,
    ContUtilizator
}