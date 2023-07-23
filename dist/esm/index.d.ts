type ScrollEffect = (event: Event, options: {
    disable: () => void;
}) => void;
type BetweenScrollEffect = (event: Event, options: {
    disable: () => void;
    getPercent: () => number;
}) => void;
type ScrollHandlerOptions = {
    target?: HTMLElement;
    enable?: boolean;
};
export declare class ScrollHandler {
    #private;
    target: HTMLElement | Document;
    get scrollTop(): number;
    constructor(opts?: ScrollHandlerOptions);
    enable(): this;
    disable(): this;
    onScroll(effect: ScrollEffect): this;
    goTo(opts: ScrollToOptions): this;
    when(condition: () => boolean, effect: ScrollEffect): this;
    between(after: number, before: number, effect: BetweenScrollEffect): this;
    onceOver(px: number, effect: ScrollEffect): this;
    onceUnder(px: number, effect: ScrollEffect): this;
}
export {};
