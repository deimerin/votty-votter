import db from "../firebase/firebaseConfig";
import { updateDoc, doc, addDoc, collection } from "firebase/firestore";
import Candidate from "./candidate";
import sha256 from "crypto-js/sha256";
import Base64 from 'crypto-js/enc-base64';
import JSEncrypt from "jsencrypt";




class Ballot {
    constructor () {
        this._jsencrypt = new JSEncrypt();
        this._jsencrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZ1pTCquaCAY+2GQgGl7kGxCqGunQy4y+lQKH/xluS5CFABLb1dwtbuKqZg6jSr64xUwIsPjagPSxu20HSgw3vNjALrNyqNp0NKAxqmcMno00sQp9+Wr75mmLsTQyMa/nPNUoETVfhmUm35hHzXAv2pbOsNgELsV9lrLGhmparMQIDAQAB');
    }

    vote = async (candidate, votter) => {
        const salt = parseInt(Math.random()*10000) + Date.now().toString();
        const hashvotante = salt + votter.id;
        
        const cand = {
            num : candidate.num,
            nombre: candidate.name
        };

        const hash = sha256(hashvotante).toString(Base64);
        let encrypt = this._jsencrypt.encrypt(JSON.stringify(cand));
        if (!votter.hasVoted) {  

            votter.checkVote();

            const docRef1 = await addDoc(collection(db, "votty-bpoll"), {hash: hash, vote: encrypt});

            const docRef2 = await addDoc(collection(db, "votty-verf"), {hash: hash});

            return (true);
        } else {
            return(false);
        }
        
    }


}

export default Ballot;