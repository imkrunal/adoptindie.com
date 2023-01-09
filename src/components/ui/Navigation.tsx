import {
  Avatar,
  Burger,
  Button,
  Container,
  createStyles,
  Flex,
  Group,
  Header,
  Menu,
  Paper,
  Text,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  RiUserHeartLine,
  RiArrowDownSLine,
  RiLoginCircleLine,
} from "react-icons/ri";

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

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Trending", href: "/trending" },
  { label: "Most Loved", href: "/most-loved" },
];

const Navigation = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx, theme } = useStyles();
  const { data: sessionData } = useSession();

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
          {!sessionData ? (
            <Button component={Link} href="/login" size="xs" radius="sm">
              Log in
            </Button>
          ) : (
            sessionData.user && (
              <>
                <Button component={Link} href="/product/submit-product">
                  Submit Product
                </Button>
                <Menu
                  width={200}
                  position="bottom-end"
                  transition="pop-top-right"
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                >
                  <Menu.Target>
                    <UnstyledButton
                      className={cx(classes.user, {
                        [classes.userActive]: userMenuOpened,
                      })}
                    >
                      <Group spacing={7}>
                        <Avatar
                          src={sessionData.user.image}
                          alt={sessionData.user.name as string}
                          radius="xl"
                          size={20}
                        />
                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }}>
                          {sessionData.user?.name}
                        </Text>
                        <RiArrowDownSLine size={20} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={
                        <RiLoginCircleLine
                          size={14}
                          color={theme.colors.red[6]}
                        />
                      }
                      onClick={() => signOut()}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            )
          )}
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
