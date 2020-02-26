import PersonResponse from "./PersonResponse";

export default interface EnhancedPersonResponse extends PersonResponse{
    skills:string[],
    picture:string,
    skills_ellipsis:string[]
}