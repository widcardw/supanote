<script setup lang="ts">
import { EditorView } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { useDebounceFn } from '@vueuse/core'
// import { foldGutter } from '@codemirror/language'
import { highlightActiveLine, scrollPastEnd } from '@codemirror/view'
import { Compartment } from '@codemirror/state'
import { dateToString } from '#imports'

const props = defineProps<{
  modifiedAt: Date
  doc: string
  title: string
}>()

const emits = defineEmits<
{(e: 'update:doc', doc: string): void
(e: 'update:title', title: string): void
(e: 'edit', time: number): void
}>()

const modelDoc = useModel(props, 'doc')
const modelTitle = useModel(props, 'title')

const container = ref<HTMLDivElement>()
const colorMode = useColorMode()

const dark = computed(() => colorMode.value === 'dark')
const themeConfig = new Compartment()
let watchDarkStop: Function | null
let watchDocStop: Function | null

let editor: EditorView | null = null

onMounted(/* async */ () => {
  if (editor) {
    return
  }
  // const ixora = (await import('@retronav/ixora')).default
  editor = new EditorView({
    doc: modelDoc.value || '',
    parent: container.value,
    extensions: [
      highlightActiveLine(),
      // foldGutter({
      //   openText: '▾',
      //   closedText: '▸'
      // }),
      themeConfig.of(EditorView.theme({}, { dark: dark.value })),
      markdown(),
      scrollPastEnd(),
      EditorView.lineWrapping,
      // ixora,
      EditorView.updateListener.of((viewUpdate) => {
        if (viewUpdate.docChanged) {
          updateModelDoc()
        }
      })
    ]
  })

  const updateModelDoc = useDebounceFn(() => {
    modelDoc.value = getDoc()
    emits('edit', Date.now())
  }, 5000)

  function setDark (dark: boolean) {
    editor.dispatch({
      effects: themeConfig.reconfigure(EditorView.theme({}, { dark }))
    })
  }

  function getDoc () {
    return editor.state.doc.toString()
  }

  function setDoc (text: string) {
    if (editor.state.doc.toString() !== text) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } })
    }
  }

  watchDarkStop = watch(dark, v => setDark(v))
  watchDocStop = watch(modelDoc, doc => setDoc(doc))
})

onBeforeUnmount(() => {
  watchDarkStop?.()
  watchDocStop?.()
  editor?.destroy()
})

</script>

<template>
  <div>
    <div class="flex items-center gap-2 justify-between px-2 title-bar">
      <UInput v-model="modelTitle" color="white" variant="none" class="title flex-1" />
      <div class="modified-at">
        {{ dateToString(modifiedAt) }}
      </div>
    </div>
    <div ref="container" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata&display=swap');

.title {
  font-weight: bold;
  font-size: 1.25rem;
}

.modified-at {
  font-size: 0.875rem;
  opacity: 0.5;
}

.cm-editor .cm-content {
  font-family: "Inconsolata", "PingFang SC", "Microsoft YaHei UI", sans-serif;
  font-variant-ligatures: discretionary-ligatures;
}

.cm-editor {
  height: calc(100vh - 100px);
}

.cm-editor.cm-focused { outline: none }

.title-bar {
  box-shadow: 0 1px 0 0 #77777720;
}
</style>
