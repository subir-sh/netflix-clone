import type { Category } from "./types";

export function initCarousel(section: HTMLElement, category: Category): void {
    const track = section.querySelector(".card-container") as HTMLElement;
    const prevBtn = section.querySelector(".carousel__nav.prev") as HTMLButtonElement;
    const nextBtn = section.querySelector(".carousel__nav.next") as HTMLButtonElement;
    const indicator = section.querySelector(".page-indicator") as HTMLElement;
    const viewport = section.querySelector(".carousel__viewport") as HTMLElement;

    const { visible, items } = category;
    const totalCards = items.length;
    const totalPages = Math.ceil(totalCards / visible);
    const cardGap = parseInt(getComputedStyle(track).gap) || 0;

    const nodes = Array.from(track.children);
    const prepend = nodes.slice(-visible).map(n => n.cloneNode(true));
    const append = nodes.slice(0, visible).map(n => n.cloneNode(true));
    for (let i = prepend.length - 1; i >= 0; i--) {
        track.insertBefore(prepend[i], track.firstChild);
    }
    append.forEach(n => track.appendChild(n));

    let currentPage = 0;

    function update(animate = true): void {
        track.style.transition = animate ? "transform 0.5s ease" : "none";
        const offset = (viewport.offsetWidth + cardGap) * (currentPage + 1);
        track.style.transform = `translateX(-${offset}px)`;

        indicator.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentPage);
        });
    }

    nextBtn.addEventListener("click", () => {
        currentPage++;
        update();
        if (currentPage >= totalPages) {
            track.addEventListener(
                "transitionend",
                () => {
                track.style.transition = "none";
                currentPage = 0;
                update(false);
                },
                { once: true }
            );
        }
    });

    prevBtn.addEventListener("click", () => {
        currentPage--;
        update();
        if (currentPage < 0) {
            track.addEventListener(
                "transitionend",
                () => {
                track.style.transition = "none";
                currentPage = totalPages - 1;
                update(false);
                },
                { once: true }
            );
        }
    });

    update(false);
}