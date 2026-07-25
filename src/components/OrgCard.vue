<template>
    <div class="card btn" @click="onClick">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img :src="props.data.thumbnail" class="rounded-circle org-img">
                    <div class="ms-3 card-text">
                        <p class="fw-bold mb-1">{{ props.data.name }}</p>
                    </div>
                </div>
                <span
                    v-if="props.isLoadingApproved"
                    class="spinner-border spinner-border-sm text-success"
                    role="status">
                    <span class="visually-hidden">Loading...</span>
                </span>
                <span
                    v-else-if="props.isApproved"
                    class="badge rounded-pill text-bg-success">
                    Approved
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import router from '@/plugins/router'

const props = defineProps({
    id: String,
    data: Object,
    isApproved: Boolean,
    isLoadingApproved: Boolean
})

function onClick() {
    router.push({ name: 'organization', params: { orgId: props.id } })
}
</script>
<style>
img.org-img {
    width: 45px;
    height: 45px;
}
</style>