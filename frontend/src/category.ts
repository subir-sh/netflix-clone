import type { Category, Title } from "./types";

export function makeCategory(
        genre: string,
        visible: number,
        titles: Title[]
    ): Category {
        const items = titles.map(t => ({
            id: t.id.toString(),
            title: t.title,
            img: t.image,
            alt: `${t.title} 포스터`,
        }));

        return { genre, visible, items };
    }

export function renderCategoryRow(key: string, category: Category): HTMLElement {
    const section = document.createElement("section");
    section.className = "row";
    section.dataset.key = key;
    section.style.setProperty("--cols", String(category.visible));

    section.innerHTML = `
        <div class="row__header">
        <h2>${category.genre}</h2>
        <div class="page-indicator"></div>
        </div>
        <div class="carousel">
        <button class="carousel__nav prev">〈</button>
        <div class="carousel__viewport">
            <ul class="card-container">
            ${category.items
                .map(
                ({ id, img, alt }) => `
                <li class="card" data-id="${id}">
                <a href="#"><img src="${img}" alt="${alt}"></a>
                <button class="like-btn">♥</button>
                </li>`
                )
                .join("")}
            </ul>
        </div>
        <button class="carousel__nav next">〉</button>
        </div>
    `;

    const indicator = section.querySelector(".page-indicator") as HTMLElement;
    const totalPages = Math.ceil(category.items.length / category.visible);
    indicator.innerHTML = Array.from(
        { length: totalPages },
        (_, i) => `<div class="dot${i === 0 ? " active" : ""}"></div>`
    ).join("");

    return section;
}