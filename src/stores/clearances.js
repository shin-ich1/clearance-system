import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, doc, query, where, getDocs, getDoc, setDoc } from 'firebase/firestore'
import { useFirebaseStore } from '@/stores/firebase'
import { useSchoolYearsStore } from '@/stores/schoolYears'
import normalizeDoc from '@/util/normalizeDoc'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

function getCurrentSy() {
    const schoolYears = useSchoolYearsStore()
    return schoolYears.getCurrentSchoolYear()
}

export const useClearancesStore = defineStore('clearances', {
    actions: {
        async createClearance(orgId, memberRole) {
            const currentSy = await getCurrentSy()
            const id = `clearance_${orgId}_${memberRole.studentId}_${currentSy.id}`
            const data = {
                studentId: memberRole.studentId,
                firstname: memberRole.firstname,
                lastname: memberRole.lastname,
                course: memberRole.course,
                year: memberRole.year,
                schoolYear: currentSy.id,
                orgId
            }

            const db = getDb()
            await setDoc(doc(db, 'clearances', id), data)
            return { id, ...data }
        },
        async getOrgMemberClearance(orgId, studentId) {
            const currentSy = await getCurrentSy()
            const id = `clearance_${orgId}_${studentId}_${currentSy.id}`

            const db = getDb()
            const clearanceDoc = await getDoc(doc(db, 'clearances', id))

            return clearanceDoc.exists()
                ? normalizeDoc(clearanceDoc)
                : null
        },
        async getStudentClearances(studentId) {
            const currentSy = await getCurrentSy()

            const db = getDb()
            const clearanceCol = collection(db, 'clearances')
            const q = query(
                clearanceCol,
                where('studentId', '==', studentId),
                where('schoolYear', '==', currentSy.id)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(normalizeDoc)
        }
    }
})

if(import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useClearancesStore, import.meta.hot))
}