import { defineStore, acceptHMRUpdate } from 'pinia'
import { doc, query, orderBy, collection, where, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { useFirebaseStore } from '@/stores/firebase'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

function getFunctions() {
    const firebase = useFirebaseStore()
    return firebase.getFunctions()
}

export const useStudentsStore = defineStore('student', {
    state: () => ({ info: null, isInitialized: false }),
    actions: {
        async createStudent({ id, ...data }) {
            const db = getDb()
            await setDoc(doc(db, 'students', id), data)
            return { id, ...data }
        },
        async getStudentInfo(userId) {
            if(this.isInitialized) {
                return this.info
            }

            const db = getDb()
            const students = collection(db, 'students')
            const q = query(students, where('userId', '==', userId))

            const snapshot = await getDocs(q)
            this.isInitialized = true
            if(!snapshot.empty) {
                const [ doc ] = snapshot.docs
                this.info = { id: doc.id, ...doc.data() }
            }
            return this.info
        },
        async getStudents() {
            const db = getDb()
            const students = collection(db, 'students')
            const q = query(students, orderBy('lastname'))
            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        },
        async getStudent(id) {
            const db = getDb()
            const studentDoc = await getDoc(doc(db, 'students', id))
            if(!studentDoc.exists()) {
                throw new Error('Student does not exist')
            }
            return { id: studentDoc.id, ...studentDoc.data() }
        },
        async deleteStudent(id) {
            const db = getDb()
            await deleteDoc(doc(db, 'students', id))
        },
        bind(data) {
            const functions = getFunctions()
            const bind = httpsCallable(functions, 'bindstudentuser')
            return bind(data)
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStudentsStore, import.meta.hot))
}