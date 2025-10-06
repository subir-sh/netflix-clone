import { renderHeaderModal } from "./modal";
import { makeCategory, renderCategoryRow } from "./category";
import { initCarousel } from "./carousel";
import { initLikeFeature } from "./like";
import type { DataResponse, Category } from "./types";

async function loadData(): Promise<DataResponse> {
    const res = await fetch("/data.json");
    if (!res.ok) throw new Error("loading failed");
    return res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    const main = document.querySelector("main.page") as HTMLElement;
    const { modalContent, categoryContent } = await loadData();

    const categories: Record<string, Category> = {};
    Object.entries(categoryContent).forEach(([name, { genre, visible, count }]) => {
        categories[name] = makeCategory(name, genre, visible, count);
    });

    Object.entries(categories).forEach(([key, category]) => {
        const section = renderCategoryRow(key, category);
        main.appendChild(section);
        initCarousel(section, category);
        initLikeFeature(section);
    });

    renderHeaderModal(modalContent);
});