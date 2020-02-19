import WordCount from "@/model/WordCount";

export default interface TagStatistics{
    wordCounts:WordCount[],
    top5members:{ [tag: string] : string[]; }
}