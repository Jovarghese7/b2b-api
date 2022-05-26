const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//Create a Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update a Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post.userId);
    console.log(req.body.userId);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });

      res.status(200).json("successfully updated the post");
    } else {
      res.status(403).json("You can update only your Post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete a Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("successfully deleted the post");
    } else {
      res.status(403).json("You can delete only your Post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Like a Post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });

      res.status(200).json("post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get timeline
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    const allPosts = userPosts.concat(...friendPosts);
    res.json(allPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
