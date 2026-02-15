const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

// Ambil dari environment variable (AMAN)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 🔐 Generate Signature untuk Upload
app.get("/signature", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      type: "authenticated",
    },
    process.env.API_SECRET
  );

  res.json({
    timestamp,
    signature,
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
  });
});

// 🔐 Generate Signed URL untuk View
app.get("/view-url", (req, res) => {
  const { public_id } = req.query;

  const url = cloudinary.url(public_id, {
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 300, // 5 menit
  });

  res.json({ url });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
