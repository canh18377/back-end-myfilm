app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend TikTok API is running...");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
