import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useFirebaseStore } from '@/stores/firebase'
import normalizeDoc from '@/util/normalizeDoc'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

export const useAttendancesStore = defineStore('attendances', {
    actions: {
        async getMemberAttendances(orgId, studentId) {
            const db = getDb()
            const colRef = collection(db, 'attendances')
            const q = query(
                colRef,
                where('orgId', '==', orgId),
                where('studentId', '==', studentId)
            )
            const snapshot = await getDocs(q)
            return snapshot.docs.map(normalizeDoc)
        }
    }
})

if(import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAttendancesStore, import.meta.hot))
}