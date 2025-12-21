
import FormData from "form-data";
import axios from "axios";
import User from "../model/userModel.js";

export const generateImage = async (req, res) => {
  try {
    
    const userId = req.user?.id;
    const { prompt } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

   if (!user.creditBalance || user.creditBalance <= 0) {
  return res.json({
    success: false,
    message: "Insufficient image credits",
    creditsLeft: user.creditBalance || 0,
  });
}


    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      process.env.CLIPDROP_URL,
      formData,
      {
        headers: {
          ...formData.getHeaders(),       
          "x-api-key": process.env.CLIPDROP,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { creditBalance: -1 } },
      { new: true }
    );

    return res.json({
      success: true,
      image: resultImage,
      creditsLeft: updatedUser.creditBalance,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({ error: "Failed to generate image" });
  }
};
