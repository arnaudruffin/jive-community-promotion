<template>

    <div class="goals" id="goals">
        <Loader v-if="loading"/>


        <div v-if="error" class="error">{{ error }}</div>


        <div v-if="loading" class="loading">Loading...</div>

        <div v-else id="progresses">
            <Progress :radius="55" :strokeWidth="10" :value="percentMembers">
                <template v-slot:footer>
                    <b>Total members: {{countStatistics.members}}<br /> (objective: {{count_objective}})</b>
                </template>
            </Progress>


            <div class="break"></div> <!-- break -->

            <Progress
                    strokeColor="#1ba4e3"
                    :transitionDuration="5000"
                    :radius="55"
                    :strokeWidth="5"
                    :value="percentMembersWithPictures"
            >
                <template v-slot:footer>
                    <b>with a pictures<br />-</b>
                </template>
            </Progress>
            <div></div>

            <Progress
                    strokeColor="#1ba4e3"
                    :transitionDuration="5000"
                    :radius="55"
                    :strokeWidth="5"
                    :value="percentMembersWithSufficientNumberOfTags"
            >
                <template v-slot:footer>
                    <b>with at least <br />{{count_tag_objective}} tags <br/> </b>
                </template>
            </Progress>

        </div>


    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import Loader from '@/components/Loader.vue'
    //@ts-ignore
    import Progress from '@/../node_modules/easy-circular-progress/src/index.js';
    import ApiClient from "@/ApiClient";
    import {Response} from "request";
    import PersonResponse from "@/model/PersonResponse";
    import PersonResponseStatistics from "@/model/PersonResponseStatistics";
    import CountStatistics from "@/model/CountStatistics";


    @Component({
        components: {Loader, Progress}
    })
    export default class Goals extends Vue {

        loading = false;
        error = null;
        //TODO should be properties, set by queryparams if needed
        count_objective = 100;
        count_tag_objective = 3; //should be >= to count

        countStatistics: CountStatistics = {
            members: 0,
            membersWithASufficientAmountOfTags: 0,
            membersWithPictures: 0
        };

        mounted() {
            this.loadData(this.$route.params.id)
        }

        @Watch('$route.params.id')
        onRouteChanged(val: string) {
            this.$log.debug("route changed");
            this.loadData(val);
        }

        get percentMembers() {
            const value = this.countStatistics.members / this.count_objective * 100;
            return Number(value).toFixed(2);
        }

        get percentMembersWithPictures() {
            const value = this.countStatistics.membersWithPictures / this.countStatistics.members * 100
            return Number(value).toFixed(2);
        }

        get percentMembersWithSufficientNumberOfTags() {
            const value = this.countStatistics.membersWithASufficientAmountOfTags / this.countStatistics.members * 100
            return Number(value).toFixed(2);
        }

        private loadData(tag: string) {

            this.$log.debug("Loading data for tag ", tag);
            this.error = null;
            this.loading = true;

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
                    let stats: PersonResponseStatistics = ApiClient.extractStatisticsFromPersonResponse(data, this.count_tag_objective, tag);
                    this.countStatistics = stats.counts;
                }
            });
        }


    }
</script>
<style lang="css" scoped>
    #progresses {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        height: 80vh;
        color: #fff;
        background: #3e423a;
        display: flex;
        justify-content: center;
        align-items: end;
        flex-wrap: wrap;
    }

    body {
        margin: 0;
        padding: 0;
    }

    .break {
        flex-basis: 100%;
        height: 0;
    }
</style>
