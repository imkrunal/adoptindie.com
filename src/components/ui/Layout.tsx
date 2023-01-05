import { NextSeo } from "next-seo";
import type { ReactNode } from "react";
import Navigation from "./Navigation";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <NextSeo
        title="Adopt Indie: Join the Indie Movement!"
        description="Join the Indie Movement!"
      />
      <Navigation />
      {children}
    </div>
  );
};

export default Layout;
