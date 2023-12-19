import { sRGB, XYZ, JMhQCs, JMh, CAM16u, JuMuHu } from './types';
export declare function hex_to_srgb(hex: string): sRGB;
export declare function srgb_to_xyz([R, G, B]: sRGB): XYZ;
export declare function xyz_to_JMhQCs(XYZ: XYZ): JMhQCs;
export declare function JMH_to_JuMuHu({ J, M, h }: JMh): {
    Ju: number;
    Mu: number;
    Hu: number;
};
export declare function xyz_to_JuMuHu(XYZ: XYZ): JuMuHu;
export declare function hex_to_JMhQCs(hex: string): JMhQCs;
export declare function hex_to_JuMuHu(hex: string): JuMuHu;
export declare function hex_to_color(hex: string): CAM16u;
