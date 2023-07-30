"use strict";
var _ScrollHandler_instances, _ScrollHandler_effects, _ScrollHandler_conditionalEffects, _ScrollHandler_listener, _ScrollHandler_prevScrollTop, _ScrollHandler_positionCache, _ScrollHandler_resizeObserver, _ScrollHandler_mutationObserver, _ScrollHandler_getHTMLTarget, _ScrollHandler_triggerEffects, _ScrollHandler_resolveScrollTarget;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollHandler = void 0;
const tslib_1 = require("tslib");
function relativeOffset(elem, parent) {
    if (!elem)
        return { left: 0, top: 0 };
    var x = elem.offsetLeft;
    var y = elem.offsetTop; // for testing
    while ((elem = elem.offsetParent)) {
        x += elem.offsetLeft;
        y += elem.offsetTop; // for testing
        if (elem === parent)
            break;
    }
    return { left: x, top: y };
}
const debounce = (fn, ms = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};
class ScrollHandler {
    get scrollTop() {
        const el = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_getHTMLTarget).call(this);
        return el.scrollTop;
    }
    constructor(opts) {
        var _a;
        _ScrollHandler_instances.add(this);
        _ScrollHandler_effects.set(this, void 0);
        _ScrollHandler_conditionalEffects.set(this, void 0);
        _ScrollHandler_listener.set(this, void 0);
        _ScrollHandler_prevScrollTop.set(this, void 0);
        _ScrollHandler_positionCache.set(this, void 0);
        _ScrollHandler_resizeObserver.set(this, void 0);
        _ScrollHandler_mutationObserver.set(this, void 0);
        this.target = (_a = opts === null || opts === void 0 ? void 0 : opts.target) !== null && _a !== void 0 ? _a : document;
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_effects, new Set(), "f");
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_conditionalEffects, new Set(), "f");
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_positionCache, new Map(), "f");
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_prevScrollTop, 0, "f");
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_listener, (event) => {
            tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_triggerEffects).call(this, event);
            tslib_1.__classPrivateFieldSet(this, _ScrollHandler_prevScrollTop, this.scrollTop, "f");
        }, "f");
        const observerCallback = debounce(() => {
            tslib_1.__classPrivateFieldGet(this, _ScrollHandler_positionCache, "f").clear();
        }, 200);
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_resizeObserver, new ResizeObserver(observerCallback), "f");
        tslib_1.__classPrivateFieldSet(this, _ScrollHandler_mutationObserver, new MutationObserver(observerCallback), "f");
    }
    enable() {
        this.target.addEventListener("scroll", tslib_1.__classPrivateFieldGet(this, _ScrollHandler_listener, "f"));
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_resizeObserver, "f").observe(tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_getHTMLTarget).call(this));
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_mutationObserver, "f").observe(tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_getHTMLTarget).call(this), {
            childList: true,
            subtree: true,
        });
        return this;
    }
    disable() {
        this.target.removeEventListener("scroll", tslib_1.__classPrivateFieldGet(this, _ScrollHandler_listener, "f"));
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_mutationObserver, "f").disconnect();
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_resizeObserver, "f").disconnect();
        return this;
    }
    onScroll(effect) {
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_effects, "f").add(effect);
        return this;
    }
    goTo(opts) {
        const el = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_getHTMLTarget).call(this);
        el.scrollTo(opts);
        return this;
    }
    when(condition, effect) {
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_conditionalEffects, "f").add({
            condition,
            effect,
        });
        return this;
    }
    between(after, before, effect) {
        this.when(() => {
            const afterPx = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_resolveScrollTarget).call(this, after);
            const beforePx = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_resolveScrollTarget).call(this, before);
            const scrollTop = this.scrollTop;
            return scrollTop > afterPx && scrollTop < beforePx;
        }, (event, { disable }) => effect(event, {
            getPercent: () => {
                const afterPx = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_resolveScrollTarget).call(this, after);
                const beforePx = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_resolveScrollTarget).call(this, before);
                const totalDistance = beforePx - afterPx;
                const scrolledDistance = this.scrollTop - afterPx;
                return (scrolledDistance / totalDistance) * 100;
            },
            disable,
        }));
        return this;
    }
    onceOver(target, effect) {
        let wasOver = false;
        this.when(() => {
            const px = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_resolveScrollTarget).call(this, target);
            const isOver = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_prevScrollTop, "f") <= px && this.scrollTop > px;
            const scrolledFromUnderToOver = isOver && !wasOver;
            wasOver = isOver;
            return scrolledFromUnderToOver;
        }, effect);
        return this;
    }
    onceUnder(target, effect) {
        let wasUnder = false;
        this.when(() => {
            const px = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_resolveScrollTarget).call(this, target);
            const isUnder = tslib_1.__classPrivateFieldGet(this, _ScrollHandler_prevScrollTop, "f") >= px && this.scrollTop < px;
            const scrolledFromOverToUnder = isUnder && !wasUnder;
            wasUnder = isUnder;
            return scrolledFromOverToUnder;
        }, effect);
        return this;
    }
}
exports.ScrollHandler = ScrollHandler;
_ScrollHandler_effects = new WeakMap(), _ScrollHandler_conditionalEffects = new WeakMap(), _ScrollHandler_listener = new WeakMap(), _ScrollHandler_prevScrollTop = new WeakMap(), _ScrollHandler_positionCache = new WeakMap(), _ScrollHandler_resizeObserver = new WeakMap(), _ScrollHandler_mutationObserver = new WeakMap(), _ScrollHandler_instances = new WeakSet(), _ScrollHandler_getHTMLTarget = function _ScrollHandler_getHTMLTarget() {
    return this.target instanceof Document
        ? document.body
        : this.target;
}, _ScrollHandler_triggerEffects = function _ScrollHandler_triggerEffects(event) {
    tslib_1.__classPrivateFieldGet(this, _ScrollHandler_effects, "f").forEach((effect) => {
        effect(event, {
            disable: () => {
                tslib_1.__classPrivateFieldGet(this, _ScrollHandler_effects, "f").delete(effect);
            },
        });
    });
    tslib_1.__classPrivateFieldGet(this, _ScrollHandler_conditionalEffects, "f").forEach(({ condition, effect }) => {
        if (condition()) {
            effect(event, {
                disable: () => {
                    tslib_1.__classPrivateFieldGet(this, _ScrollHandler_effects, "f").delete(effect);
                },
            });
        }
    });
}, _ScrollHandler_resolveScrollTarget = function _ScrollHandler_resolveScrollTarget(target) {
    if (typeof target === "number") {
        return target;
    }
    try {
        if (tslib_1.__classPrivateFieldGet(this, _ScrollHandler_positionCache, "f").has(target)) {
            return tslib_1.__classPrivateFieldGet(this, _ScrollHandler_positionCache, "f").get(target);
        }
        const position = relativeOffset(target, tslib_1.__classPrivateFieldGet(this, _ScrollHandler_instances, "m", _ScrollHandler_getHTMLTarget).call(this));
        tslib_1.__classPrivateFieldGet(this, _ScrollHandler_positionCache, "f").set(target, position.top);
        return position.top;
    }
    catch (error) {
        console.error(`ScrollHandler: Could not resolve target ${target}`, {
            error,
        });
        return 0;
    }
};
//# sourceMappingURL=index.js.map