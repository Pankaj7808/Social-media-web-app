import express from "express";
import { UnFollowUser, deleteUser, followUser, getAllUsers, getUser, updateUser ,setSearch,getSearch} from "../Controllers/UserController.js";
import authMiddleWare from "../Middleware/authMiddleWare.js";

const router = express.Router();


router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id',  updateUser);
router.delete('/:id',  deleteUser);
router.put('/:id/follow', followUser); 
router.put('/:id/unfollow',  UnFollowUser);
router.patch('/search/:id',setSearch)
router.get('/getsearch/:id',getSearch)
export default router;