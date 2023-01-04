import { Layout } from "@components/ui";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return <div>Home</div>;
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
