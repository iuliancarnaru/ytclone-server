import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });

  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found"));
    }

    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found"));
    }

    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);

      res.status(200).json("Video has been deleted");
    } else {
      return next(createError(403, "You can delete only your video"));
    }
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

export const addViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("Views have been increased");
  } catch (error) {
    next(error);
  }
};

export const randomVideos = async (req, res, next) => {
  try {
    const randomVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(randomVideos);
  } catch (error) {
    next(error);
  }
};

export const trendVideos = async (req, res, next) => {
  try {
    // bring the videos with the most views
    const trendVideos = await Video.find().sort({ views: -1 });
    res.status(200).json(trendVideos);
  } catch (error) {
    next(error);
  }
};

export const subscribedVideos = async (req, res, next) => {
  try {
    // because we use verifyToken we can take id directly from user
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    // returns an array of arrays -> we need to flat it and sort it based of createdAt
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

export const getByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");

  try {
    const videos = await Video.find({
      tags: {
        $in: tags,
      },
    }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;

  try {
    // search based on query with the option case insensitive
    const videos = await Video.find({
      title: {
        $regex: query,
        $options: "i",
      },
    }).limit(40);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
