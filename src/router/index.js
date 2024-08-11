import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import i18n from "../plugins/i18n";

import Login from "../views/Login";
import Home from "../views/Home";
import Profile from "../views/Profile";
import Report from "../views/Report";
import AuditEdit from "../views/AuditEdit";
import AuditPage from "../views/AuditPage";
import FormAnswer from "../views/FormAnswer";
import Register from "../views/Register";
import About from "../views/About";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "home",
    component: Home,
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/sign-up",
    name: "signUp",
    component: Register,
    meta: {
      middleware: ["check_auth"],
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/audit/new",
    name: "newAudit",
    component: AuditEdit,
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/audit/:auditId/reports",
    name: "reports",
    component: Report,
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/audit/:auditId/view",
    name: "audit",
    component: AuditPage,
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/audit/:auditId/form/:formId/",
    name: "answerForm",
    component: FormAnswer,
    meta: {
      middleware: ["auth"],
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      middleware: ["check_auth"],
    },
  },
  {
    path: "*",
    redirect: { name: "home" },
    meta: {
      middleware: ["check_auth"],
    },
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((routeTo, routeFrom, next) => {
  const user_token = store.state?.token;
  const routeTo_middleware = routeTo.meta?.middleware ?? [];

  let nextRoute = null;
  if (routeFrom.name) {
    nextRoute = routeFrom;
  }

  if (routeTo_middleware.includes("auth")) {
    if (user_token === undefined || user_token === null) {
      if (nextRoute === null || nextRoute === routeFrom) {
        nextRoute = {
          name: "login",
        };
      }

      next(nextRoute);
    } else {
      next();
    }
  } else if (routeTo_middleware.includes("auth_manager")) {
    const user_type = store.state?.user.type;

    if (
      user_token === undefined ||
      user_token === null ||
      user_type != "manager"
    ) {
      if (nextRoute === null) {
        nextRoute = {
          name: "login",
        };
      }

      next(nextRoute);
    } else {
      next();
    }
  } else if (routeTo_middleware.includes("check_auth")) {
    if (user_token !== undefined && user_token !== null) {
      if (nextRoute == null) {
        nextRoute = {
          name: "home",
        };
      }

      next(nextRoute);
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((routeTo) => {
  document.title = process.env.VUE_APP_NAME + " | " + i18n.t(routeTo.name);
});

export default router;
