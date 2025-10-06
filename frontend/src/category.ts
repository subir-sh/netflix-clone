import type { Category } from "./types";

export function makeCategory(
    name: string,
    title: string,
    visible: number,
    count: number
    ): Category {
        const items = Array.from({ length: count }, (_, i) => {
            const idx = i + 1;
            return {
            id: `${name}${idx}`,
            title: `작품 ${name}${idx}`,
            img: idx % 2 === 1 ? "images/sample.png" : "images/sample2.png",
            alt: `작품 ${name}${idx} 포스터`
            };
        });

        items[0].img = "images/first.png";
        return { title, visible, items };
    }

export function renderCategoryRow(key: string, category: Category): HTMLElement {
    const section = document.createElement("section");
    section.className = "row";
    section.dataset.key = key;
    section.style.setProperty("--cols", String(category.visible));

    section.innerHTML = `
        <div class="row__header">
        <h2>${category.title}</h2>
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