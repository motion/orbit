```jsx
KeyboardStore
single handler for shortcuts on window

Shortcuts
register={[
{ shortcut: 'cmd+k', action: () => {} }
]}

<KeyboardStore>
  <FocusStore>
    <Focusable name="orbit" condition={() => !!App.peekState}>
      <Shortcuts priority={0} active={isFocused} register={[]}>
        <Orbit />
      </Shortcuts>
    </Focusable>
    <Focusable name="peek" condition={() => !App.peekState}>
      <Shortcuts priority={1} active={isFocused}>
        <Peek />
      </Shortcuts>
    </Focusable>
  </FocusStore>
</KeyboardStore>
```
