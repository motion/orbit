## @o/css

Turns objects into nice CSS styles. Has a few helpers:

* Arrays to strings:

```js
{
  border: [1, 'solid', '#eee'], // 1px solid #eee
  border: [1, '#eee'], // defaults (solid)
  color: [0, 0, 0, 0.5], // rgba(0,0,0,0.5)
}
```

* Transform objects:

```js
{
  transform: { x: 0, y: 10, z: 0, rotate: '100deg' }
}
```

* Color objects:

```js
{
  background: [0, 255, 0, 0.5] // rgba(0, 255, 0, 0.5)
}
```

* Converts css-able functions/objects:

```js
{
  background: chroma('#fff') // will call .css() automatically
}
```

* Recurses into media queries + & selectors

```js
{
  '@media screen': { ... }
}
```

```js
{
  '& child': { ... }
}
```

* Extra border shorthands

```js
{
  borderLeftRadius: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
  borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  borderTopRadius: ['borderTopRightRadius', 'borderTopLeftRadius'],
}
```

* Position shorthand

```js
{
  position: [0, 'auto', 20, '50%'],
  /*
    position: absolute;
    top: 0px;
    right: auto;
    bottom: 20px;
    left: 50%;
  */
  position: ['fixed', 0, 'auto'],
  /*
    position: fixed;
    top: 0px;
    right: auto;
  */
}
```

* Comma separations for multiple boxShadows and transitions:

```js
{
  boxShadow: [
    { x: 5, y: 5, blur: 2, spread: 5, color: [0, 0, 0, 0.1] },
    [0, 0, 10, [0, 0, 0, 0.2]],
  ]
}
```

* Object to value:

```js
{
  background: {
    color: 'green',
    image: 'url(image.jpg)',
    position: [0, 0],
    repeat: 'no-repeat'
  }
}
```
