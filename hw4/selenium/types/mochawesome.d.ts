declare module 'mochawesome/addContext' {
  interface Context {
    title: string;
    value: unknown;
  }
  /** `this` inside a mocha hook/test — typed loosely; mochawesome only reads .test/.currentTest. */
  function addContext(runnable: any, context: Context | string): void;
  export = addContext;
}
