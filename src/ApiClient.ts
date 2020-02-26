import {default as request, Response} from "request";
import {VUE_APP_PROX} from "@/main";
import PersonResponse from "@/model/PersonResponse";
import WordCount from "@/model/WordCount";
import PersonResponseStatistics from "@/model/PersonResponseStatistics";
import EnhancedPersonResponse from "@/model/EnhancedPersonResponse";

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

    public static convertPersonListToEnhancedPersonList(persons: PersonResponse[],
                                                        currentTag: string /** to filter it out when counting tags*/): EnhancedPersonResponse[] {
        const data = persons as EnhancedPersonResponse[];
        data.forEach(item => {
            if (item.photos) {
                item.picture = item.photos[0].value
            } else {
                item.picture = "https://vignette.wikia.nocookie.net/leon-smallwood/images/e/e2/UNKNOWN_PERSON.png/revision/latest?cb=20150903003647"
            }
            item.skills = item.tags.filter((el: string) => {
                return el !== currentTag
            }).slice(0, 4);
            if (item.tags.length > 5) {
                item.skills.push("...")
            } else if (item.skills && item.skills.length === 0) {
                item.skills.push("???")
            }
            item.skills_ellipsis = item.skills.map((input: string) => input.length > 24 ? input = `${input.substring(0, 21)}...` : input);
        });
        return data;
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