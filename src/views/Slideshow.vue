<template>
    <div id="dynamic-component-demo" >
        <div class="demo" v-if="!hideTabs">
        <button
                v-for="tab in tabs"
                v-bind:key="tab"
                v-bind:class="['tab-button', { active: currentTab === tab }]"
                v-on:click="currentTab = tab"
        >
            {{ tab }}
        </button>
        </div>
        <component v-bind:is="currentTabComponent" class="tab"></component>

        <button v-on:click="animate()"> animate</button>
    </div>
</template>


<script lang="ts">


    import {Component, Vue, Watch} from "vue-property-decorator";
    import HelloWorld from "@/components/HelloWorld.vue";
    import IdCardCollection from "@/components/IdCardCollection.vue";
    import Stats from "@/components/Stats.vue";
    import RandomTop5TagMembers from "@/components/RandomTop5TagMembers.vue";
    import RandomMember from "@/components/RandomMember.vue";


    @Component({
        components: {HelloWorld, IdCardCollection, Stats, RandomTop5TagMembers, RandomMember}
    })
    export default class Slideshow extends Vue {


        currentTab = "stats";
        tabs = ["stats", "trombi","random top tag", "random member"];

        animationHandle : any | null = null;
        hideTabs = false;

        TIMER_PERIOD_DEFAULT=  process.env.NODE_ENV === 'production' ? 20000 : 6000;

        get currentTabComponent() {
            switch (this.currentTab) {
                case "trombi":
                    return "IdCardCollection";
                case "stats":
                    return "Stats";
                case "random top tag":
                    return "RandomTop5TagMembers";
                case "random member":
                    return "RandomMember";
                default:
                    return "HelloWorld";
            }

        }

        get timer(): number {
            return Slideshow.isPathParamANumber(this.$route.query.tempo)
                ? Number(this.$route.query.tempo)*1000 :
                this.TIMER_PERIOD_DEFAULT;
        }


        nextTab(){
            this.currentTab = this.tabs[this.tabs.indexOf(this.currentTab)+1 << 0]
        }

        animate() {
            this.$log.debug("animate!");
            if (this.animationHandle != null){
                this.$log.debug("canceling animation");
                this.hideTabs = false;
               clearInterval(this.animationHandle);
                this.animationHandle = null;
            }else{
                this.$log.debug("starting animation");
                this.hideTabs = true;
                this.animationHandle = setInterval(this.nextTab, this.timer);
            }
        }

        @Watch('$route.query.tempo')
        onTempoChanged(val: string) {
           // this.animate()
        }


        private static isPathParamANumber(pathParam: string | (string | null)[]): boolean {
            const value = pathParam as string;
            return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
        }

    }


</script>
<style>
    .tab-button {
        padding: 6px 10px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border: 1px solid #ccc;
        cursor: pointer;
        background: #f0f0f0;
        margin-bottom: -1px;
        margin-right: -1px;
    }

    .tab-button:hover {
        background: #e0e0e0;
    }

    .tab-button.active {
        background: #e0e0e0;
    }

    .tab {
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>