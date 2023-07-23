# Scroll Handler

> Create scroll effects with ease and performance in mind

## Install

💾 ~[**0.67KB**](https://bundlephobia.com/package/typesafe-custom-events) minified, no additional dependencies.

```bash
npm i @ryfylke-react-as/scroll-handler
```

You can also alternatively copy/paste the source directly from [here](#source).

## Use

### Creating a new scroll handler

```typescript
import { ScrollHandler } from "@ryfylke-react-as/scroll-handler";

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

### Reference

You can create a new `ScrollHandler` using the following arguments:

```typescript
const options: {
  target?: HTMLElement; // default: document.body
} = {}; // optional

const handler = new ScrollHandler(options);
```

A `ScrollHandler` instance contains the following properties:

**Methods:**

- **onScroll**  
  `(effect: ScrollEffect) => this`  
  Send event to channel
- **between**  
  `(after: number, before: number, effect: ScrollEffect) => this`  
  Sets up conditional effect that runs between two scroll positions
- **onceOver**  
  `(after: number, effect: ScrollEffect) => this`  
  Sets up conditional effect that runs once when scroll position goes from less than to more than a given position
- **onceUnder**  
  `(before: number, effect: ScrollEffect) => this`  
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

**Properties:**

- **scrollTop** `number`  
  The current scroll position
- **target** `HTMLElement`  
  The target element

**ScrollEffect** type:

```typescript
type ScrollEffect = (
  event: Event,
  utils: {
    getPercent: () => number; // <- Only available when using `between`
    disable: () => void;
  }
) => void;
```

## Source

The following is the entire library source, if you prefer - you can copy/paste this into a file in your project.

[↗ Open in GitHub](https://github.com/ryfylke-react-as/typesafe-custom-events/blob/master/src/index.ts)
