import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, query, where, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { useFirebaseStore } from '@/stores/firebase'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

export const useSchoolYearsStore = defineStore('schoolYear', {
    state: () => ({ current: null }),
    actions: {
        async createSchoolYear({ id, current }) {
            const db = getDb()
            await setDoc(doc(db, 'school_years', id), { current })
            const syData = { id, current }
            if(current) {
                this.current = syData
            }
            return syData
        },
        async getCurrentSchoolYear() {
            if(!this.current) {
                const db = getDb()
                const colRef = collection(db, 'school_years')
                const q = query(colRef, where('current', '==', true))
                const snapshot = await getDocs(q)

                if(snapshot.empty) {
                    throw new Error('School Year is not set.')
                }

                if(snapshot.size > 1) {
                    throw new Error('School Year is ambiguous.')
                }

                const currentDoc = snapshot.docs[0]
                this.current = {
                    id: currentDoc.id,
                    ...currentDoc.data()
                }
            }
            return this.current
        },
        async getSchoolYears() {
            const db = getDb()
            const docs = await getDocs(collection(db, 'school_years'))
            return docs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        },
        async setCurrent(id, current) {
            const db = getDb()
            const ref = doc(db, 'school_years', id)
            await updateDoc(ref, { current })
            return { id, current }
        },
        async deleteSchoolYear(id) {
            const db = getDb()
            await deleteDoc(doc(db, 'school_years', id))
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSchoolYearsStore, import.meta.hot))
}
