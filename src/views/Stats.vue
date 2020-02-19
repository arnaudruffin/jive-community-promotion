import IdCardCollection from "*.vue";
<template>
    <div class="stats">
        <div v-if="error" class="error">{{ error }}</div>
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="tagStatistics.wordCounts">

            <p>
                <label for="total">{{countStatistics.members}} / {{count_objective}} members </label>
                <progress id="total" :max="count_objective" :value="countStatistics.members"> 70%</progress>
            </p>
            <p>
                <label for="total_pic">{{countStatistics.membersWithPictures}} / {{count_objective}} members with
                    pictures </label>
                <progress id="total_pic" :max="count_objective" :value="countStatistics.membersWithPictures"> 70%</progress>
            </p>
            <p>
                <label for="total_tags">{{countStatistics.membersWithASufficientAmountOfTags}} / {{count_objective}} members with at
                    least {{count_tag_objective}} tags </label>
                <progress id="total_tags" :max="count_objective" :value="countStatistics.membersWithASufficientAmountOfTags"> 70%
                </progress>
            </p>
        </div>


        <TagWordCloud v-if="tagStatistics.wordCounts" :words="tagStatistics.wordCounts"/>
    </div>
</template>

<script lang="ts">


    import {Component, Vue, Watch} from "vue-property-decorator";
    import {Response} from "request";
    import TagWordCloud from "@/components/TagWordCloud.vue";
    import WordCount from "@/model/WordCount";
    import Loader from '@/components/Loader.vue'
    import ApiClient from "@/ApiClient";
    import TagStatistics from "@/model/TagStatistics";
    import PersonResponse from "@/model/PersonResponse";
    import PersonResponseStatistics from "@/model/PersonResponseStatistics";
    import CountStatistics from "@/model/CountStatistics";

    @Component({
        components: {TagWordCloud, Loader}
    })
    export default class Stats extends Vue {

        loading = false;


        tagStatistics: TagStatistics = {top5members: {}, wordCounts:[]};
        countStatistics : CountStatistics = {  members: 0,
            membersWithASufficientAmountOfTags: 0,
            membersWithPictures: 0};

        error = null;

        //TODO as query params, but with default values
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

            this.tagStatistics = {top5members: {}, wordCounts:[]};

            const skills: any = [];
            ApiClient.loadPeopleFromCommunity(tag, (error: any, response: Response, body: any) => {
                this.loading = false;
                if (error) {
                    this.$log.error("Can't retrieve data");
                    this.$log.error(error);
                    this.error = error;
                    this.loading = false;
                } else {
                    let data: PersonResponse[] = JSON.parse(body).list;
                    let stats: PersonResponseStatistics = ApiClient.extractStatisticsFromPersonResponse(data,this.count_tag_objective,tag);

                    this.tagStatistics = stats.tags;
                    this.countStatistics = stats.counts;

                    this.$log.debug('top 5 members : ', this.tagStatistics.top5members);

                }
            });
        }

    }

</script>
