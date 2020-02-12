<template>
  <div class="trombi">
    <IdCardCollection msg="rocking it"/>
  </div>
</template>

<script>
// @ is an alias to /src
import IdCardCollection from '@/components/IdCardCollection.vue'


export default {
  name: 'stats',
  components: {
    IdCardCollection
  }
}
</script>
