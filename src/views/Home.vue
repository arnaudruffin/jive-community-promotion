<template>
    <div class="home">
        <img alt="Trombi logo" src="../assets/trombi.png" width="200px">
        <HelloWorld msg="Where do you think your going?" sub_msg="There is absolutely nothing here..."/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'

    export default {
        name: 'home',
        components: {
            HelloWorld
        }
    }
</script>
