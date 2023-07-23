type ScrollEffect = (
  event: Event,
  options: {
    disable: () => void;
  }
) => void;

type BetweenScrollEffect = (
  event: Event,
  options: {
    disable: () => void;
    getPercent: () => number;
  }
) => void;

type ScrollHandlerOptions = {
  target?: HTMLElement;
  enable?: boolean;
};

type ConditionalEffect = {
  condition: () => boolean;
  effect: ScrollEffect;
};

export class ScrollHandler {
  #effects: Set<ScrollEffect>;
  #conditionalEffects: Set<ConditionalEffect>;
  #listener: (event: Event) => void;
  target: HTMLElement | Document;
  #prevScrollTop: number;
  get scrollTop() {
    const el =
      this.target instanceof Document
        ? document.body
        : this.target;
    return el.scrollTop;
  }

  constructor(opts?: ScrollHandlerOptions) {
    this.target = opts?.target ?? document;
    this.#effects = new Set();
    this.#conditionalEffects = new Set();
    this.#prevScrollTop = 0;
    this.#listener = (event: Event) => {
      this.#triggerEffects(event);
      this.#prevScrollTop = this.scrollTop;
    };
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

  enable() {
    this.target.addEventListener("scroll", this.#listener);
    return this;
  }

  disable() {
    this.target.removeEventListener("scroll", this.#listener);
    return this;
  }

  onScroll(effect: ScrollEffect) {
    this.#effects.add(effect);
    return this;
  }

  goTo(opts: ScrollToOptions) {
    const el =
      this.target instanceof Document
        ? document.body
        : this.target;
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
    after: number,
    before: number,
    effect: BetweenScrollEffect
  ) {
    this.when(
      () => {
        const scrollTop = this.scrollTop;
        return scrollTop > after && scrollTop < before;
      },
      (event, { disable }) =>
        effect(event, {
          getPercent: () => {
            const totalDistance = before - after;
            const scrolledDistance = this.scrollTop - after;
            return (scrolledDistance / totalDistance) * 100;
          },
          disable,
        })
    );
    return this;
  }

  onceOver(px: number, effect: ScrollEffect) {
    let wasOver = false;
    this.when(() => {
      const isOver =
        this.#prevScrollTop <= px && this.scrollTop > px;
      const scrolledFromUnderToOver = isOver && !wasOver;
      wasOver = isOver;
      return scrolledFromUnderToOver;
    }, effect);

    return this;
  }

  onceUnder(px: number, effect: ScrollEffect) {
    let wasUnder = false;
    this.when(() => {
      const isUnder =
        this.#prevScrollTop >= px && this.scrollTop < px;
      const scrolledFromOverToUnder = isUnder && !wasUnder;
      wasUnder = isUnder;
      return scrolledFromOverToUnder;
    }, effect);

    return this;
  }
}
