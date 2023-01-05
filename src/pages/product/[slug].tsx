import { Layout } from "@components/ui";
import {
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { api } from "@utils/api";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { RiExternalLinkLine } from "react-icons/ri";
import type { NextPageWithLayout } from "../_app";

const useStyles = createStyles((theme) => ({
  logoContainer: {
    position: "relative",
    width: 128,
    height: 128,
  },
  logo: {
    borderRadius: "100%",
  },
  title: {
    fontSize: theme.fontSizes.xl * 2,
    fontWeight: 700,
    color: theme.colors.gray[9],
  },
  user: {
    fontWeight: 400,
    color: theme.colors.gray[7],
  },
}));

const ProductInfo: NextPageWithLayout = () => {
  const { classes, theme } = useStyles();
  const router = useRouter();
  const product = api.product.getBySlug.useQuery({
    slug: router.query.slug as string,
  });

  if (product.isLoading) {
    return <Loader />;
  }

  return (
    <Container size="xl">
      {product.data && (
        <>
          <NextSeo title={`${product.data.name} on Adopt Indie`} />
          <Flex align="center" mt="xl" gap={theme.spacing.xl}>
            <Box className={classes.logoContainer}>
              {product.data.logo && (
                <Image
                  alt={product.data.name}
                  src={product.data.logo}
                  className={classes.logo}
                  fill
                />
              )}
            </Box>
            <Box>
              <Title className={classes.title} order={1} mt="xs">
                {product.data.name}
              </Title>
              <Text className={classes.user}>By {product.data.user.name}</Text>
              {product.data.website && (
                <Button
                  mt="sm"
                  component="a"
                  href={product.data.website}
                  target="_blank"
                  radius="xl"
                  rightIcon={<RiExternalLinkLine size={theme.fontSizes.lg} />}
                >
                  Visit Website
                </Button>
              )}
            </Box>
          </Flex>
          <Text mt="xl">{product.data.description}</Text>
        </>
      )}
    </Container>
  );
};

ProductInfo.getLayout = (page) => <Layout>{page}</Layout>;

export default ProductInfo;