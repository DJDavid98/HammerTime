import Document, { Head, Html, Main, NextScript } from 'next/document';
import { CSP_HEADER } from '../config';
import { getDirAttribute } from '../util/common';

class MyDocument extends Document {
  render() {
    // Initial direction set for the first render, runtime changes are handled in _app.tsx
    const dir = getDirAttribute(this.props.locale);
    return (
      <Html dir={dir} lang={this.props.locale}>
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="Content-Security-Policy" content={CSP_HEADER} />
          <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="theme-color" content="#5865F2" />
          <meta name="color-scheme" content="dark" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />

          <link rel="icon" href="/logos/logo.png" />
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
