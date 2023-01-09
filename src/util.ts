export type Index = string | symbol | number;
export type Indexable<T> = { [index: Index]: T };
