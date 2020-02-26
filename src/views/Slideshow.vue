<template>
    <div id="dynamic-component-demo">

        <fab :actions="fabActions"
             :bg-color="fabBgColor"
             position="bottom-right"
             icon-size="small"
             main-icon="expand_more"
             @play="onPlay"
             @pause="onPause"
             @stats="onStats"
             @trombi="onTrombi"

        ></fab>


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



     interface Act{
        name:string,
        icon:string,
        color:string|undefined|null
    }

    import {Component, Vue} from "vue-property-decorator";
    import HelloWorld from "@/components/HelloWorld.vue";
    import IdCardCollection from "@/components/IdCardCollection.vue";
    import Stats from "@/components/Stats.vue";
    import RandomTop5TagMembers from "@/components/RandomTop5TagMembers.vue";
    import RandomMember from "@/components/RandomMember.vue";
    //@ts-ignore
import fab from 'vue-fab'

    @Component({
        components: {HelloWorld, IdCardCollection, Stats, RandomTop5TagMembers, RandomMember,fab}
    })
    export default class Slideshow extends Vue {


        get fabBgColor() {
            return this.animationHandle != null?"#EEEEEE":'#778899';
        }

        private  constantAction = [ {
            name: 'stats',
            icon: 'bar_chart',
            color: this.fabBgColor
        }, {
            name: 'trombi',
            icon: 'people',
            color: this.fabBgColor
        }];

        get fabActions(){
            if (this.animationHandle != null){
                //@ts-ignore
                return  [
                    {
                        name: 'pause',
                        icon: 'pause',
                        color: 'orange'
                    }
                ].concat(this.constantAction)
            }else{
                //@ts-ignore
                return [
                    {
                        name: 'play',
                        icon: 'play_arrow',
                        color: 'green'
                    }
                ].concat(this.constantAction)
            }
        }

        currentTab = "stats";
        //tabs = ["stats", "random member"];
        tabs = ["stats", "trombi","random top tag", "random member"];

        animationHandle: any | null = null;
        hideTabs = true;

        TIMER_PERIOD_DEFAULT = process.env.NODE_ENV === 'production' ? 20000 : 6000;

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
                ? Number(this.$route.query.tempo) * 1000 :
                this.TIMER_PERIOD_DEFAULT;
        }


        nextTab() {
            let increment = this.tabs.indexOf(this.currentTab) + 1 ;
            if(increment >= this.tabs.length){
                increment = 0;
            }
            this.currentTab = this.tabs[increment];
            this.$log.debug("next  tab: ", this.currentTab);
        }

        onPlay(){
            this.$log.debug("play!");
            if(this.animationHandle != null) {
               this.stopAnimation()
            }
            this.startAnimation();
        }

        onPause(){
            this.stopAnimation();
        }

        onStats(){
            this.stopAnimation();
            this.currentTab = "stats"
        }

        onTrombi(){
            this.stopAnimation();
            this.currentTab = "trombi"
        }

        get isAnimationPlaying() : boolean {
            return this.animationHandle != null
        }

        private startAnimation(){
            this.$log.debug("starting animation");
            this.animationHandle = setInterval(this.nextTab, this.timer);
        }

        private stopAnimation(){
            this.$log.debug("canceling animation");
            clearInterval(this.animationHandle);
            this.animationHandle = null;
        }

        animate() {
            this.$log.debug("animate!");
            if (this.animationHandle != null) {
                this.$log.debug("canceling animation");
                this.hideTabs = false;
                clearInterval(this.animationHandle);
                this.animationHandle = null;
            } else {
                this.$log.debug("starting animation");
                this.hideTabs = true;
                this.animationHandle = setInterval(this.nextTab, this.timer);
            }
        }

        private static isPathParamANumber(pathParam: string | (string | null)[]): boolean {
            const value = pathParam as string;
            return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
        }

        cache(){
            console.log('Cache Cleared');
        }
        alert(){
            alert('Clicked on alert icon');
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
        border: 0px solid #ccc;
        padding: 10px;
    }
</style>