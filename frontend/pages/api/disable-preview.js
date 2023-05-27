export default function handler(req, res) {
  res.clearPreviewData();
  res.json({ preview: false });
}
