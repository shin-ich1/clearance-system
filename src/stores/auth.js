import { defineStore, acceptHMRUpdate } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { useFirebaseStore } from '@/stores/firebase'
import { useErrorsStore } from '@/stores/errors'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isCheckedIfAdmin: false,
        isSystemAdmin: false
    }),
    getters: {
        isLoggedIn: (state) => Boolean(state.user),
        userDisplayName: (state) => state.user && state.user.displayName
            ? state.user.displayName : 'User'
    },
    actions: {
        async checkIfAdmin() {
            if(!this.user || this.isCheckedIfAdmin) {
                return this.isSystemAdmin
            }

            const firebase = useFirebaseStore()
            const db = firebase.getFirestore()
            const ref = doc(db, 'system_admins', this.user.uid)
            
            try {
                const snapshot = await getDoc(ref)
                this.isSystemAdmin = snapshot.exists()
                this.isCheckedIfAdmin = true
                return this.isSystemAdmin
            } catch(e) {
                console.error(e)
                const errors = useErrorsStore()
                errors.add(`Cannot check user type: ${e.message}`)
            }
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}