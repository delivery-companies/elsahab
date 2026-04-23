import { isAuthorized } from "@/hooks/useAuthorized";
import { navSections } from "@/mockup/navSections";
// import { useAuth } from "@/store/authStore";
import {
  AppShell,
  Burger,
  Group,
  Loader,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NotificationsList } from "../NotificationsList";
import { UserNavCard } from "../UserNavCard";
import classes from "./NavbarNested.module.css";
import logo from "@/assets/logo-color.png";
import { useAuth } from "@/store/authStore";
interface Props {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
}

export const AppLayout = ({ children, isLoading, isError }: Props) => {
  const { mainRepository, role, type } = useAuth();

  const pathName = useLocation().pathname;

  const renderActiveLinkArabicName = () => {
    const trimmedPathName = pathName.split("/")[1];
    const activeLink = navSections.find(
      (item) => item.link === `/${trimmedPathName}`,
    );

    if (activeLink) {
      return activeLink.label;
    }
    return "";
  };

  const [active, setActive] = useState(
    navSections.find((item) => item.link === pathName)?.label || "",
  );

  // const Devider = () => (
  //     <div
  //         style={{
  //             borderTop: "1px solid",
  //             width: "90%",
  //             marginBlock: "5px",
  //             borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
  //         }}
  //     />
  // );

  const links = navSections.map((item) => {
    const canRenderItem = isAuthorized(item.roles);
    if (!canRenderItem) {
      return null;
    }
    if (
      role === "REPOSITORIY_EMPLOYEE" &&
      type === "RETURN" &&
      item.type === "EXPORT"
    ) {
      return null;
    }
    if (
      role === "REPOSITORIY_EMPLOYEE" &&
      type === "EXPORT" &&
      item.type === "RETURN"
    ) {
      return null;
    }
    if (item.link === "/main-repository" && mainRepository) {
      return (
        <div key={item.label}>
          <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => {
              setActive(item.label);
            }}
            // style={item.lastOfGroup ? { marginBottom: "10px" } : {}}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>ارسال الطلبات الى الافرع</span>
          </Link>
          {/* {item.lastOfGroup && <Devider />} */}
        </div>
      );
    }
    if (item.link === "/incoming-orders" && mainRepository) {
      return (
        <div key={item.label}>
          <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => {
              setActive(item.label);
            }}
            // style={item.lastOfGroup ? { marginBottom: "10px" } : {}}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>الطلبات المرسله الى المخزن الرئيسي</span>
          </Link>
          {/* {item.lastOfGroup && <Devider />} */}
        </div>
      );
    }
    if (item.link === "/outcoming-orders" && mainRepository) {
      return (
        <div key={item.label}>
          <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => {
              setActive(item.label);
            }}
            // style={item.lastOfGroup ? { marginBottom: "10px" } : {}}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>الطلبات الصادره الى مخزن الفرع</span>
          </Link>
          {/* {item.lastOfGroup && <Devider />} */}
        </div>
      );
    }
    return (
      <div key={item.label}>
        <Link
          className={classes.link}
          data-active={item.label === active || undefined}
          to={item.link}
          key={item.label}
          onClick={() => {
            setActive(item.label);
          }}
          // style={item.lastOfGroup ? { marginBottom: "10px" } : {}}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </Link>
        {/* {item.lastOfGroup && <Devider />} */}
      </div>
    );
  });

  const handleRender = () => {
    if (isLoading) {
      return (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Loader />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <h1 className="text-primary text-3xl">
            حدث خطأ ما، يرجى المحاولة مرة أخرى
          </h1>
        </div>
      );
    }

    return children;
  };
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: rem(60), offset: true }}
      navbar={{
        width: rem(240),
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md">
      <AppShell.Header
        className={mobileOpened || desktopOpened ? "" : "opened"}>
        <Group h="100%" w="100%" px="md" justify="space-between">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />

            <Text
              style={{
                marginRight: "10px",
                color: "#9F1624",
                fontSize: "18px",
              }}
              ta="start"
              size="md"
              fw={700}>
              {renderActiveLinkArabicName()}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="-ml-2">
              <NotificationsList />
            </div>
            <UserNavCard />
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar mt={0} py={rem(0)}>
        <div className={classes.logo}>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <img src={logo} alt="logo" />
        </div>
        <AppShell.Section
          style={{ marginBottom: "0", marginTop: "-20px" }}
          p="md"
          grow
          component={ScrollArea}>
          {/* <Devider /> */}
          <div className={classes.linksInner}>{links}</div>
          {/* <Devider /> */}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        className={mobileOpened || desktopOpened ? "" : "opened"}
        pt={rem(100)}>
        {handleRender()}
      </AppShell.Main>
    </AppShell>
  );
};
