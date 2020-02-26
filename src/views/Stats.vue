import IdCardCollection from "*.vue";
<template>
    <div class="stats">
        <div v-if="error" class="error">{{ error }}</div>
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="tagStatistics.wordCounts">

            <h1>Statistics</h1>

            <p></p>

            <vue-circle
                    :progress="percentMembersWithPictures"
                    :size="120"
                    :reverse="false"
                    line-cap="round"

                    empty-fill="rgba(0, 0, 0, .1)"
                    :animation-start-value="0.0"
                    :start-angle="90"
                    insert-mode="append"
                    :thickness="3"
                    :show-percent="false">
                {{percentMembersWithPictures}}% with a photograph <br/>📷
            </vue-circle>
            <vue-circle
                    :progress="percentMembers"
                    :size="190"
                    :reverse="false"
                    line-cap="round"
                    empty-fill="rgba(0, 0, 0, .1)"
                    :animation-start-value="0.0"
                    :start-angle="90"
                    insert-mode="append"
                    :thickness="5"
                    :show-percent="false">
                <h3>{{countStatistics.members}} membres</h3> we're hoping for {{countMemberObjective}} <br/> 😉
            </vue-circle>
            <vue-circle
                    :progress="percentMembersWithSufficientNumberOfTags"
                    :size="120"
                    :reverse="false"
                    line-cap="round"

                    empty-fill="rgba(0, 0, 0, .1)"
                    :animation-start-value="0.0"
                    :start-angle="90"
                    insert-mode="append"
                    :thickness="3"
                    :show-percent="false">
                {{percentMembersWithSufficientNumberOfTags}}% with at least {{countTagObjective}} skills <br/>🎓
            </vue-circle>
        </div>

        <p></p>

        <TagWordCloud v-if="tagStatistics.wordCounts" :words="tagStatistics.wordCounts"/>
    </div>
</template>

<script lang="ts">

    import {Component, Vue, Watch} from "vue-property-decorator";
    import {Response} from "request";
    import TagWordCloud from "@/components/TagWordCloud.vue";
    import Loader from '@/components/Loader.vue'
    import ApiClient from "@/ApiClient";
    import TagStatistics from "@/model/TagStatistics";
    import PersonResponse from "@/model/PersonResponse";
    import PersonResponseStatistics from "@/model/PersonResponseStatistics";
    import CountStatistics from "@/model/CountStatistics";
    //@ts-ignore
    import VueCircle from '@/../node_modules/vue2-circle-progress/dist/vue-circle-progress.js'

    @Component({
        components: {TagWordCloud, Loader, VueCircle}
    })
    export default class Stats extends Vue {
        error = null;
        loading = false;

        tagStatistics: TagStatistics = {top5members: {}, wordCounts: []};
        countStatistics: CountStatistics = {members: 0, membersWithASufficientAmountOfTags: 0, membersWithPictures: 0};

        get countTagObjective(): number {
            return Stats.isPathParamANumber(this.$route.query.skillGoal) ? Number(this.$route.query.skillGoal) : 3;
        }

        get countMemberObjective(): number {
            return Stats.isPathParamANumber(this.$route.query.memberGoal) ? Number(this.$route.query.memberGoal) : 100;
        }

        get percentMembers() {
            return Math.round(this.countStatistics.members / this.countMemberObjective * 100);
        }

        get percentMembersWithPictures() {
            return Math.round(this.countStatistics.membersWithPictures / this.countStatistics.members * 100);
        }

        get percentMembersWithSufficientNumberOfTags() {
            return Math.round(this.countStatistics.membersWithASufficientAmountOfTags / this.countStatistics.members * 100);
        }

        private loadData(tag: string) {
            this.$log.debug("Loading data for tag ", tag);
            this.error = null;
            this.loading = true;

            this.tagStatistics = {top5members: {}, wordCounts: []};

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
                    let stats: PersonResponseStatistics = ApiClient.extractStatisticsFromPersonResponse(data, this.countTagObjective, tag);

                    this.tagStatistics = stats.tags;
                    this.countStatistics = stats.counts;

                    this.$log.debug('top 5 members : ', this.tagStatistics.top5members);

                }
            });
        }

        mounted() {
            this.loadData(this.$route.params.id)
        }

        @Watch('$route.params.id')
        onRouteChanged(val: string) {
            this.loadData(val)
        }

        @Watch('$route.query.skillGoal')
        onGoalChanged(val: string) {
            this.loadData(this.$route.params.id)
        }

        @Watch('$route.query.memberGoal')
        onMemberGoalChanged(val: string) {
            this.loadData(this.$route.params.id)
        }

        private static isPathParamANumber(pathParam: string | (string | null)[]): boolean {
            const value = pathParam as string;
            return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
        }

    }

</script>
