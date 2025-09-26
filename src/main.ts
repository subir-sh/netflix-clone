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
    const { modalContent, categoryContent: rawCategories } = await loadData();

    const categoryContent: Record<string, Category> = {};
    Object.entries(rawCategories).forEach(([name, { title, visible, count }]) => {
        categoryContent[name] = makeCategory(name, title, visible, count);
    });

    Object.entries(categoryContent).forEach(([key, category]) => {
        const section = renderCategoryRow(key, category);
        main.appendChild(section);
        initCarousel(section, category);
        initLikeFeature(section);
    });

    renderHeaderModal(modalContent);
});