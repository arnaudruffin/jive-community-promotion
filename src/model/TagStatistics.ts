import WordCount from "@/model/WordCount";
import EnhancedPersonResponse from "@/model/EnhancedPersonResponse";

export default interface TagStatistics{
    wordCounts:WordCount[],
    top5members:{ [tag: string] : EnhancedPersonResponse[]; }
}