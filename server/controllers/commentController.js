import commentModel from "../model/commentModel.js";

export const createComment = async (req, res) => {
  try {
    const { content, rating } = req.body;

   
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newComment = new commentModel({
      user: req.user.id,   
      content,
      rating
    });

    await newComment.save();
    await newComment.populate("user", "username email");

    res.status(201).json(newComment);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getAllComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await commentModel.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: You can only delete your own comments."
      });
    }

    await commentModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
