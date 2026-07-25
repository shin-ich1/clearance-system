<template>
    <div class="container pt-2">
        <div class="d-flex align-items-center mb-2">
            <h1 class="me-auto">School Years</h1>
            <button
                class="btn btn-primary btn-lg"
                @click="showCreateModal = true">
                New School Year
            </button>
        </div>
        <div class="container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>School Year</th>
                        <th>Current</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(schoolYear, index) in data" :class="{'table-active': schoolYear.current}">
                        <td>{{ schoolYear.id }}</td>
                        <td>{{ schoolYear.current ? 'Yes' : 'No' }}</td>
                        <td class="d-grid gap-1 d-flex">
                            <button
                                type="button"
                                class="btn btn-sm"
                                :class="{'btn-primary': !schoolYear.current, 'btn-secondary': schoolYear.current}"
                                :disabled="schoolYear.current"
                                @click="askToSetCurrent(index)">
                                <i class="bi bi-check-circle-fill"></i>
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm"
                                :class="{'btn-danger': !schoolYear.current, 'btn-secondary': schoolYear.current}"
                                @click="askToDelete(index)"
                                :disabled="schoolYear.current">
                                <i class="bi bi-x-circle-fill"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Modal
        title="New School Year"
        action-label="Save"
        action-class="btn-primary"
        v-model="showCreateModal"
        @action="createNewSchoolYear">
        <form>
            <div class="mb-3">
                <label for="schoolYearInput" class="form-label">School Year</label>
                <input type="text" class="form-control" id="schoolYearInput" v-model="newSchoolYear.id">
            </div>
            <div class="form-check">
                <input type="checkbox" id="setAsCurrentCheckBox" class="form-check-input" v-model="newSchoolYear.current">
                <label for="setAsCurrentCheckBox" class="form-check-label">Set as current</label>
            </div>
        </form>
    </Modal>
    <Modal
        title="Set Current School Year"
        action-label="Yes"
        action-class="btn-primary"
        v-model="showSetCurrentModal"
        @action="setSchoolYearToCurrent">
        <p>Are you sure you want to set {{ syToSetCurrent }} as the current School Year?</p>
    </Modal>
    <Modal
        title="Delete School Year"
        action-label="Delete"
        action-class="btn-danger"
        v-model="showDeleteModal"
        @action="deleteSchoolYear">
        <p>Are you sure you want to delete the School Year: {{ syToDelete }}?</p>
    </Modal>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSchoolYearsStore } from '@/stores/schoolYears'
import { useErrorsStore } from '@/stores/errors'
import Modal from '@/components/Modal.vue'
import makeReactive from '@/util/makeReactive'

const errors = useErrorsStore()
const schoolYears = useSchoolYearsStore()

const isLoadingData = ref(false)
const data = ref([])

const showCreateModal = ref(false)
const {
    data: newSchoolYear,
    reset: resetNewSchoolYear,
    unwrap: unwrapNewSchoolYear
} = makeReactive({ id: '', current: false })

const showSetCurrentModal = ref(false)
const indexToSetCurrent = ref(-1)
const syToSetCurrent = computed(() => {
    return indexToSetCurrent.value > -1 ? data.value[indexToSetCurrent.value].id : ''
})

const showDeleteModal = ref(false)
const indexToDelete = ref(-1)
const syToDelete = computed(() => {
    return indexToDelete.value > -1 ? data.value[indexToDelete.value].id : ''
})

onMounted(async () => {
    try {
        isLoadingData.value = true
        data.value = await schoolYears.getSchoolYears()
    } catch(e) {
        console.error(e)
        errors.add(`Cannot load school years: ${e.message}`)
    } finally {
        isLoadingData.value = false
    }
})

function askToSetCurrent(idx) {
    indexToSetCurrent.value = idx
    showSetCurrentModal.value = true
}

function askToDelete(idx) {
    indexToDelete.value = idx
    showDeleteModal.value = true
}

async function createNewSchoolYear($event) {
    let previousSyIdx = data.value.findIndex(sy => sy.current)

    try {
        const sy = await schoolYears.createSchoolYear(unwrapNewSchoolYear())
        data.value.push(sy)
        $event.close()

        resetNewSchoolYear()

        if(sy.current && previousSyIdx > -1) {
            const previousSy = data.value[previousSyIdx]
            const updatedSy = await schoolYears.createSchoolYear({
                id: previousSy.id,
                current: false
            })
            data.value[previousSyIdx] = updatedSy
        }
    } catch(e) {
        $event.error()
        console.error(e)
        errors.add(`Cannot create new school year: ${e.message}`)
    }
}

async function setSchoolYearToCurrent($event) {
    let previousSyIdx = data.value.findIndex(sy => sy.current)

    try {
        const syToUpdate = data.value[indexToSetCurrent.value]
        const newCurrentSy = await schoolYears.setCurrent(syToUpdate.id, true)
        data.value[indexToSetCurrent.value] = newCurrentSy
        indexToSetCurrent.value = -1

        if(previousSyIdx > -1) {
            const previousSy = data.value[previousSyIdx]
            const newPrevSy = await schoolYears.setCurrent(previousSy.id, false)
            data.value[previousSyIdx] = newPrevSy
        }

        $event.close()
    } catch(e) {
        $event.error()
        console.error(e)
        errors.add(`Cannot set current school year: ${e.message}`)
    }
}

async function deleteSchoolYear($event) {
    if(indexToDelete.value > -1) {
        try {
            const sy = data.value[indexToDelete.value]
            await schoolYears.deleteSchoolYear(sy.id)
            data.value.splice(indexToDelete.value, 1)
            indexToDelete.value = -1
            $event.close()
        } catch(e) {
            $event.error()
            console.error(e)
            errors.add(`Cannot delete school year: ${e.message}`)
        }
    }
}
</script>