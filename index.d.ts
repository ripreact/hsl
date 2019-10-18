declare module '@ripreact/hsl' {
    /**
     * Minimal HSLᵤᵥ implementation. Returns `rgba(r, g, b, a)` string.
     *
     * @param h HSLᵤᵥ hue.
     * @param s HSLᵤᵥ saturation.
     * @param l HSLᵤᵥ lightness.
     * @param a Alpha.
     */
    export function hsl(h: number, s: number, l: number, a?: number): string;
}
