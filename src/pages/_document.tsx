import type { DocumentContext, DocumentInitialProps } from "next/document";
import { Main, NextScript } from "next/document";
import { Head, Html } from "next/document";
import Document from "next/document";
import { ServerStyles, createStylesServer } from "@mantine/next";

const stylesServer = createStylesServer();

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          server={stylesServer}
          key="styles"
        />,
      ],
    };
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
