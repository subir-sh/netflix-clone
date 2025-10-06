import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());          // 모든 요청 허용
app.use(express.json());  // JSON 파싱

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(PORT, () => {
  console.log(` Server on http://localhost:${PORT}`);
});

// GET: 데이터 조회
app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello World" });
});

// POST: 데이터 생성
app.post("/api/echo", (req, res) => {
  res.json({ youSent: req.body });
});

// 쿼리 → /api/search?q=dune
app.get("/api/search", (req, res) => {
  res.json({ query: req.query.q });
});

// 파라미터 → /api/user/42
app.get("/api/user/:id", (req, res) => {
  res.json({ id: req.params.id });
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dist 폴더를 정적 자원으로 제공
app.use(express.static(path.join(__dirname, "dist")));