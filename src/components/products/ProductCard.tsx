import { Box, createStyles, Flex, Grid, Text, Title } from "@mantine/core";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Prisma.ProductGetPayload<{
    include: { user: { select: { name: true; image: true } } };
  }>;
};

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[2],
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.colors.gray[9],
  },
  tagline: {
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.gray[7],
  },
  link: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  logoContainer: {
    borderRadius: 100,
    position: "relative",
    width: 64,
    height: 64,
  },
  logo: {
    borderRadius: 100,
  },
}));

const ProductCard = ({ product }: ProductCardProps) => {
  const { classes, theme } = useStyles();

  return (
    <Grid.Col md={4}>
      <Box className={classes.root}>
        <Link href={`/product/${product.slug}`} className={classes.link} />
        <Flex align="center" justify="space-between" gap={theme.spacing.md}>
          <Box className={classes.logoContainer}>
            {product.logo && (
              <Image
                alt={product.name}
                src={product.logo}
                fill
                className={classes.logo}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </Box>
          <Box className={classes.info}>
            <Title order={5} className={classes.title}>
              {product.name}
            </Title>
            <Text className={classes.tagline}>{product.tagline}</Text>
          </Box>
        </Flex>
      </Box>
    </Grid.Col>
  );
};

export default ProductCard;
