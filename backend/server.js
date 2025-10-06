import express from "express";
import cors from "cors";
import { TITLES, DATA } from "./data.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/data", (req, res) => {
  // 작품을 장르 별로 그룹화
  const grouped = TITLES.reduce((acc, item) => {
    (acc[item.genre] ||= []).push(item);
    return acc;
  }, {});

  res.json({
    modalContent: DATA.modalContent,
    categoryContent: DATA.categoryContent,
    titleGroups: grouped,
  });
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});