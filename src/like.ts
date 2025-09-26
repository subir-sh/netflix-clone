export function initLikeFeature(section: HTMLElement): void {
    section.querySelectorAll<HTMLButtonElement>(".like-btn").forEach(btn => {
        btn.addEventListener("click", e => {
        e.preventDefault();
        btn.classList.toggle("liked");
        });
    });
}