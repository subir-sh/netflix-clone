import { categoryContent, modalContent } from './data.js';

// 헤더 모달 렌더링 및 이벤트 바인딩
function renderHeaderModal() {
    const modal = document.getElementById('headerModal');
    const contentEl = modal.querySelector('.modal__content');
    const triggers = document.querySelectorAll('.actions .trigger');
    let hideTimer = null;

    function showModal(type, btn) {
        contentEl.innerHTML = modalContent[type] || '';
        modal.classList.add('show');

        // 버튼 바로 아래에 위치시키기 (오른쪽 정렬)
        const rect = btn.getBoundingClientRect();
        modal.style.top = rect.bottom + window.scrollY + 'px';
        modal.style.left = (rect.right - modal.offsetWidth) + window.scrollX + 'px';
    }

    function setHideTimer() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            modal.classList.remove('show');
        }, 300); // 0.3초 후 닫기
    }

    function cancelHideTimer() {
        clearTimeout(hideTimer);
        hideTimer = null;
    }

    // 마우스가 버튼/모달에 진입할 때마다 타이머 초기화
    triggers.forEach(btn => {
        const type = btn.dataset.type;

        btn.addEventListener('mouseenter', () => {
            cancelHideTimer();
            showModal(type, btn);
        });

        btn.addEventListener('mouseleave', () => {
            setHideTimer();
        });
    });

    modal.addEventListener('mouseenter', cancelHideTimer);
    modal.addEventListener('mouseleave', setHideTimer);
}

// 아예 카테고리 섹션 html 자체를 동적으로 생성
function renderCategoryRow(key, category) {
    const section = document.createElement('section');
    section.className = 'row';
    section.dataset.key = key;
    section.style.setProperty('--cols', category.visible);

    section.innerHTML = `
    <div class="row__header">
      <h2>${category.title}</h2>
      <div class="page-indicator"></div>
    </div>
    <div class="carousel">
      <button class="carousel__nav prev">〈</button>
      <div class="carousel__viewport">
        <ul class="card-container">
          ${category.items.map(({ id, title, img, alt }) => `
            <li class="card" data-id="${id}">
              <a href="#">
                <img src="${img}" alt="${alt}">
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
      <button class="carousel__nav next">〉</button>
    </div>
  `;

    // 페이지 인디케이터 
    const indicator = section.querySelector('.page-indicator');
    const totalPages = Math.ceil(category.items.length / category.visible);
    indicator.innerHTML = Array.from({ length: totalPages }, (_, i) =>
        `<div class="dot${i === 0 ? ' active' : ''}"></div>`
    ).join('');

    return section;
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main.page');

    // categoryContent 전체를 순회하면서 row 생성
    Object.entries(categoryContent).forEach(([key, category]) => {
        const section = renderCategoryRow(key, category);
        main.appendChild(section);
    });

    renderHeaderModal();
});