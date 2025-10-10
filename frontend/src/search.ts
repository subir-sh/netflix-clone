let debounceTimer: number | undefined;

function enterSearchMode(layer: HTMLElement, hero: HTMLElement, main: HTMLElement) {
    layer.classList.add("active");
    hero.style.display = "none";
    main.style.display = "none";
}

function exitSearchMode(
    layer: HTMLElement,
    grid: HTMLElement,
    hero: HTMLElement,
    main: HTMLElement,
    input: HTMLInputElement
) {
    layer.classList.remove("active");
    grid.innerHTML = "";
    input.value = "";
    hero.style.display = "";
    main.style.display = "";
}

export function initSearch() {
    const input = document.querySelector(".search-bar input") as HTMLInputElement;
    const btn = document.getElementById("searchBtn") as HTMLButtonElement;
    const bar = document.querySelector(".search-bar") as HTMLElement;
    const layer = document.querySelector(".search-layer") as HTMLElement;
    const grid = document.querySelector(".search-grid") as HTMLElement;
    const hero = document.querySelector(".hero") as HTMLElement;
    const main = document.querySelector("main.page") as HTMLElement;

    if (!input || !btn || !bar || !layer || !grid || !hero || !main) return;

    // 검색창 확대 애니메이션
    btn.addEventListener("click", () => {
        const isActive = bar.classList.toggle("active");
        if (isActive) {
            input.focus();
        } else {
            exitSearchMode(layer, grid, hero, main, input);
        }
    });

    // 검색창 입력
    input.addEventListener("input", () => {
        const q = input.value.trim();

        if (debounceTimer) clearTimeout(debounceTimer);

        if (!q) {
            exitSearchMode(layer, grid, hero, main, input);
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

                enterSearchMode(layer, hero, main);
            } catch (err) {
                console.error(err);
            }
        }, 500);
    });
}