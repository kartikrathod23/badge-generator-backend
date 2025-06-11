const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Optional font registration
const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Bold.ttf');
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: 'sans' });
}

const generateBadge = async (name, designation, profileImagePath) => {
  const width = 400;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f4f4f4';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#0057e7';
  ctx.fillRect(0, 0, width, 100);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Sans';
  ctx.textAlign = 'center';
  ctx.fillText('EMPLOYEE BADGE', width / 2, 60);

  // Draw profile photo circle
  // Accept both local paths and URLs (Cloudinary returns URLs)
try {
  const profileImage = await loadImage(profileImagePath);
  const radius = 80;
  const centerX = width / 2;
  const centerY = 180;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(profileImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();
} catch (err) {
  console.error("Error loading profile image:", err);
}


  // Name and designation
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Sans';
  ctx.fillText(name, width / 2, 320);

  ctx.fillStyle = '#666';
  ctx.font = 'bold 24px Sans';
  ctx.fillText(designation, width / 2, 360);

  // Footer with a "glow" effect rings (fake CSS animation representation)
  ctx.strokeStyle = '#0057e7';
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(width / 2, height - 80, i * 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Save file
  const badgeName = `badge-${uuidv4()}.png`;
  const badgePath = path.join(__dirname, '../uploads', badgeName);
  fs.writeFileSync(badgePath, canvas.toBuffer('image/png'));

  return `uploads/${badgeName}`;
};

module.exports = generateBadge;
