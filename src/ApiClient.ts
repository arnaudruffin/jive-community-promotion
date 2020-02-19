import {default as request, Response} from "request";
import {VUE_APP_PROX} from "@/main";
import PersonResponse from "@/model/PersonResponse";
import WordCount from "@/model/WordCount";
import PersonResponseStatistics from "@/model/PersonResponseStatistics";

export default class ApiClient {
    public static loadPeopleFromCommunity(tag: string, callback: (error: any, response: Response, body: any) => any) {

        const url = VUE_APP_PROX + "/api/core/v3/search/people?sort=updatedDesc&fields=id,type,thumbnailUrl,displayName,photos,tags&filter=tag(" + tag + ")&filter=search%28%2A%29&origin=spotlight&startIndex=0&count=100";
        let headers: request.Headers = {
            //"Content-Type": "text/plain",
            // "Content-Type": "application/json",
            //"Access-Control-Allow-Origin": '*'

        };
        request.get(url, {headers: headers}, callback);
    }


    public static extractStatisticsFromPersonResponse(persons: PersonResponse[],
                                                      tagNumberObjective: number,
                                                      currentTag: string /** to filter it out when counting tags*/): PersonResponseStatistics {

        const result: PersonResponseStatistics = {
            counts: {
                members: 0,
                membersWithASufficientAmountOfTags: 0,
                membersWithPictures: 0
            },
            tags: {
                wordCounts: [],
                top5members: {}
            }
        };

        const skills: any = [];
        persons.forEach(item => {
            result.counts.members++;

            if (item.photos) {
                result.counts.membersWithPictures++;
            }

            let tags = item.tags.filter((el: string) => {
                return el !== currentTag
            });
            if (tags.length >= tagNumberObjective) {
                result.counts.membersWithASufficientAmountOfTags++;
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

        //this.$log.debug('tag stats: ', counts);
        Object.keys(counts).forEach(e => result.tags.wordCounts.push({name: e, value: counts[e]} as WordCount));
        //this.$log.info('formatted tag stats: ', this.tagStatistics.wordCounts);

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
        top5.forEach(top => {
            result.tags.top5members[top[0]] = [];

        });

        persons.forEach(item => {
            top5.forEach(top => {
                if (item.tags.indexOf(top[0]) > -1) {
                    result.tags.top5members[top[0]].push(item.displayName)
                }
            });
        });

        return result;
    }
}