const router = require("express").Router() ;
const UserRoute = require("./user_route");
router.use(UserRoute) ;
module.exports = router ;