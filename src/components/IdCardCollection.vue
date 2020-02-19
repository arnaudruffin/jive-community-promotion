<template>

    <div class="stat" id="card-collection">
        <!--<h1 class="zoomTarget">{{ $route.params.id }}</h1>-->
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>

        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="stat" class="content">

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


    interface EnhancedPersonResponse extends PersonResponse{
        skills:string[],
        picture:string,
        skills_ellipsis:string[]
    }

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
                    let data: EnhancedPersonResponse[] = JSON.parse(body).list;
                    this.$log.debug(data);
                    data.forEach(item => {
                        if (item.photos) {
                            item.picture = item.photos[0].value
                        } else {
                            item.picture = "https://vignette.wikia.nocookie.net/leon-smallwood/images/e/e2/UNKNOWN_PERSON.png/revision/latest?cb=20150903003647"
                        }
                        item.skills = item.tags.filter((el: string) => {
                            return el !== tag
                        }).slice(0, 4);
                        if (item.tags.length > 5) {
                            this.$log.debug("adding .... on skills");
                            item.skills.push("...")
                        } else if (item.skills && item.skills.length === 0) {
                            this.$log.debug("adding ??? on skills");
                            item.skills.push("???")
                        }
                        item.skills_ellipsis = item.skills.map((input: string) => input.length > 24 ? input = `${input.substring(0, 21)}...` : input);
                        this.$log.debug("skills: ", item.skills_ellipsis);
                    });
                    this.stat = data;
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
