import CountStatistics from "@/model/CountStatistics";
import TagStatistics from "@/model/TagStatistics";

export default interface PersonResponseStatistics{
    counts: CountStatistics,
    tags: TagStatistics
}

