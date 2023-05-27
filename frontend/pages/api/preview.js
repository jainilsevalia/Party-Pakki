export default function handler(req, res) {
  res.setPreviewData({});
  if (req.query.redirect) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/");
  }
}
