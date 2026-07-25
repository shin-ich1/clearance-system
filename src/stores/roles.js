import { defineStore, acceptHMRUpdate } from 'pinia'
import { collection, query, where, getDocs, orderBy, setDoc, getDoc, doc, startAt } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'
import { useFirebaseStore } from '@/stores/firebase'
import { useStudentsStore } from '@/stores/students'
import { useSchoolYearsStore } from '@/stores/schoolYears'
import normalizeDoc from '@/util/normalizeDoc'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

function isRole(roleType) {
    return role => role.type === roleType
}

export const useRolesStore = defineStore('roles', {
    state: () => ({
        userRoles: [],
        studentRoles: [],
        isUserRolesInitialized: false,
        isStudentRolesInitialized: false
    }),
    getters: {
        orgAdminRoles: (state) => state.userRoles
            .filter(isRole('orgadmin'))
            .reduce((acc, role) => Object.assign(acc, { [role.orgId]: role }), {}),
        sysAdminRole: (state) => state.userRoles.find(isRole('sysadmin')),
        studentRole: (state) => state.userRoles.find(isRole('student')),
        isSysAdmin: (state) => Boolean(state.sysAdminRole),
        isStudent() { return Boolean(this.studentRole) }
    },
    actions: {
        async initializeUserRoles() {
            const auth = useAuthStore()
            if(auth.isLoggedIn) {
                const db = getDb()
                const roles = collection(db, 'roles')
                const q = query(roles, where('userId', '==', auth.user.uid))
                const docs = await getDocs(q)
                this.userRoles = docs.docs.map(normalizeDoc)
                this.isUserRolesInitialized = true
            }
        },
        async initializeStudentRoles() {
            if(this.isUserRolesInitialized) {
                if (this.isStudent) {
                    const db = getDb()
                    const roles = collection(db, 'roles')
                    const q = query(roles, where('studentId', '==', this.studentRole.studentId))
                    const docs = await getDocs(q)
                    this.studentRoles = docs.docs
                        .map(normalizeDoc)
                        .filter(doc => doc.type === 'orgmember')
                }
                this.isStudentRolesInitialized = true
            }
        },
        async getOrgAdminRoles(orgId) {
            const db = getDb()
            const roles = collection(db, 'roles')
            const q = query(roles, where('type', '==', 'orgadmin'), where('orgId', '==', orgId))
            const docs = await getDocs(q)
            return docs.docs.map(normalizeDoc)
        },
        async getOrgMemberRoles(orgId, lastId) {
            const schoolYears = useSchoolYearsStore()
            const currentSy = await schoolYears.getCurrentSchoolYear()

            const db = getDb()
            const rolesCol = collection(db, 'roles')

            const queryConstraints = [
                where('type', '==', 'orgmember'),
                where('organizationId', '==', orgId),
                where('schoolYear', '==', currentSy.id),
                orderBy('lastname')
            ]
            if(lastId) {
                const lastDoc = await getDoc(doc(rolesCol, lastId))
                queryConstraints.push(startAt(lastDoc))
            }

            const q = query(rolesCol, ...queryConstraints)
            const docs = await getDocs(q)
            return docs.docs.map(normalizeDoc)
        },
        async getOrgMemberRole(orgId, studentId) {
            // TODO: refactor with addOrgMember()
            const db = getDb()
            const schoolYears = useSchoolYearsStore()

            const currentSy = await schoolYears.getCurrentSchoolYear()
            const roleId = `orgmember_${studentId}_${orgId}_${currentSy.id}`

            const roleDoc = await getDoc(doc(db, 'roles', roleId))
            if(!roleDoc.exists()) {
                throw new Error('Member not found')
            }

            return normalizeDoc(roleDoc)
        },
        async addOrgMember(orgId, studentId) {
            const db = getDb()
            const students = useStudentsStore()
            const schoolYears = useSchoolYearsStore()

            const currentSy = await schoolYears.getCurrentSchoolYear()
            const roleId = `orgmember_${studentId}_${orgId}_${currentSy.id}`

            const roleDoc = await getDoc(doc(db, 'roles', roleId))
            if(roleDoc.exists()) {
                throw new Error('Member is already added')
            }

            const student = await students.getStudent(studentId)
            
            const roleData = {
                type: 'orgmember',
                organizationId: orgId,
                studentId: student.id,
                firstname: student.firstname,
                lastname: student.lastname,
                course: student.course,
                year: student.year,
                schoolYear: currentSy.id
            }

            await setDoc(doc(db, 'roles', roleId), roleData)
            return { id: roleId, ...roleData }
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRolesStore, import.meta.hot))
}