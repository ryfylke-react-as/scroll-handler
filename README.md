# Scroll Handler

> Create scroll effects with ease and performance in mind

## Install

```bash
npm i @ryfylke-react/scroll-handler
```

You can also alternatively copy/paste the source directly from [here](#source).

## Use

### Creating a new scroll handler

```typescript
import { ScrollHandler } from "@ryfylke-react/scroll-handler";

const scrollHandler = new ScrollHandler({
  target: document.querySelector("#app")!, // default: `document.body`
})
  .onScroll((event, { disable }) => {
    // Do something when scroll event is triggered
  })
  .enable();
```

You can call the `disable` util to disable the scroll handler.

### Adding conditional effects and breakpoints

```typescript
scrollHandler
  .between(0, 500, (event, { getPercent }) => {
    // Do something when scroll position is between 0 and 500
    const percent = getPercent();
  })
  .onceOver(500, () => {
    // Called once whenever scroll position goes from less than 500 to more than 500
  });
```

You can also pass elements as arguments to `between`, `onceOver` and `onceUnder`:

```typescript
const element = document.querySelector("#element")!;
scrollHandler
  .between(0, element, () => {
    // ...
  })
  .onceOver(element, () => {
    // ...
  });
```

This essentially uses the elements `getBoundingClientRect().top` to determine the value. This value
is cached, and uses a `MutationObserver` and debounced resize-listener to do it's best to update the
value whenever the element could have changed position.

If you know that the element will not change position, you could just pass the value.

```typescript
const elTop = document
  .querySelector("#element")!
  .getBoundingClientRect().top;
scrollHandler
  .between(0, elTop, () => {
    // ...
  })
  .onceOver(elTop, () => {
    // ...
  });
```

### Reference

### ScrollHandler arguments

```typescript
const options: {
  target?: HTMLElement; // default: document.body
} = {}; // optional

const handler = new ScrollHandler(options);
```

### ScrollHandler instance methods

- **onScroll**  
  `(effect: ScrollEffect) => this`  
  Send event to channel
- **between**  
  `(after: ScrollEventTarget, before: ScrollEventTarget, effect: ScrollEffect) => this`  
  Sets up conditional effect that runs between two scroll positions
- **onceOver**  
  `(after: ScrollEventTarget, effect: ScrollEffect) => this`  
  Sets up conditional effect that runs once when scroll position goes from less than to more than a given position
- **onceUnder**  
  `(before: ScrollEventTarget, effect: ScrollEffect) => this`  
  Sets up conditional effect that runs once when scroll position goes from more than to less than a given position
- **when**  
  `(condition: () => boolean, effect: ScrollEffect) => this`  
  Sets up conditional effect that runs when a given condition is met. Condition is checked on every scroll event.
- **enable**  
  `() => void`  
  Enables the scroll handler
- **disable**  
  `() => void`  
  Disables the scroll handler
- **goTo**  
  `(opts: GoToOptions) => this`  
  Scrolls to a given position

### ScrollHandler instance properties

- **scrollTop** `number`  
  The current scroll position
- **target** `HTMLElement`  
  The target element

### ScrollEffect

```typescript
type ScrollEffect = (
  event: Event,
  utils: {
    getPercent: () => number; // <- Only available when using `between`
    disable: () => void;
  }
) => void;
```

### ScrollEventTarget

```typescript
type ScrollEventTarget = HTMLElement | number;
```

## Source

The following is the entire library source, if you prefer - you can copy/paste this into a file in your project.

[↗ Open in GitHub](https://github.com/ryfylke-react-as/scroll-handler/blob/master/src/index.ts)
