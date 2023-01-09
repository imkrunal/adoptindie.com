import { Box, createStyles, Flex, Grid, Text, Title } from "@mantine/core";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";

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
    cursor: "pointer",
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
  logoContainer: {
    position: "relative",
    width: 64,
    height: 64,
    backgroundColor: theme.colors.gray[2],
    borderRadius: "100%",
  },
  logo: {
    borderRadius: 100,
  },
}));

const ProductCard = ({ product }: ProductCardProps) => {
  const { classes, theme } = useStyles();
  const router = useRouter();

  return (
    <Grid.Col md={4}>
      <Box
        className={classes.root}
        onClick={() => router.push(`/product/${product.slug}`)}
      >
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
