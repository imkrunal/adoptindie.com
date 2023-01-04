import {
  Burger,
  Button,
  Container,
  createStyles,
  Flex,
  Group,
  Header,
  Paper,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { RiUserHeartLine } from "react-icons/ri";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
    borderBottom: 0,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  logo: {
    display: "flex",
    alignItems: "center",
    span: {
      marginLeft: theme.spacing.xs,
    },
    svg: {
      fontSize: 24,
    },
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[9],
    marginRight: theme.spacing.md,
  },
  authMenu: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Trending", href: "/trending" },
  { label: "Most Loved", href: "/most-loved" },
];

const Navigation = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const items = navLinks.map((link) => (
    <Link key={link.label} href={link.href} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header} size="xl">
        <Flex>
          <Link href="/" className={classes.logo}>
            <RiUserHeartLine />
            <span>Adopt Indie</span>
          </Link>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
        </Flex>
        <Group className={classes.authMenu}>
          <Button component={Link} href="/auth/login" size="xs" radius="sm">
            Log in
          </Button>
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default Navigation;
