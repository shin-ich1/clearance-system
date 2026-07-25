import { defineStore, acceptHMRUpdate } from 'pinia'
import { doc, collection, query, documentId, where, addDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { useRolesStore } from '@/stores/roles'
import { useFirebaseStore } from '@/stores/firebase'
import { useErrorsStore } from '@/stores/errors'
import chunkArray from '@/util/chunkArray'
import normalizeDoc from '@/util/normalizeDoc'
import { httpsCallable } from 'firebase/functions'

function getDb() {
    const firebase = useFirebaseStore()
    return firebase.getFirestore()
}

function getFunctions() {
    const firebase = useFirebaseStore()
    return firebase.getFunctions()
}

function handleError(e, message) {
    if(e) {
        console.error(e)
    }
    
    const errors = useErrorsStore()
    errors.add(message)
}

export const useOrgStore = defineStore('org', {
    state: () => ({
        orgIds: [],
        orgData: {},
        isOrgsLoading: false
    }),
    actions: {
        async createOrg(name) {
            const db = getDb()
            const col = collection(db, 'organizations')
            const orgRef = await addDoc(col, { name })
            const org = { id: orgRef.id, name }
            this.orgData[org.id] = org
            this.orgIds.push(org.id)
            return org
        },
        async loadCurrentUserOrgs() {
            this.$reset()
            const roles = useRolesStore()

            try {
                this.isOrgsLoading = true
                if(roles.isSysAdmin) {
                    await this.loadAllOrgs()
                } else {
                    await this.loadOrgsFromRoles(roles)
                }
            } catch(e) {
                handleError(e, `Cannot load organizations: ${e.message}`)
            } finally {
                this.isOrgsLoading = false
            }
        },
        async loadAllOrgs() {
            const db = getDb()
            const docs = await getDocs(collection(db, 'organizations'))
            docs.forEach(doc => {
                const orgId = doc.id
                this.orgIds.push(orgId)
                this.orgData[orgId] = normalizeDoc(doc)
            })
        },
        async loadOrgsFromRoles(roles) {
            const db = getDb()
            const studentOrgIds = roles.studentRoles.map(role => role.organizationId)
            const orgAdminOrgIds = Object.keys(roles.orgAdminRoles)
            const orgIdsSet = new Set([ ...studentOrgIds, ...orgAdminOrgIds ])
            const orgIds = Array.from(orgIdsSet)
            const chunkedOrgIds = chunkArray(orgIds, 10)
            const promises = chunkedOrgIds.map(orgIds => this.loadStudentOrgsById(db, orgIds))
            await Promise.all(promises)
        },
        async loadStudentOrgsById(db, orgIds) {
            const orgs = collection(db, 'organizations')
            const q = query(orgs, where(documentId(), 'in', orgIds))

            const docs = await getDocs(q)
            docs.forEach(doc => {
                const org = normalizeDoc(doc)
                this.orgIds.push(org.id)
                this.orgData[org.id] = org
            })
        },
        async loadOrg(id) {
            const db = getDb()
            const docRef = doc(db, 'organizations', id)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()) {
                handleError(null, 'Organization does not exist')
                return
            }

            const orgData = { id: docSnap.id, ...docSnap.data() }
            this.orgData[orgData.id] = orgData
        },
        async deleteOrg(id) {
            const db = getDb()
            await deleteDoc(doc(db, 'organizations', id))
        },
        addAdmin(orgId, email) {
            const functions = getFunctions()
            const addAdmin = httpsCallable(functions, 'addorgadminuser')
            return addAdmin({ orgId, email })
        }
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOrgStore, import.meta.hot))
}