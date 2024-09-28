import { person } from "./person.model";

export enum State{
  COMPLETED= 1,
  PROGRESS = 2,
  ASSIGNED = 3
}

export interface Task{
  id: string;
  tittle: string;
  description: string;
  persons: string[];
  expired: Date;
  state: State
}
