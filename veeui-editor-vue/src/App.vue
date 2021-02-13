<template>
  <div>
    <VisualEditor v-model="jsonData"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VisualEditor } from './components'

export default defineComponent({
  name: 'App',
  components: {
    VisualEditor
  },
  data() {
    return {
      jsonData: {
        container: {
          height: 500,
          width: 800
        },
        blocks: [
          {
            top: 100,
            left: 100
          },
          {
            top: 200,
            left: 200
          }
        ]
      }
    }
  }
});
</script>

<style lang="scss">

</style>
