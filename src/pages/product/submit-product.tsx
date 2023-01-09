import { Layout } from "@components/ui";
import { Button, Container, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { api } from "@utils/api";
import type { NextPageContext } from "next";
import { useRouter } from "next/router";
import { z } from "zod";
import type { NextPageWithLayout } from "../_app";
import { getSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import { RiCloseLine } from "react-icons/ri";

export const submitProductSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  tagline: z.string().min(1, { message: "Required" }),
  website: z.string().url(),
});

const SubmitProduct: NextPageWithLayout = () => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      tagline: "",
      website: "",
    },
    validate: zodResolver(submitProductSchema),
  });
  const mutation = api.product.submitProduct.useMutation({
    onSuccess: (res) => router.push(`/product/${res.slug}/edit`),
    onError: (err) =>
      showNotification({
        message: err.message,
        color: "red",
        icon: <RiCloseLine />,
        disallowClose: true,
      }),
  });

  return (
    <Container size="xs">
      <Title align="center" my="xl">
        Submit Your Product
      </Title>
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <TextInput
          withAsterisk
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
        <Button loading={mutation.isLoading} type="submit" mt="md">
          Submit Product
        </Button>
      </form>
    </Container>
  );
};

SubmitProduct.getLayout = (page) => <Layout>{page}</Layout>;

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
  return { props: {} };
}

export default SubmitProduct;
