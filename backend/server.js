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

app.get("/api/search", async (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();

  // 빈 검색어 -> 빈 결과
  if (!q) return res.json({ items: [], total: 0 });

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

  // 제목에 검색어가 포함된 아이템만 필터링
  const result = TITLES.filter((t) =>
    t.title.toLowerCase().includes(q)
  );

  res.json({
    items: result,
    total: result.length,
  });
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});