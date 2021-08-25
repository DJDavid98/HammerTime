import Document, { Head, Html, Main, NextScript } from 'next/document';
import { getDirAttribute } from 'src/util/common';

class MyDocument extends Document {
  render() {
    // Initial direction set for the first render, runtime changes are handled in _app.tsx
    const direction = getDirAttribute(this.props.locale);
    return (
      <Html dir={direction}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
