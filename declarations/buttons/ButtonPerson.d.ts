/// <reference types="react" />
import { Omit } from '../types';
import { ButtonProps } from './Button';
declare type PersonButtonProps = Omit<ButtonProps, 'children'> & {
    photo?: string;
    children?: string;
};
export declare function ButtonPerson({ photo, children, ...props }: PersonButtonProps): JSX.Element;
export {};
//# sourceMappingURL=ButtonPerson.d.ts.map