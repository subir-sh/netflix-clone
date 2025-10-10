import { renderHeaderModal } from "./modal";
import { makeCategory, renderCategoryRow } from "./category";
import { initCarousel } from "./carousel";
import { initLikeFeature } from "./like";
import { initSearch } from "./search";
import type { Category, DataResponse } from "./types";

async function loadData<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`loading failed from ${url}`);
    return res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    const main = document.querySelector("main.page") as HTMLElement;
    const { modalContent, categoryContent, titleGroups } = await loadData<DataResponse>("http://localhost:3001/api/data");

    const categories: Record<string, Category> = {};
    Object.entries(categoryContent).forEach(([name, { genre, visible }]) => {
        const titles = titleGroups[name] || [];
        categories[name] = makeCategory(genre, visible, titles);
    });

    Object.entries(categories).forEach(([key, category]) => {
        const section = renderCategoryRow(key, category);
        main.appendChild(section);
        initCarousel(section, category);
        initLikeFeature(section);
    });

    initSearch();
    renderHeaderModal(modalContent);
});