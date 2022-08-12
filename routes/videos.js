import express from "express";
import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  addViews,
  trendVideos,
  randomVideos,
  subscribedVideos,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// create a video
router.post("/", verifyToken, addVideo);

// update a video
router.put("/:id", verifyToken, updateVideo);

// delete a video
router.delete("/:id", verifyToken, deleteVideo);

// get a video
router.get("/find/:id", getVideo);

router.get("/view/:id", addViews);

router.get("/trend", trendVideos);

router.get("/random", randomVideos);

router.get("/subscribed", verifyToken, subscribedVideos);

// router.get("/tags", verifyToken);

// router.get("/search", verifyToken);

export default router;
