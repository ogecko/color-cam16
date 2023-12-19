import { JuMuHu, CAM16u } from "./types";
export declare function find_strongest_Mu(ucs: JuMuHu, min?: number, max?: number, n?: number): number;
export declare function find_strongest_Ju(Hu: number, min?: number, max?: number, n?: number, useLookup?: boolean): number;
export declare function find_strongest_color(Hu: number): CAM16u;
export declare function rainbow_colors({ Hu1, Hu2, steps }: {
    Hu1?: number;
    Hu2?: number;
    steps?: number;
}): CAM16u[];
export declare function delta_e(x: JuMuHu, y: JuMuHu): number;
export declare function shortest_signed_distance(a: number, b: number): number;
export declare function adjust_colors({ Jua, Jub, Mua, Mub, Hua, Hub, steps, contrast }: {
    Jua?: number;
    Jub?: number;
    Mua?: number;
    Mub?: number;
    Hua?: number;
    Hub?: number;
    steps?: number;
    contrast?: boolean;
}, ...colors: CAM16u[]): CAM16u[];
