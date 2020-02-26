<template>

    <div class="stat" id="card-collection">

        <div v-if="error" class="error">{{ error }}</div>

        <!--<h1 class="zoomTarget">{{ $route.params.id }}</h1>-->
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>



        <div v-else class="content">
            <h1>Community members</h1>
            <ul id="example-1">
                <li v-for="item in stat" v-bind:key="item.id">
                    <IdCard class="zoomTarget idcard" data-targetsize="0.65" data-duration="600" :id="item.id"
                            :display-name="item.displayName" :photo="item.picture" :tags="item.skills_ellipsis"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import Loader from '@/components/Loader.vue'
    import IdCard from '@/components/IdCard.vue'
    import {Response} from "request";
    import ApiClient from "@/ApiClient";
    import PersonResponse from "@/model/PersonResponse";
    import EnhancedPersonResponse from "@/model/EnhancedPersonResponse";

    @Component({
        components: {Loader, IdCard}
    })
    export default class IdCardCollection extends Vue {

        loading = false;
        stat: EnhancedPersonResponse[] = [];
        error = null;

        mounted() {
            this.loadData(this.$route.params.id)
        }

        @Watch('$route.params.id')
        onRouteChanged(val: string) {
            this.$log.debug("route changed");
            this.loadData(val);
        }

        private loadData(tag: string) {
            this.$log.debug("Loading data for tag ", tag);
            this.error = null;
            this.loading = true;

            ApiClient.loadPeopleFromCommunity(tag, (error: any, response: Response, body: any) => {
                this.loading = false;
                if (error) {
                    this.$log.error("Can't retrieve data");
                    this.$log.error(error);
                    this.error = error;
                    this.loading = false;
                } else {
                    let raw_data: PersonResponse[] = JSON.parse(body).list;
                    this.stat = ApiClient.convertPersonListToEnhancedPersonList(raw_data,tag);
                    this.$log.debug('content retrieved: ', this.stat);
                }
            });

        }

        updated() {
            this.$nextTick(function () {
                // Code that will run only after the
                // entire view has been re-rendered
                // @ts-ignore
                window.$(".zoomTarget").zoomTarget();
            })
        }

    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 20px 20px 20px 10px;
    }

    a {
        color: #42b983;
    }
</style>
