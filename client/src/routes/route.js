import { lazy } from "react";

export const ROUTES = [
  {
    name: "home",
    path: "/home",
    component: lazy(() => import("../pages/Home")),
  },
  {
    name: "profile",
    path: "/profile",
    component: lazy(() => import("../pages/Profile")),
  },
  {
    name: "messages",
    path: "/messages",
    component: lazy(() => import("../pages/Messages")),
  },
  {
    name: "friends",
    path: "/friends",
    component: lazy(() => import("../pages/Friends")),
  },
  {
    name: "events",
    path: "/events",
    component: lazy(() => import("../pages/Events")),
  },
  {
    name: "stories",
    path: "/stories",
    component: lazy(() => import("../pages/Stories")),
  },
];
