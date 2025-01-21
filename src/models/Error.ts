import { ErrorType } from "./ErrorType";


export type Error = {
    code: string;
    message: string;
    type: ErrorType;
    invalidField: string;
};
