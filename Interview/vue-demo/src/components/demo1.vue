<template>
  <div class="hello">
    <!-- <p v-for="(child,index) in chilren" :key="index" v-if="isFolder">{{child.title}}</p> -->

    <template v-if="isFolder">
      <p v-for="(child,index) in children" :key="index" >{{child.title}}</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'demo1',
  data() {
    return {
      children: [
        {title: 'foo'},
        {title: 'bar'}
      ] 
    }
  },
  computed: {
    isFolder() {
      return this.children && this.children.length > 0
    }
  },
  mounted() {
    console.log(this.$options.render) // 判断了条件再看是否执行_l
  },
  methods: {
    
  }
}
</script>
