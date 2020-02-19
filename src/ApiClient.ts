import {default as request, Response} from "request";
import {VUE_APP_PROX} from "@/main";

export default class ApiClient{
    public static loadPeopleFromCommunity(tag:string, callback: (error: any, response: Response, body: any) => any){

        const url = VUE_APP_PROX + "/api/core/v3/search/people?sort=updatedDesc&fields=id,type,thumbnailUrl,displayName,photos,tags&filter=tag(" + tag + ")&filter=search%28%2A%29&origin=spotlight&startIndex=0&count=100";
        let headers: request.Headers = {
            //"Content-Type": "text/plain",
            // "Content-Type": "application/json",
            //"Access-Control-Allow-Origin": '*'

        };
        request.get(url, {headers: headers}, callback);
    }
}