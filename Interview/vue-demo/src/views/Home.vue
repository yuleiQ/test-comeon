<template>
  <div class="home">
    <demo1 msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Demo1 from '@/components/demo1.vue'

export default {
  name: 'Home',
  components: {
    Demo1
  }
}
</script>
