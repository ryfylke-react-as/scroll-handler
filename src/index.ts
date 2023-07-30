export type ScrollEffect = (
  event: Event,
  options: {
    disable: () => void;
  }
) => void;

export type BetweenScrollEffect = (
  event: Event,
  options: {
    disable: () => void;
    getPercent: () => number;
  }
) => void;

export type ScrollHandlerOptions = {
  target?: HTMLElement;
  getScrollTop?: () => number;
  enable?: boolean;
};

export type ScrollEventTarget = HTMLElement | number;

type ConditionalEffect = {
  condition: () => boolean;
  effect: ScrollEffect;
};

function relativeOffset(elem: HTMLElement, parent: HTMLElement) {
  if (!elem) return { left: 0, top: 0 };
  var x = elem.offsetLeft;
  var y = elem.offsetTop; // for testing

  while (((elem as Element | null) = elem.offsetParent)) {
    x += elem.offsetLeft;
    y += elem.offsetTop; // for testing
    if (elem === parent) break;
  }

  return { left: x, top: y };
}

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export class ScrollHandler {
  #effects: Set<ScrollEffect>;
  #conditionalEffects: Set<ConditionalEffect>;
  #listener: (event: Event) => void;
  #prevScrollTop: number;
  #positionCache: Map<HTMLElement, number>;
  #resizeObserver: ResizeObserver;
  #mutationObserver: MutationObserver;
  target: HTMLElement | Document;
  opts: ScrollHandlerOptions;

  get scrollTop() {
    if (this.opts.getScrollTop) {
      return this.opts.getScrollTop();
    }
    const el =
      this.target instanceof Document
        ? document.documentElement || document.body
        : this.target;
    return el.scrollTop;
  }

  constructor(opts?: ScrollHandlerOptions) {
    this.target = opts?.target ?? document;
    this.#effects = new Set();
    this.#conditionalEffects = new Set();
    this.#positionCache = new Map();
    this.#prevScrollTop = 0;
    this.#listener = (event: Event) => {
      this.#triggerEffects(event);
      this.#prevScrollTop = this.scrollTop;
    };
    this.opts = opts ?? {};

    const observerCallback = debounce(() => {
      this.#positionCache.clear();
    }, 200);
    this.#resizeObserver = new ResizeObserver(observerCallback);
    this.#mutationObserver = new MutationObserver(
      observerCallback
    );
  }

  #getHTMLTarget() {
    return this.target instanceof Document
      ? document.body
      : this.target;
  }

  #triggerEffects(event: Event) {
    this.#effects.forEach((effect) => {
      effect(event, {
        disable: () => {
          this.#effects.delete(effect);
        },
      });
    });
    this.#conditionalEffects.forEach(({ condition, effect }) => {
      if (condition()) {
        effect(event, {
          disable: () => {
            this.#effects.delete(effect);
          },
        });
      }
    });
  }

  #resolveScrollTarget(target: ScrollEventTarget) {
    if (typeof target === "number") {
      return target;
    }
    try {
      if (this.#positionCache.has(target)) {
        return this.#positionCache.get(target)!;
      }
      const position = relativeOffset(
        target,
        this.#getHTMLTarget()
      );
      this.#positionCache.set(target, position.top);
      return position.top;
    } catch (error) {
      console.error(
        `ScrollHandler: Could not resolve target ${target}`,
        {
          error,
        }
      );
      return 0;
    }
  }

  enable() {
    this.target.addEventListener("scroll", this.#listener);
    this.#resizeObserver.observe(this.#getHTMLTarget());
    this.#mutationObserver.observe(this.#getHTMLTarget(), {
      childList: true,
      subtree: true,
    });
    return this;
  }

  disable() {
    this.target.removeEventListener("scroll", this.#listener);
    this.#mutationObserver.disconnect();
    this.#resizeObserver.disconnect();
    return this;
  }

  onScroll(effect: ScrollEffect) {
    this.#effects.add(effect);
    return this;
  }

  goTo(opts: ScrollToOptions) {
    const el = this.#getHTMLTarget();
    el.scrollTo(opts);
    return this;
  }

  when(condition: () => boolean, effect: ScrollEffect) {
    this.#conditionalEffects.add({
      condition,
      effect,
    });
    return this;
  }

  between(
    after: ScrollEventTarget,
    before: ScrollEventTarget,
    effect: BetweenScrollEffect
  ) {
    this.when(
      () => {
        const afterPx = this.#resolveScrollTarget(after);
        const beforePx = this.#resolveScrollTarget(before);
        const scrollTop = this.scrollTop;
        return scrollTop > afterPx && scrollTop < beforePx;
      },
      (event, { disable }) =>
        effect(event, {
          getPercent: () => {
            const afterPx = this.#resolveScrollTarget(after);
            const beforePx = this.#resolveScrollTarget(before);
            const totalDistance = beforePx - afterPx;
            const scrolledDistance = this.scrollTop - afterPx;
            return (scrolledDistance / totalDistance) * 100;
          },
          disable,
        })
    );
    return this;
  }

  onceOver(target: ScrollEventTarget, effect: ScrollEffect) {
    let wasOver = false;
    this.when(() => {
      const px = this.#resolveScrollTarget(target);
      const isOver =
        this.#prevScrollTop <= px && this.scrollTop > px;
      const scrolledFromUnderToOver = isOver && !wasOver;
      wasOver = isOver;
      return scrolledFromUnderToOver;
    }, effect);

    return this;
  }

  onceUnder(target: ScrollEventTarget, effect: ScrollEffect) {
    let wasUnder = false;
    this.when(() => {
      const px = this.#resolveScrollTarget(target);
      const isUnder =
        this.#prevScrollTop >= px && this.scrollTop < px;
      const scrolledFromOverToUnder = isUnder && !wasUnder;
      wasUnder = isUnder;
      return scrolledFromOverToUnder;
    }, effect);

    return this;
  }
}
