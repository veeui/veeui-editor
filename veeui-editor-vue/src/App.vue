<template>
  <div>
    <VisualEditor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VisualEditor } from './components'

export default defineComponent({
  name: 'App',
  components: {
    VisualEditor
  }
});
</script>

<style lang="scss">

</style>
