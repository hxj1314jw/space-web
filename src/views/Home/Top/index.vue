<template>
  <SearchResult :hotStatus="hotStatus"/>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import SearchResult from '../Search/index.vue';

  @Component({
    components: {
      SearchResult
    }
  })

  export default class Top extends Vue {
    public hotStatus: number = 2;
  }
</script>
