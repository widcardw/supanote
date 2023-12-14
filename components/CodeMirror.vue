<script setup lang="ts">
import { EditorView } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { foldGutter } from '@codemirror/language'
import { highlightActiveLine } from '@codemirror/view'
import { Compartment } from '@codemirror/state'

const container = ref<HTMLDivElement>()
const colorMode = useColorMode()

const dark = computed(() => colorMode.value === 'dark')
const themeConfig = new Compartment()

let editor: EditorView | null = null

onMounted(async () => {
  if (editor) {
    return
  }
  const ixora = (await import('@retronav/ixora')).default
  editor = new EditorView({
    doc: '',
    parent: container.value,
    extensions: [
      highlightActiveLine(),
      foldGutter({
        openText: '▾',
        closedText: '▸'
      }),
      themeConfig.of(EditorView.theme({}, { dark: dark.value })),
      markdown(),
      ixora
    ]
  })
  function setDark (dark: boolean) {
    editor.dispatch({
      effects: themeConfig.reconfigure(EditorView.theme({}, { dark }))
    })
  }

  watch(dark, v => setDark(v))
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <div ref="container" />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata&display=swap');
.cm-editor .cm-content { font-family: "Inconsolata" }
</style>
