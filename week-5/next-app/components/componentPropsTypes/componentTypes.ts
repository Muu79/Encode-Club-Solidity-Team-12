import { LegacyRef, MutableRefObject, ReactNode } from "react"

export type CardProps = {
    children: ReactNode,
    className?: string;
}

export type PrimaryBtnProps = {
    name: string,
    className?: string
    onClick?: () => void;
}

export type InputFieldProps = {
    inputType: string,
    placeholder: string,
    forwardedRef?: any,
    className?: string;
    onChange?: (event: any) => void;
}