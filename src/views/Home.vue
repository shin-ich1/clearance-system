<template>
    <Header :name="auth.userDisplayName"></Header>
    <div
    v-if="isSysAdmin" class="container align-items-center">
        <div class = "row align-items-center">
            <div class = "col-md-12">
                <h1 class="me-auto text-center">Organizations</h1>
            </div>
        </div>
        <div class = "row">
            <div class = "col-md-8">
            </div>
            <div class = "col-md-4">
                <button
                    class="btn btn-success mb-2 p-2"
                    style="width:100%"
                    @click="showCreateModal = true">
                    <i class="bi bi-plus-square p-2"></i>
                    Add New Organization
                </button>
            </div>
        </div>
    </div>
    <div class="container mt-2">
        <div v-if="org.isOrgsLoading" class="d-flex justify-content-center pt-3">
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span> 
            </div>
        </div>
        <div v-else class="row g-2">
            <div v-if="auth.isSystemAdmin" class="container">
                <table class="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(orgId, index) in org.orgIds">
                            <td>{{ org.orgData[orgId].name }}</td>
                            <td class="d-grip gap-1 d-flex justify-content-end">
                                <button class="btn btn-sm btn-info">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    class="btn btn-sm btn-danger"
                                    @click="askToDelete(index)">
                                    <i class="bi bi-x-circle-fill"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-else
                v-for="orgId in org.orgIds"
                :id="orgId"
                class="col-sm-12 col-md-6">
                <OrgCard
                    :id="orgId"
                    :data="org.orgData[orgId]"
                    :isApproved="Boolean(clearancesByOrgId[orgId])"
                    :isLoadingApproved="isClearancesLoading">
                </OrgCard>
            </div>
        </div>
    </div>
    <Modal
        title="New Organization"
        action-label="Save"
        action-class="btn-primary"
        v-model="showCreateModal"
        @action="createOrg">
        <form>
            <div class="mb-3">
                <label for="orgNameInput" class="form-label">Organization Name</label>
                <input type="text" id="orgNameInput" class="form-control" v-model="newOrgName">
            </div>
        </form>
    </Modal>
    <Modal
        title="Delete Organization"
        action-label="Delete"
        action-class="btn-danger"
        v-model="showDeleteModal"
        @action="deleteOrg">
        <p>Are you sure you want to delete the organization "{{ orgNameToDelete }}"?</p>
    </Modal>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import OrgCard from '@/components/OrgCard.vue'
import { useOrgStore } from '@/stores/org'
import { useAuthStore } from '@/stores/auth'
import { useRolesStore } from '@/stores/roles'
import { useClearancesStore } from '@/stores/clearances'
import { useErrorsStore } from '@/stores/errors'
import Modal from '@/components/Modal.vue'

const auth = useAuthStore()
const org = useOrgStore()
const roles = useRolesStore()
const clearances = useClearancesStore()
const errors = useErrorsStore()

const showCreateModal = ref(false)
const newOrgName = ref('')

const showDeleteModal = ref(false)
const indexToDelete = ref(-1)
const orgNameToDelete = computed(() => {
    return indexToDelete.value > -1 ? org.orgData[org.orgIds[indexToDelete.value]].name : ''
})

const isClearancesLoading = ref(false)
const clearancesByOrgId = ref({})

async function loadClearances() {
    if(!roles.isStudent) {
        return
    }
    try {
        isClearancesLoading.value = true
        const records = await clearances.getStudentClearances(roles.studentRole.studentId)
        for(const clearance of records) {
            clearancesByOrgId.value[clearance.orgId] = clearance
        }
    } catch(e) {
        console.error(e)
        errors.add(`Cannot load student clearances: ${e.message}`)
    } finally {
        isClearancesLoading.value = false
    }
}

const isSysAdmin = computed(() => {
        return roles.isSysAdmin
    })

async function createOrg($event) {
    try {
        await org.createOrg(newOrgName.value)
        newOrgName.value = ''
        $event.close()
    } catch(e) {
        $event.error()
        console.error(e)
        errors.add(`Cannot create new organization: ${e.message}`)
    }
}

function askToDelete(idx) {
    indexToDelete.value = idx
    showDeleteModal.value = true
}

async function deleteOrg($event) {
    if(indexToDelete.value > -1) {
        try {
            const index = indexToDelete.value
            const { id } = org.orgData[org.orgIds[index]]
            await org.deleteOrg(id)
            indexToDelete.value = -1
            delete org.orgData[id]
            org.orgIds.splice(index, 1)
            $event.close()
        } catch(e) {
            $event.error()
            console.error(e)
            errors.add(`Cannot delete organization: ${e.message}`)
        }
    }
}

onMounted(async () => {
    await org.loadCurrentUserOrgs()
    await loadClearances()
})
</script>
