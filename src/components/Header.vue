<template>
    <header class="masthead">
            <div class="container">
                <div class="fs-1 fst-italic" v-if="props.greeting">
                    <span class="text-bg-light bg-opacity-75 rounded px-1">{{ props.greeting }}</span>
                </div>
                <div class="fs-1 fw-semibold text-uppercase">
                    <span class="text-bg-light bg-opacity-75 rounded px-1">{{ props.name }}</span>
                </div>
                <!-- <a class="btn btn-primary btn-xl text-uppercase" href="#clearance">Start</a> -->
            </div>
        </header>
</template>
<script setup>
const props = defineProps({
    greeting: {
        type: String,
        default: 'Welcome!'
    },
    name: String
})
</script>
<style>
header.masthead {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
  background-image: url("@/assets/img/header-bg.jpg");
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-position: center center;
  background-size: cover;
}

@media (min-width: 768px) {
  header.masthead {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
}
</style>