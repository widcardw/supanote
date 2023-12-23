<script setup lang="ts">
const props = defineProps<{
  editAt: number
  current: number
  savedAt?: number
  uploading?: boolean
  newing?: boolean
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

watch(
  () => props.savedAt,
  (v) => { label.value = 'Saved at ' + dateToString(new Date(v)) }
)
</script>

<template>
  <div class="w-full flex items-center justify-between status-bar">
    <UButton size="xs" color="white" variant="ghost" @click="emits('fold')">
      Fold
    </UButton>
    <div class="flex items-center">
      <UButton v-if="editAt > 0" size="xs" color="white" variant="ghost">
        {{ label }}
      </UButton>
      <UButton
        square
        color="white"
        variant="ghost"
        @click="emits('new')"
      >
        <template #trailing>
          <UIcon v-if="newing" name="i-heroicons-arrow-path" class="uploading" />
          <UIcon v-else name="i-heroicons-plus-circle" />
        </template>
      </UButton>
      <UButton
        square
        color="white"
        variant="ghost"
        @click="emits('fetch')"
      >
        <template #trailing>
          <UIcon name="i-heroicons-arrow-down-circle" />
        </template>
      </UButton>
      <UButton
        square
        color="white"
        variant="ghost"
        @click="upload"
      >
        <template #trailing>
          <UIcon v-if="uploading" name="i-heroicons-arrow-path" class="uploading" />
          <UIcon v-else name="i-heroicons-arrow-up-circle" />
        </template>
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  box-shadow: 0 -1px 0 0 #77777720;
}

@keyframes rotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.uploading {
  animation: rotating 2s linear infinite;
}
</style>
