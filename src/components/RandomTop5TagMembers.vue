<template>

    <div class="random-top-5" id="random-top-5">
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <h2 v-if="skillName">One of the top skill in our community: </h2>
        <h1 v-if="skillName">{{skillName}}</h1>
        <br/>
        <p v-if="skillName">Here are some people with this skill:</p>

        <infinite-slide-bar duration="30s">
            <div class="items">
                <div v-for="item in people" v-bind:key="item.id">
                    <IdCard class="zoomTarget idcard" data-targetsize="0.65" data-duration="600" :id="item.id"
                            :display-name="item.displayName" :photo="item.picture" :tags="item.skills_ellipsis"/>
                </div>
            </div>
        </infinite-slide-bar>

    </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Loader from "@/components/Loader.vue";
    import ApiClient from "@/ApiClient";
    import {Response} from "request";
    import PersonResponse from "@/model/PersonResponse";
    import PersonResponseStatistics from "@/model/PersonResponseStatistics";
    //@ts-ignore
    import InfiniteSlideBar from 'vue-infinite-slide-bar'
    import EnhancedPersonResponse from "@/model/EnhancedPersonResponse";
    import IdCard from "@/components/IdCard.vue";

    @Component({
        components: {Loader, InfiniteSlideBar, IdCard}
    })
    export default class RandomTop5TagMembers extends Vue {
        loading = false;
        error = null;
        skillName: string | null = null;
        people: EnhancedPersonResponse[] | null = null;

        mounted() {
            this.loadData(this.$route.params.id)
        }

        @Watch('$route.params.id')
        onRouteChanged(val: string) {
            this.$log.debug("route changed");
            this.loadData(val);
        }

        private randomKey(obj: Object): string {
            const keys = Object.keys(obj);
            //@ts-ignore
            return keys[keys.length * Math.random() << 0];
        }

        private loadData(tag: string) {
            this.$log.debug("Loading data for tag ", tag);
            this.error = null;
            this.loading = true;

            this.skillName = null;
            this.people = null;

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
                    let stats: PersonResponseStatistics = ApiClient.extractStatisticsFromPersonResponse(data, 99, tag);


                    this.$log.debug("top five members: ", stats.tags.top5members);

                    this.skillName = this.randomKey(stats.tags.top5members);
                    this.people = stats.tags.top5members[this.skillName];

                    this.$log.debug('random gives  : ', this.skillName);
                    this.$log.debug("members of random : ", this.people);
                }
            });
        }
    }
</script>
<style scoped> .items {
    display: flex;
    justify-content: space-around;
} </style>