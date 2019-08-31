function EmptyThingFn() {}

const EmptyThing = new Proxy(EmptyThingFn, {
  get() {
    return EmptyThing
  },
})

export default EmptyThing
