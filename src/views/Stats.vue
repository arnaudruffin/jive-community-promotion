import IdCardCollection from "*.vue";
<template>
    <div class="stats">
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="tagStags">

            <p>
            <label for="total">{{count_members}} / {{count_objective}} members </label>
            <progress id="total" :max="count_objective" :value="count_members"> 70% </progress>
            </p>
            <p>
                <label for="total_pic">{{count_members_with_pictures}} / {{count_objective}} members with pictures </label>
                <progress id="total_pic" :max="count_objective" :value="count_members_with_pictures"> 70% </progress>
            </p>
            <p>
                <label for="total_tags">{{count_members_with_at_least_N_tags}} / {{count_objective}} members with at least {{count_tag_objective}} tags </label>
                <progress id="total_tags" :max="count_objective" :value="count_members_with_at_least_N_tags"> 70% </progress>
            </p>
        </div>



        <TagWordCloud v-if="tagStags" :words="tagStags"/>
    </div>
</template>

<script lang="ts">


    import {Component, Vue, Watch} from "vue-property-decorator";
    import {VUE_APP_PROX} from "../main";
    import * as request from "request";
    import {Response} from "request";
    import TagWordCloud from "@/components/TagWordCloud.vue";
    import WordCount from "@/WordCount";
    import Loader from '@/components/Loader.vue'
    //@ts-ignore
    import RadialProgressBar from 'vue-radial-progress'

    @Component({
        components: {TagWordCloud,Loader,RadialProgressBar}
    })
    export default class Stats extends Vue {

        loading = false;
        tagStags: WordCount[] = [];
        count_members = 0;
        count_members_with_pictures = 0;
        count_members_with_at_least_N_tags = 0;

        error = null;

        //TODO as query params
        count_objective = 100;
        count_tag_objective = 3; //should be >= to count

        mounted() {
            this.loadData(this.$route.params.id)
        }

        @Watch('$route.params.id')
        onRouteChanged(val: string) {
            this.loadData(val)
        }

        private loadData(tag: string) {
            this.$log.debug("Loading data for tag ", tag);
            this.error = null;
            this.loading = true;
            this.count_members = 0;
            this.count_members_with_pictures = 0;
            this.count_members_with_at_least_N_tags = 0;
            this.tagStags = []
            const skills:any = [];

            const url = VUE_APP_PROX + "/api/core/v3/search/people?sort=updatedDesc&fields=id,type,thumbnailUrl,displayName,photos,tags&filter=tag(" + tag + ")&filter=search%28%2A%29&origin=spotlight&startIndex=0&count=100";
            request.get(url, (error: any, response: Response, body: any) => {
                this.loading = false;
                if (error) {
                    this.$log.error("Can't retrieve data");
                    this.$log.error(error);
                    this.error = error;
                    this.loading = false;
                } else {
                    let data = JSON.parse(body).list;

                    // @ts-ignore
                    data.forEach(item => {
                        this.count_members++;

                        if (item.photos) {
                            this.count_members_with_pictures++;
                        }


                        let tags = item.tags.filter((el: string) => {return el !== tag});
                        if(tags.length>= this.count_tag_objective){
                            this.count_members_with_at_least_N_tags++;
                        }
                        skills.push(tags);
                    });

                  let flattenSkills = [].concat.apply([], skills);
                  const counts = flattenSkills.reduce(function ( stats:any, word:string ) {
                    if ( stats.hasOwnProperty( word ) ) {
                      stats[ word ] = stats[ word ] + 1;
                    } else {

                      stats[ word ] = 1;
                    }

                    return stats;

                  }, {} );

                  this.$log.info('tag stats: ', counts);
                  //Object.keys(counts).forEach(e => this.tagStags.push({name: e , value:counts[e]}));
                  Object.keys(counts).forEach(e => this.tagStags.push({name: e , value:counts[e]} as WordCount));
                  this.$log.info('formatted tag stats: ', this.tagStags);

                }
            });
        }

    }

</script>
