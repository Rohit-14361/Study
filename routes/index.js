const express = require("express");

const router = express.Router();
const userRoute = require("../routes/User.route");
const courseRoute = require("../routes/Course.route");
const paymentRoute = require("../routes/Payment.route");
const profileRoute = require("../routes/Profile.route");
const route = [
  {
    path: "/",
    route: userRoute,
  },
  {
    path: "/",
    route: courseRoute,
  },
  {
    path: "/",
    route: paymentRoute,
  },
  {
    path: "/",
    route: profileRoute,
  },
];

route.forEach((route) => {
  router.use(route.path, route.route);
});
module.exports = router;
