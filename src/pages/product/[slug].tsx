import { Layout } from "@components/ui";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  Text,
  Title,
} from "@mantine/core";
import type { NextPageContext } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { RiExternalLinkLine, RiPencilLine } from "react-icons/ri";
import type { NextPageWithLayout } from "../_app";
import prisma from "@utils/prisma";
import type { Prisma } from "@prisma/client";

const useStyles = createStyles((theme) => ({
  logoContainer: {
    position: "relative",
    width: 128,
    height: 128,
    backgroundColor: theme.colors.gray[2],
    borderRadius: "100%",
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

type ProductProps = {
  product?: Prisma.ProductGetPayload<{
    include: { user: { select: { name: true; image: true } } };
  }>;
};

const ProductInfo: NextPageWithLayout = ({ product }: ProductProps) => {
  const { data: sessionData } = useSession();
  const { classes, theme } = useStyles();
  const router = useRouter();

  return (
    <Container size="xl">
      {product && (
        <>
          <NextSeo title={`${product.name} on Adopt Indie`} />
          <Flex align="center" mt="xl" gap={theme.spacing.xl}>
            <Box className={classes.logoContainer}>
              {product.logo && (
                <Image
                  alt={product.name}
                  src={product.logo}
                  className={classes.logo}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </Box>
            <Box>
              <Flex align="center">
                <Title className={classes.title} order={1} mt="xs">
                  {product.name}
                </Title>
                {sessionData?.user?.id === product.userId && (
                  <ActionIcon
                    size="xl"
                    color="blue"
                    variant="transparent"
                    onClick={() => router.push(`${router.asPath}/edit`)}
                  >
                    <RiPencilLine />
                  </ActionIcon>
                )}
              </Flex>
              <Text className={classes.user}>By {product.user.name}</Text>
              {product.website && (
                <Button
                  mt="sm"
                  component="a"
                  href={product.website}
                  target="_blank"
                  radius="xl"
                  rightIcon={<RiExternalLinkLine size={theme.fontSizes.lg} />}
                >
                  Visit Website
                </Button>
              )}
            </Box>
          </Flex>
          <Text mt="xl">{product.description}</Text>
        </>
      )}
    </Container>
  );
};

ProductInfo.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps(ctx: NextPageContext) {
  const product = await prisma.product.findUnique({
    where: { slug: ctx.query.slug as string },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  if (!product) {
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  }

  return { props: { product } };
}

export default ProductInfo;
