type Jot={
    content:string;
    timeStamp:number;
}

type Jots=Record<string,Jot>
export type {Jot,Jots}