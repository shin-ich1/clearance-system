<template>
    <div class="modal fade" tabindex="-1" ref="modalEl">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ props.title }}</h5>
                    <button
                        type="button"
                        class="btn-close"
                        :disabled="isLoading"
                        @click="value = false">
                    </button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="value = false">
                        Close
                    </button>
                    <button
                        type="button"
                        class="btn"
                        :class="props.actionClass"
                        :disabled="isLoading || props.actionDisabled"
                        @click="emitAction">
                        <span
                            v-if="isLoading"
                            class="spinner-grow spinner-grow-sm"
                            role="status"
                            aria-hidden="true">
                        </span>
                        {{ props.actionLabel }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Modal } from 'bootstrap'
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Dialog Box'
    },
    actionLabel: {
        type: String,
        default: 'Save'
    },
    actionClass: {
        type: String,
        default: 'btn-primary'
    },
    actionDisabled: Boolean,
    modelValue: Boolean
})

const emit = defineEmits([ 'action', 'close', 'update:modelValue' ])

const modalEl = ref(null)
const isLoading = ref(false)

let bsModal

onMounted(() => {
    bsModal = new Modal(modalEl.value)
    modalEl.value.addEventListener('hidden.bs.modal', () => {
        value.value = false
        emit('close')
    })
})

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

watch(value, (shouldShow) => {
    if(bsModal) {
        if(shouldShow) {
            bsModal.show()
        } else {
            bsModal.hide()
        }
    }
})

function emitAction() {
    isLoading.value = true
    emit('action', {
        close: () => {
            isLoading.value = false
            value.value = false
        },
        error: () => {
            isLoading.value = false
        }
    })
}
</script>