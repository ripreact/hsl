declare module '@ripreact/hsl' {
    /**
     * Minimal and fast HSLᵤᵥ implementation. Returns `'#rrggbbaa'` string.
     *
     * @param h HSLᵤᵥ hue (0..360).
     * @param s HSLᵤᵥ saturation (0..100).
     * @param l HSLᵤᵥ lightness (0..100).
     * @param [a] Alpha (0..1).
     */
    export function hsl(h: number, s: number, l: number, a?: number): string;
}
