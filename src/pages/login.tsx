import { Layout } from "@components/ui";
import {
  Button,
  Container,
  createStyles,
  Flex,
  Text,
  Title,
} from "@mantine/core";
import type { NextPageContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { RiGithubFill, RiGoogleFill, RiTwitterFill } from "react-icons/ri";
import type { NextPageWithLayout } from "./_app";

const useStyles = createStyles(() => ({
  root: {
    minHeight: "calc(100vh - 60px)",
  },
  wrapper: {
    width: "100%",
    maxWidth: 350,
  },
}));

const Login: NextPageWithLayout = () => {
  const { classes } = useStyles();

  return (
    <Container fluid>
      <Flex
        justify="center"
        align="center"
        direction="column"
        className={classes.root}
      >
        <Title order={1}>Log in</Title>
        <Flex gap={16} direction="column" mt={32} className={classes.wrapper}>
          <Button
            size="md"
            leftIcon={<RiGoogleFill size={20} color="#ea4335" />}
            variant="default"
            color="gray"
            fullWidth
            onClick={() => signIn("google")}
          >
            Continue with Google
          </Button>
          <Button
            size="md"
            leftIcon={<RiGithubFill size={20} color="#333333" />}
            variant="default"
            color="gray"
            fullWidth
            onClick={() => signIn("github")}
          >
            Continue with Github
          </Button>
          <Button
            size="md"
            leftIcon={<RiTwitterFill size={20} color="#1da1f2" />}
            variant="default"
            color="gray"
            fullWidth
            onClick={() => signIn("twitter")}
          >
            Continue with Twitter
          </Button>
        </Flex>
        <Container size="sm">
          <Text mt={32} fz="sm" align="center">
            By clicking “Continue with Google/Github/Twitter” above, you
            acknowledge that you have read and understood, and agree to Terms &
            Conditions and Privacy Policy.
          </Text>
        </Container>
      </Flex>
    </Container>
  );
};

Login.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession({ req: ctx.req });
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default Login;
