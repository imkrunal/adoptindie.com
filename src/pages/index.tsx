import { ProductCard } from "@components/products";
import { Layout } from "@components/ui";
import { Box, Button, Center, Container, Grid } from "@mantine/core";
import { api } from "@utils/api";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const products = api.product.getAll.useInfiniteQuery(
    { limit: 12 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <Container size="xl">
      <Box mt="md">
        {!products.isLoading &&
          products.data &&
          products.data.pages &&
          products.data.pages.map((page, pageIndex) => (
            <Grid gutter={16} mb={8} key={pageIndex}>
              {page.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          ))}
      </Box>
      {products.hasNextPage && (
        <Center>
          <Button
            variant="outline"
            radius="xl"
            onClick={() => products.fetchNextPage()}
          >
            Show More
          </Button>
        </Center>
      )}
    </Container>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
