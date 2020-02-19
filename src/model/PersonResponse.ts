export default interface PersonResponse{
    displayName:string,
    tags:string[],
    photos:ValueObject[],
}

interface ValueObject {
    value: string
}