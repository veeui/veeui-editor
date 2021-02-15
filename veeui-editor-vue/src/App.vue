<template>
  <div>
    <VisualEditor v-model="jsonData" :config="VisualEditorConfig"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VisualEditor, VisualEditorConfig } from './components'

export default defineComponent({
  name: 'App',
  components: {
    VisualEditor
  },
  data() {
    return {
      VisualEditorConfig,
      jsonData: {
        container: {
          height: 500,
          width: 800
        },
        blocks: [
          {
            top: 100,
            left: 100,
            componentKey: 'button'
          },
          {
            top: 200,
            left: 200,
            componentKey: 'input'
          }
        ]
      }
    }
  }
});
</script>

<style lang="scss">

</style>
