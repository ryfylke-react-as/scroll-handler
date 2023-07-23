var _ScrollHandler_instances, _ScrollHandler_effects, _ScrollHandler_conditionalEffects, _ScrollHandler_listener, _ScrollHandler_prevScrollTop, _ScrollHandler_triggerEffects;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
export class ScrollHandler {
    get scrollTop() {
        const el = this.target instanceof Document
            ? document.body
            : this.target;
        return el.scrollTop;
    }
    constructor(opts) {
        var _a;
        _ScrollHandler_instances.add(this);
        _ScrollHandler_effects.set(this, void 0);
        _ScrollHandler_conditionalEffects.set(this, void 0);
        _ScrollHandler_listener.set(this, void 0);
        _ScrollHandler_prevScrollTop.set(this, void 0);
        this.target = (_a = opts === null || opts === void 0 ? void 0 : opts.target) !== null && _a !== void 0 ? _a : document;
        __classPrivateFieldSet(this, _ScrollHandler_effects, new Set(), "f");
        __classPrivateFieldSet(this, _ScrollHandler_conditionalEffects, new Set(), "f");
        __classPrivateFieldSet(this, _ScrollHandler_prevScrollTop, 0, "f");
        __classPrivateFieldSet(this, _ScrollHandler_listener, (event) => {
            __classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_triggerEffects).call(this, event);
            __classPrivateFieldSet(this, _ScrollHandler_prevScrollTop, this.scrollTop, "f");
        }, "f");
    }
    enable() {
        this.target.addEventListener("scroll", __classPrivateFieldGet(this, _ScrollHandler_listener, "f"));
        return this;
    }
    disable() {
        this.target.removeEventListener("scroll", __classPrivateFieldGet(this, _ScrollHandler_listener, "f"));
        return this;
    }
    onScroll(effect) {
        __classPrivateFieldGet(this, _ScrollHandler_effects, "f").add(effect);
        return this;
    }
    goTo(opts) {
        const el = this.target instanceof Document
            ? document.body
            : this.target;
        el.scrollTo(opts);
        return this;
    }
    when(condition, effect) {
        __classPrivateFieldGet(this, _ScrollHandler_conditionalEffects, "f").add({
            condition,
            effect,
        });
        return this;
    }
    between(after, before, effect) {
        this.when(() => {
            const scrollTop = this.scrollTop;
            return scrollTop > after && scrollTop < before;
        }, (event, { disable }) => effect(event, {
            getPercent: () => {
                const totalDistance = before - after;
                const scrolledDistance = this.scrollTop - after;
                return (scrolledDistance / totalDistance) * 100;
            },
            disable,
        }));
        return this;
    }
    onceOver(px, effect) {
        let wasOver = false;
        this.when(() => {
            const isOver = __classPrivateFieldGet(this, _ScrollHandler_prevScrollTop, "f") <= px && this.scrollTop > px;
            const scrolledFromUnderToOver = isOver && !wasOver;
            wasOver = isOver;
            return scrolledFromUnderToOver;
        }, effect);
        return this;
    }
    onceUnder(px, effect) {
        let wasUnder = false;
        this.when(() => {
            const isUnder = __classPrivateFieldGet(this, _ScrollHandler_prevScrollTop, "f") >= px && this.scrollTop < px;
            const scrolledFromOverToUnder = isUnder && !wasUnder;
            wasUnder = isUnder;
            return scrolledFromOverToUnder;
        }, effect);
        return this;
    }
}
_ScrollHandler_effects = new WeakMap(), _ScrollHandler_conditionalEffects = new WeakMap(), _ScrollHandler_listener = new WeakMap(), _ScrollHandler_prevScrollTop = new WeakMap(), _ScrollHandler_instances = new WeakSet(), _ScrollHandler_triggerEffects = function _ScrollHandler_triggerEffects(event) {
    __classPrivateFieldGet(this, _ScrollHandler_effects, "f").forEach((effect) => {
        effect(event, {
            disable: () => {
                __classPrivateFieldGet(this, _ScrollHandler_effects, "f").delete(effect);
            },
        });
    });
    __classPrivateFieldGet(this, _ScrollHandler_conditionalEffects, "f").forEach(({ condition, effect }) => {
        if (condition()) {
            effect(event, {
                disable: () => {
                    __classPrivateFieldGet(this, _ScrollHandler_effects, "f").delete(effect);
                },
            });
        }
    });
};
//# sourceMappingURL=index.js.map