import type { ModalContent } from "./types";

export function renderHeaderModal(modalContent: ModalContent): void {
    const modal = document.getElementById("headerModal") as HTMLElement;
    const contentEl = modal.querySelector(".modal__content") as HTMLElement;
    const triggers = document.querySelectorAll<HTMLButtonElement>(".actions .trigger");
    const hideTime = 300;
    let hideTimer: number | null = null;

    function showModal(type: string, btn: HTMLElement): void {
        contentEl.innerHTML = modalContent[type] || "";
        modal.classList.add("show");

        const rect = btn.getBoundingClientRect();
        modal.style.top = rect.bottom + "px";
        modal.style.left = rect.right - modal.offsetWidth + window.scrollX + "px";
    }

    function setHideTimer(): void {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => modal.classList.remove("show"), hideTime);
    }

    function cancelHideTimer(): void {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = null;
    }

    triggers.forEach(btn => {
        const type = btn.dataset.type!;
        btn.addEventListener("mouseenter", () => {
        cancelHideTimer();
        showModal(type, btn);
        });
        btn.addEventListener("mouseleave", setHideTimer);
    });

    modal.addEventListener("mouseenter", cancelHideTimer);
    modal.addEventListener("mouseleave", setHideTimer);
}
