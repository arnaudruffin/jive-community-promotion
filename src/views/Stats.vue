import IdCardCollection from "*.vue";
<template>
    <div class="stats">
        <div v-if="error" class="error">{{ error }}</div>
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="tagStatistics.wordCounts">

            <p>
                <label for="total">{{count_members}} / {{count_objective}} members </label>
                <progress id="total" :max="count_objective" :value="count_members"> 70%</progress>
            </p>
            <p>
                <label for="total_pic">{{count_members_with_pictures}} / {{count_objective}} members with
                    pictures </label>
                <progress id="total_pic" :max="count_objective" :value="count_members_with_pictures"> 70%</progress>
            </p>
            <p>
                <label for="total_tags">{{count_members_with_at_least_N_tags}} / {{count_objective}} members with at
                    least {{count_tag_objective}} tags </label>
                <progress id="total_tags" :max="count_objective" :value="count_members_with_at_least_N_tags"> 70%
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

    @Component({
        components: {TagWordCloud, Loader}
    })
    export default class Stats extends Vue {

        loading = false;

        count_members = 0;
        count_members_with_pictures = 0;
        count_members_with_at_least_N_tags = 0;

        tagStatistics: TagStatistics = {top5members: {}, wordCounts:[]};

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
            this.count_members = 0;
            this.count_members_with_pictures = 0;
            this.count_members_with_at_least_N_tags = 0;

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
                    data.forEach(item => {
                        this.count_members++;

                        if (item.photos) {
                            this.count_members_with_pictures++;
                        }

                        let tags = item.tags.filter((el: string) => {
                            return el !== tag
                        });
                        if (tags.length >= this.count_tag_objective) {
                            this.count_members_with_at_least_N_tags++;
                        }
                        skills.push(tags);
                    });

                    let flattenSkills = [].concat.apply([], skills);
                    const counts = flattenSkills.reduce(function (stats: any, word: string) {
                        if (stats.hasOwnProperty(word)) {
                            stats[word] = stats[word] + 1;
                        } else {

                            stats[word] = 1;
                        }
                        return stats;
                    }, {});

                    this.$log.debug('tag stats: ', counts);
                    Object.keys(counts).forEach(e => this.tagStatistics.wordCounts.push({name: e, value: counts[e]} as WordCount));
                    this.$log.info('formatted tag stats: ', this.tagStatistics.wordCounts);

                    //search for top 5
                    // Create items array
                    let items = Object.keys(counts).map(function (key) {
                        return [key, counts[key]];
                    });

                    // Sort the array based on the second element
                    items.sort(function (first, second) {
                        return second[1] - first[1];
                    });

                    // Create a new array with only the first 5 items
                    const top5 = items.slice(0, 5);
                    this.$log.debug('top 5 stats: ',top5);


                    top5.forEach(top => {
                        this.tagStatistics.top5members[top[0]] = [];

                    });

                    // @ts-ignore
                    data.forEach(item => {
                        top5.forEach(top => {
                            if (item.tags.indexOf(top[0]) > -1) {
                                this.tagStatistics.top5members[top[0]].push(item.displayName)
                            }
                        });
                    });

                    this.$log.debug('top 5 members : ', this.tagStatistics.top5members);

                }
            });
        }

    }

</script>
