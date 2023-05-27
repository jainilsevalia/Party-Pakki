export default function handler(req, res) {
  const isInPreviewMode = !!req.cookies["__next_preview_data"] ?? false;
  res.json({ isInPreviewMode });
}
