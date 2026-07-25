import { defineStore, acceptHMRUpdate } from 'pinia'
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

const firebaseConfig = {
    apiKey: "AIzaSyDcjwlWtio9ukBeEinJ3yz25eGbcuqeK6w",
    authDomain: "clearance-and-attendance.firebaseapp.com",
    databaseURL: "https://clearance-and-attendance-default-rtdb.firebaseio.com",
    projectId: "clearance-and-attendance",
    storageBucket: "clearance-and-attendance.appspot.com",
    messagingSenderId: "1022527437793",
    appId: "1:1022527437793:web:ecd960faeac964d8b230a0",
    measurementId: "G-XHXL52149R"
};

export const useFirebaseStore = defineStore('firebase', {
    state: () => ({ app: null, auth: null, firestore: null, functions: null }),
    actions: {
        getApp() {
            if(!this.app) {
                this.app = initializeApp(firebaseConfig)
            }
            return this.app
        },
        getAuth() {
            if(!this.auth) {
                this.auth = getAuth(this.getApp())
                if(import.meta.env.DEV) {
                    connectAuthEmulator(this.auth, 'http://localhost:9099', {
                        disableWarnings: true
                    })
                }
            }
            return this.auth
        },
        getFirestore() {
            if(!this.firestore) {
                this.firestore = getFirestore(this.getApp())
                if(import.meta.env.DEV) {
                    connectFirestoreEmulator(this.firestore, 'localhost', 8080)
                }
            }
            return this.firestore
        },
        getFunctions() {
            if(!this.functions) {
                this.functions = getFunctions(this.getApp())
                if(import.meta.env.DEV) {
                    connectFunctionsEmulator(this.functions, 'localhost', 5001)
                }
            }
            return this.functions
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFirebaseStore, import.meta.hot))
}