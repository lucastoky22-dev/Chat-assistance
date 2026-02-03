import http from '../pages/http.js';

export async function getOnlineAgent(){

    return await http.get(`/onOffAgent?etat=${true}`)
        .then((res)=>{
            return res.data;
        })
        .catch((err)=>console.log("error: " + err))

}

export async function getBusyAgent(){
    return await http.get("/listOfUserByDisponibility", {state:"BUSY"}).then((res)=>{
        return res.data;
    }).catch((err)=>console.log(err))
}

export async function getFreeAgent() {
    return await http.get("/listOfUserByDisponibility", {state:"FREE"}).then((res)=>{
        return res.data;
    }).catch((err)=>console.log(err))
}

export async function getChatHistory(user){
    console.log("user = " + user.matricule);
    return await http.get(`/chatHistory?userMatricule=${user.matricule}`).then((res) => {
        console.log(res)
        return res.data;
    }).catch((err) => console.log("erreur: " + err));
}

