<template>
    <div id="app">
        <wordcloud v-if="words"
                :data="words"
                nameKey="name"
                valueKey="value"
                color="Accent">
        </wordcloud>
    </div>
</template>


<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";
    //@ts-ignore
    import wordcloud from "vue-wordcloud"
    import WordCount from "@/WordCount";

    @Component({
        components: {
            wordcloud
        }
    })
    export default class TagWordCloud extends Vue {
        @Prop({default: [{name:"welcome",value:100}]}) private words: WordCount[] | undefined
    }
</script>
