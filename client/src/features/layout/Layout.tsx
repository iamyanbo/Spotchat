import { FunctionComponent } from "react";
import Head from "next/head";
import Header from "../header/Header";

const Layout: FunctionComponent = ({ children }) => {
  return (
    <div className="h-screen">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Spotify Community</title>
      </Head>
      <Header />
      <main className="p-4 w-screen bg-slate-900 h-full">{children}</main>
    </div>
  );
};

export default Layout;
