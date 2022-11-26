declare module '*.scss' {
  type CssModule = Record<string, string>;

  const cssModule: CssModule;
  export default cssModule;
}
