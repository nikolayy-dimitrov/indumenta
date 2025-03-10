declare module "react-color" {
    import * as React from "react";

    export interface ColorResult {
        hex: string;
        rgb: {
            r: number;
            g: number;
            b: number;
            a?: number;
        };
        hsl: {
            h: number;
            s: number;
            l: number;
            a?: number;
        };
        hsv: {
            h: number;
            s: number;
            v: number;
            a?: number;
        };
    }

    export interface ChromePickerProps {
        color?: string | { hex: string };
        onChange?: (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => void;
        onChangeComplete?: (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => void;
        disableAlpha?: boolean;
        [key: string]: any;
    }

    export class ChromePicker extends React.Component<ChromePickerProps> {}
}
