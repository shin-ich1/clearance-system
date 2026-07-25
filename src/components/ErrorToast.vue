<template>
    <div ref="toast" class="toast align-text-center text-bg-danger my-1" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">{{ props.message }}</div>
            <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Toast } from 'bootstrap'

const props = defineProps({
    message: String
})

const emit = defineEmits([ 'hidden' ])

const toast = ref(null)

onMounted(() => {
    Toast.getOrCreateInstance(toast.value).show()
    toast.value.addEventListener('hidden.bs.toast', () => {
        emit('hidden')
    })
})
</script>