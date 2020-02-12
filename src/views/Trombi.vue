<template>
  <div class="trombi">
    <IdCardCollection msg="rocking it"/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import IdCardCollection from '../components/IdCardCollection.vue'
import {Component, Vue} from "vue-property-decorator";


@Component({
  components: {IdCardCollection}
})
export default class Trombi extends Vue {

}
</script>
