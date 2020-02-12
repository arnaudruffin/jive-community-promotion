<template>
    <div id="app">
        <wordcloud v-if="words"
                   :data="words"
                   nameKey="name"
                   valueKey="value"
                   :color="myColors"
                   :showTooltip="false"
        />
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
        @Prop({default: [{name: "welcome", value: 100}]}) private words: WordCount[] | undefined
        myColors= ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef']
    }
</script>
