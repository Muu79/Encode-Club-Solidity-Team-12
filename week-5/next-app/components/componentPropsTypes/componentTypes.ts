import { LegacyRef, MutableRefObject, ReactNode } from "react"

export type CardProps = {
    children: ReactNode
}

export type PrimaryBtnProps = {
    name: string,
    onClick?: () => void;
}

export type InputFieldProps = {
    inputType: string,
    placeholder: string,
    forwardedRef?: any,
    onChange?: (event: any) => void;
}