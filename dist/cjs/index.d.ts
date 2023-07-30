type ScrollEffect = (event: Event, options: {
    disable: () => void;
}) => void;
type BetweenScrollEffect = (event: Event, options: {
    disable: () => void;
    getPercent: () => number;
}) => void;
type ScrollHandlerOptions = {
    target?: HTMLElement;
    getScrollTop?: () => number;
    enable?: boolean;
};
type ScrollEventTarget = HTMLElement | number;
export declare class ScrollHandler {
    #private;
    target: HTMLElement | Document;
    opts: ScrollHandlerOptions;
    get scrollTop(): number;
    constructor(opts?: ScrollHandlerOptions);
    enable(): this;
    disable(): this;
    onScroll(effect: ScrollEffect): this;
    goTo(opts: ScrollToOptions): this;
    when(condition: () => boolean, effect: ScrollEffect): this;
    between(after: ScrollEventTarget, before: ScrollEventTarget, effect: BetweenScrollEffect): this;
    onceOver(target: ScrollEventTarget, effect: ScrollEffect): this;
    onceUnder(target: ScrollEventTarget, effect: ScrollEffect): this;
}
export {};
