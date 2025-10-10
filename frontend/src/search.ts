let debounceTimer: number | undefined;

export function initSearch() {
  const input = document.querySelector(".search-bar input") as HTMLInputElement;
  const layer = document.querySelector(".search-layer") as HTMLElement;
  const grid = document.querySelector(".search-grid") as HTMLElement;

  if (!input || !layer || !grid) return;

  input.addEventListener("input", () => {
    const q = input.value.trim();

    if (debounceTimer) clearTimeout(debounceTimer);

    if (!q) {
      layer.classList.remove("active");
      grid.innerHTML = "";
      return;
    }

    debounceTimer = window.setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("검색 실패");

        const data = await res.json();

        if (data.items.length === 0) {
          grid.innerHTML = "<p>검색 결과가 없습니다.</p>";
        } else {
          grid.innerHTML = data.items
            .map(
              (i: any) => `
              <div class="card">
                <img src="${i.image}" alt="${i.title}" />
                <p>${i.title}</p>
              </div>`
            )
            .join("");
        }

        layer.classList.add("active");
      } catch (err) {
        console.error(err);
      }
    }, 500);
  });
}