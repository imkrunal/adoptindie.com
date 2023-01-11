import { Layout } from "@components/ui";
import {
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { api } from "@utils/api";
import { nullToString } from "@utils/helper";
import type { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  RiCameraSwitchLine,
  RiCheckLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import type { NextPageWithLayout } from "src/pages/_app";
import { z } from "zod";
import prisma from "@utils/prisma";
import type { Prisma } from "@prisma/client";
import type { ChangeEvent } from "react";
import { useRef } from "react";

export const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  tagline: z.string().min(1, { message: "Required" }),
  website: z.string().url(),
});

const useStyles = createStyles((theme) => ({
  logoContainer: {
    position: "relative",
    width: 128,
    height: 128,
    backgroundColor: theme.colors.gray[2],
    borderRadius: "100%",
    "&:hover div": {
      display: "flex",
    },
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
  logoUploadContainer: {
    display: "none",
    width: 128,
    height: 128,
    backgroundColor: theme.colors.gray[1],
    opacity: "0.8",
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    svg: {
      width: 24,
      height: 24,
      opacity: 1,
    },
  },
}));

type EditProductProps = {
  product?: Prisma.ProductGetPayload<{
    include: { user: { select: { name: true; image: true } } };
  }>;
};

const EditProduct: NextPageWithLayout = ({ product }: EditProductProps) => {
  const { classes, theme } = useStyles();
  const router = useRouter();
  const form = useForm({
    initialValues: nullToString(product),
    validate: zodResolver(updateProductSchema),
  });
  const mutation = api.product.updateProduct.useMutation({
    onSuccess: (res) => {
      showNotification({
        message: "Logo Updated",
        color: "green",
        icon: <RiCheckLine />,
        disallowClose: true,
      });
      router.push(`/product/${res.slug}`);
    },
  });
  const logoMutation = api.product.updateProductLogo.useMutation({
    onSuccess: (res) => router.push(`/product/${res.slug}`),
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && typeof e.target.files[0] !== "undefined") {
      showNotification({
        id: "logo-upload",
        message: "Uploading Logo",
        autoClose: false,
        disallowClose: true,
        loading: true,
      });
      const file = e.target.files[0];
      const fileArray = file.name.split(".");
      const ext = fileArray[fileArray.length - 1];
      const filename = `product/${product?.slug}.${ext}`;
      const res = await fetch(`/api/upload?file=${filename}`);
      const { url, fields } = await res.json();
      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as Blob);
      });

      const upload = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (upload.ok && product?.slug) {
        logoMutation.mutate({
          slug: product.slug,
          image: `https://s3.us-west-1.amazonaws.com/vite.noticeninja.com/${filename}`,
        });
        console.log("Uploaded successfully!", filename);
      } else {
        console.error("Upload failed.");
      }
      updateNotification({
        id: "logo-upload",
        message: "Logo Uploaded",
        color: "green",
        icon: <RiCheckLine />,
        disallowClose: true,
      });
    }
  };

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
              <div
                className={classes.logoUploadContainer}
                onClick={() => inputRef.current?.click()}
              >
                <RiCameraSwitchLine />
                <input
                  name="file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleUpload}
                  ref={inputRef}
                />
              </div>
            </Box>
            <Box>
              <Title className={classes.title} order={1} mt="xs">
                {product.name}
              </Title>
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
          <Box w={theme.breakpoints.xs} mt={theme.spacing.xl * 2}>
            <form
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSubmit={form.onSubmit((values: any) => mutation.mutate(values))}
            >
              <TextInput
                withAsterisk
                mt="md"
                label="What's the name of your product?"
                placeholder="e.g. Adopt Indie"
                {...form.getInputProps("name")}
              />
              <TextInput
                withAsterisk
                mt="md"
                label="Tagline"
                placeholder="e.g. Join the Indie Movement!"
                {...form.getInputProps("tagline")}
              />
              <TextInput
                withAsterisk
                mt="md"
                label="Website"
                placeholder="e.g. https://adoptindie.com"
                {...form.getInputProps("website")}
              />
              <Textarea
                mt="md"
                label="Motivation"
                {...form.getInputProps("motivation")}
              />
              <Textarea
                mt="md"
                label="Description"
                {...form.getInputProps("description")}
              />
              <Button loading={mutation.isLoading} type="submit" mt="md">
                Update Product
              </Button>
            </form>
          </Box>
        </>
      )}
    </Container>
  );
};

EditProduct.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession({ req: ctx.req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
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
  if (session.user && session.user.id !== product.userId) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return { props: { product } };
}

export default EditProduct;
