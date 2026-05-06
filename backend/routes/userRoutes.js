const router = require("express").Router();
const { getProfile, updateProfile, changePassword, getAllUsers } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/",                protect, admin,  getAllUsers);
router.get("/profile",         protect,         getProfile);
router.put("/profile",         protect,         updateProfile);
router.put("/change-password", protect,         changePassword);

module.exports = router;
