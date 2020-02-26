<template>

    <div class="random-top-5" id="random-top-5">
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div class="zoomViewport" v-if="person">
            <h1>Random member:</h1>
            <div class="zoomContainer">
                <div >
                    <IdCard
                            id="randomMember"
                            class="zoomTarget idcard" data-targetsize="0.60" data-duration="200"
                            :display-name="person.displayName"
                            :photo="person.picture"
                            :tags="person.skills_ellipsis"/>
                </div>
            </div>
        </div>


    </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Loader from "@/components/Loader.vue";
    import ApiClient from "@/ApiClient";
    import {Response} from "request";
    import PersonResponse from "@/model/PersonResponse";
    import IdCard from "@/components/IdCard.vue";

    @Component({
        components: {Loader, IdCard}
    })
    export default class RandomMember extends Vue {
        loading = false;
        error = null;
        person: PersonResponse | null = null;

        mounted() {
            this.loadData(this.$route.params.id)
        }


        destroyed() {
            this.$log.debug("destroyed");
            // @ts-ignore
            window.$("#app").click();
        }

        @Watch('$route.params.id')
        onRouteChanged(val: string) {
            this.$log.debug("route changed");
            this.loadData(val);
        }

        updated() {
            this.$log.debug("updated");
            this.$nextTick(function () {
                // Code that will run only after the
                // entire view has been re-rendered
                // @ts-ignore
                window.$(".zoomTarget").zoomTarget();
                // @ts-ignore
                window.$("#randomMember").click();
            })
        }

        private loadData(tag: string) {
            this.$log.debug("Loading data for tag ", tag);
            this.error = null;
            this.loading = true;

            this.person = null;

            const skills: any = [];
            ApiClient.loadPeopleFromCommunity(tag, (error: any, response: Response, body: any) => {
                this.loading = false;
                if (error) {
                    this.$log.error("Can't retrieve data");
                    this.$log.error(error);
                    this.error = error;
                    this.loading = false;
                } else {
                    let list: PersonResponse[] = JSON.parse(body).list;
                    const anyPerson = list[list.length * Math.random() << 0];
                    this.$log.debug('random gives  : ', this.person);
                    this.person = ApiClient.convertPersonListToEnhancedPersonList([anyPerson], tag)[0];
                }
            });
        }

    }
</script>
<style scoped>

    * {
        box-sizing: border-box;
    }

    html, body {
        height: 100%;
        margin: 0;
    }

    .zoomViewport {
        height: 100vh;
    }

</style>