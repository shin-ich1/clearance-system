import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, doc, query, where, orderBy, addDoc, setDoc, getDoc, getDocs } from 'firebase/firestore'
import { useFirebaseStore } from '@/stores/firebase'
import { useSchoolYearsStore } from '@/stores/schoolYears'
import { useRolesStore } from '@/stores/roles'
import normalizeDoc from '@/util/normalizeDoc'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

export const useEventsStore = defineStore('events', {
    state: () => ({ loadedOrgId: '', loadedOrgEvents: [] }),
    actions: {
        async loadOrgEvents(orgId) {
            if(this.loadedOrgId !== orgId) {
                this.loadedOrgEvents = []
                this.loadedOrgEvents = await this.getOrgEvents(orgId)
                this.loadedOrgId = orgId
            }
        },
        async createOrgEvent(data) {
            const schoolYears = useSchoolYearsStore()
            const currentSy = await schoolYears.getCurrentSchoolYear()

            const db = getDb()
            const colRef = collection(db, 'events')
            const doc = await addDoc(colRef, { ...data, schoolYear: currentSy.id })
            const eventRecord = { id: doc.id, ...data }
            this.loadedOrgEvents.push(eventRecord)
            return eventRecord
        },
        async getOrgEvents(orgId) {
            const schoolYears = useSchoolYearsStore()
            const currentSy = await schoolYears.getCurrentSchoolYear()

            const db = getDb()
            const colRef = collection(db, 'events')
            const q = query(
                colRef,
                where('orgId', '==', orgId),
                where('schoolYear', '==', currentSy.id),
                orderBy('date')
            )
            const snapshot = await getDocs(q)
            return snapshot.docs.map(normalizeDoc)
        },
        async getEvent(eventId) {
            const db = getDb()
            const eventDoc = await getDoc(doc(db, 'events', eventId))
            if(!eventDoc.exists()) {
                throw new Error('Event not found')
            }
            return normalizeDoc(eventDoc)
        },
        async addAttendance(event, studentId) {
            // TODO: move to attendances store
            const db = getDb()
            const id = `attendance_${event.id}_${studentId}`

            const attendanceDoc = await getDoc(doc(db, 'attendances', id))
            if(attendanceDoc.exists()) {
                throw new Error('Attendance already recorded')
            }

            const roles = useRolesStore()
            const memberRole = await roles.getOrgMemberRole(event.orgId, studentId)
            
            const data = {
                eventId: event.id,
                orgId: event.orgId,
                eventName: event.name,
                studentId: memberRole.studentId,
                studentFirstname: memberRole.firstname,
                studentLastname: memberRole.lastname,
                studentCourse: memberRole.course,
                studentYear: memberRole.year,
            }

            await setDoc(doc(db, 'attendances', id), data)
            return { id, ...data }
        },
        async getAttendances(orgId, eventId) {
            // TODO: move to attendances store
            const db = getDb()
            const colRef = collection(db, 'attendances')
            const q = query(
                colRef,
                where('orgId', '==', orgId),
                where('eventId', '==', eventId),
                orderBy('studentLastname')
            )
            const snapshot = await getDocs(q)
            return snapshot.docs.map(normalizeDoc)
        }
    }
})

if(import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEventsStore, import.meta.hot))
}
