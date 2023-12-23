<script setup lang="ts">
const props = defineProps<{
  editAt: number
}>()

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  (e: 'fold'): void
  (e: 'fetch'): void
  (e: 'upload'): void
  (e: 'new'): void
}>()

const label = ref('') // computed(() => 'Edited at ' + dateToString(new Date(props.editAt)))

watch(
  () => props.editAt,
  (v) => { label.value = 'Edited at ' + dateToString(new Date(v)) }
)

function upload () {
  // TODO: upload trigger
  emits('upload')
  label.value = 'Saved at ' + dateToString(new Date())
}
</script>

<template>
  <div class="w-full flex items-center justify-between status-bar">
    <UButton color="white" variant="ghost" @click="emits('fold')">
      Fold
    </UButton>
    <div>
      <UButton v-if="editAt > 0" color="white" variant="ghost">
        {{ label }}
      </UButton>
      <UButton color="white" variant="ghost" @click="emits('new')">
        New
      </UButton>
      <UButton color="white" variant="ghost" @click="emits('fetch')">
        Fetch
      </UButton>
      <UButton color="white" variant="ghost" @click="upload">
        Upload
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  box-shadow: 0 -1px 0 0 #77777720;
}
</style>
