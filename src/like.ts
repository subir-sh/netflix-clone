const likes = new Set<string>(); // 일단은 휘발성, 나중에 필요하면 .json 등으로 저장할 수 있음

export function initLikeFeature(section: HTMLElement): void {
    section.querySelectorAll<HTMLButtonElement>(".like-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const card = (e.target as HTMLElement).closest('.card') as HTMLElement;
            const id = card.dataset.id!;
            btn.classList.toggle("liked");
            if (btn.classList.contains('liked')) likes.add(id);
            else likes.delete(id);
        });
    });
}