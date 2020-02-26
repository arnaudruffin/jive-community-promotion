<template>

    <div class="random-top-5" id="random-top-5">
        <Loader v-if="loading"/>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="person" >
            <p>
            <IdCard
                    id="randomMember"
                    class="zoomTarget idcard" data-targetsize="0.65" data-duration="600"
                    :display-name="person.displayName"
                    :photo="person.picture"
                    :tags="person.skills_ellipsis"/>

            </p>
        </div>

    </div>
</template>
<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Loader from "@/components/Loader.vue";
    import ApiClient from "@/ApiClient";
    import {Response} from "request";
    import PersonResponse from "@/model/PersonResponse";
    import PersonResponseStatistics from "@/model/PersonResponseStatistics";
    import IdCard from "@/components/IdCard.vue";

    @Component({
        components: {Loader,IdCard}
    })
    export default class RandomMember extends Vue {
        loading = false;
        error = null;
        person: PersonResponse| null = null;

        mounted() {
            this.loadData(this.$route.params.id)
        }



        destroyed() {
            this.$log.debug("destroyed");
            // @ts-ignore
            window.$("#randomMember").click();
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
                    const anyPerson = list[ list.length * Math.random() << 0];
                    this.$log.debug('random gives  : ', this.person);
                    this.person = ApiClient.convertPersonListToEnhancedPersonList([anyPerson],tag)[0];
                }
            });
        }

    }
</script>
<style scoped>

    * {
        box-sizing:border-box;
    }



    /*
     * CSS Background Grid Lines by Jason Delia
     * https://codepen.io/jasonadelia/pen/DnrAe
     */
    .bg-grid-line,
    .card:after,
    .card header:before {
        background-color: #333;
        background-image:
                linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent);
        height:100%;
        background-size:50px 50px;
    }

    .card {
        position:relative;
        height:134px;
        width:250px;
        margin:0 auto;
        background:#ECECEC;
        border-radius:4px;

        box-shadow:
                inset 0 0 0 1px rgba(0, 0, 0, .4),
                0 0 10px rgba(0, 0, 0, .55),
                0 2px 10px rgba(0, 0, 0, .6)
    ;
    }


    /* card stripe */
    .card:before {
        position:absolute;
        z-index:2;
        content:'';
        left:50%;
        top:-22px;
        margin: 0 0 0 -13px;
        height:32px;
        width:25px;
        background: rgba(255, 255, 255, .2);
        background-image:
                linear-gradient(to right, rgba(255,255,255, .4) 0%, rgba(255,255,255, .1) 50%,rgba(255,255,255, .4) 100%),
                linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 40%),
                linear-gradient(to bottom, rgba(255, 255, 255, .8) 0%, rgba(255, 255, 255, 0) 40%)
    ;
        border-radius:2px;
        box-shadow:0 0 0 1px rgba(0, 0, 0, .8);
        opacity:.5;
    }


    /* card stripe clip */
    .card:after {
        position:absolute;
        content:'';
        z-index:2;
        height:7px;
        width:7px;
        top:-15px;
        left:50%;
        margin:0 0 0 -3px;

        border-radius:50%;
        box-shadow:
                0 0 0 2px rgba(255, 255, 255, .6),
                0 0 3px rgba(0, 0, 0, .7),
                inset 2px 2px 2px rgba(0, 0, 0, .5)
    ;
    }

    .card header {
        position:relative;
        background:#ED3D34;
        height:333px;
        width:100%;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        border-bottom:2px solid rgba(180, 80, 80, .5);
        border-top:1px solid rgba(221, 108, 108, .8);
        box-shadow:
                inset 0 1px 0 0 rgba(255, 120, 120, .8),
                0 1px 2px rgba(0, 0, 0, .4)
    ;

        padding:11px 7px;
        opacity:.9;
    }

    /* top gradient */
    .card header:after {
        position:absolute;
        content:'';
        left:1px;
        top:1px;
        width:100%;
        height:3px;
        background:
                linear-gradient(to top, rgba(255,255,255, .1) 0%, rgba(255,255,255,.05) 70%, rgba(255,255,255,0) 100%);
    }

    /* card hole */
    .card header:before {
        position:absolute;
        z-index:1;
        content:'';
        left:50%;
        top:7px;
        margin: 0 0 0 -18px;
        height:5px;
        width:33px;
        border-radius:8px;
        box-shadow:
                inset 1px 1px 0 1px rgba(0, 0, 0, .3),
                inset -1px -1px 0 0 rgba(255, 255, 255, .5)
    ;
    }

    .card header h1 {
        color:#fff;
        line-height:90%;
        font-size:18px;
        margin:0;
        text-shadow:-1px -1px 1px rgba(0, 0, 0, .5);
    }

    .card article {
        padding:10px;
    }

    .card article img {
        border:2px solid #fff;
        box-shadow:0 0 1px rgba(0, 0, 0, .25);
        float:left;
        margin-right:10px;
        width:63px;
        height:83px;
        transition:all .3s ease-in-out;
        object-fit: cover;
    }

    .card article h2 {
        color:#515355;
        float:left;
        margin:0 2px 0px 0;
        padding:0 0 2px 0;
        width:150px;
        font-size: 12px;
    }

</style>