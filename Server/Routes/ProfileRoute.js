import express from 'express';
import { getUser } from '../Controllers/ProfileController.js';
import { getPost ,getImagesArr,listOfFollowers,listOfFollowing} from '../Controllers/ProfileController.js';



const router = express.Router();


router.get('/:id', getUser);
router.get('/:id/images',getImagesArr)
router.get('/:id/posts',getPost)
router.get('/:id/followers',listOfFollowers)
router.get('/:id/following', listOfFollowing);

export default router;


