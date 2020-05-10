import { toast } from "./Utils"


export default class Models {

    snap_listings () {
        firebase.firestore()
        .collection("listing").get()
        .then( querySnapshot => {
            return querySnapshot
        })
        .catch(error => {
            console.error(error)
            toast("Nu avem nici un anunt momentan..", "error")
        })
    }

    snap_user_listings() {

    }


}