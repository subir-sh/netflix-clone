// 헤더 모달 렌더링 및 이벤트 바인딩
function renderHeaderModal(modalContent) {
    const modal = document.getElementById('headerModal');
    const contentEl = modal.querySelector('.modal__content');
    const triggers = document.querySelectorAll('.actions .trigger');
    let hideTimer = null;

    function showModal(type, btn) {
        contentEl.innerHTML = modalContent[type] || '';
        modal.classList.add('show');

        // 버튼 바로 아래에 위치시키기 (오른쪽 정렬)
        const rect = btn.getBoundingClientRect();
        modal.style.top = rect.bottom + 'px';
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

// 카드 데이터 placeholder 생성: 홀수=sample.png, 짝수=sample2.png
function makeCategory(name, title, visible, count) {
    const items = [];
    for (let i = 1; i <= count; i++) {
        items.push({
            id: `${name}${i}`,
            title: `작품 ${name}${i}`,
            img: i % 2 === 1 ? 'images/sample.png' : 'images/sample2.png',
            alt: `작품 ${name}${i} 포스터`,
        });
    }
    items[0].img = 'images/first.png'; // 캐러셀 동작 여부 판명을 위해 첫 요소는 특별히
    return { title, visible, items };
}

async function loadData() {
    const res = await fetch('/data.json');
    return res.json();
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
              <button class="like-btn">♥</button>
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

// 캐러셀 기능 구현
function initCarousel(section, category) {
    const track = section.querySelector('.card-container');
    const prevBtn = section.querySelector('.carousel__nav.prev');
    const nextBtn = section.querySelector('.carousel__nav.next');
    const indicator = section.querySelector('.page-indicator');
    const viewport = section.querySelector('.carousel__viewport');

    const visible = category.visible;
    const totalCards = category.items.length;
    const totalPages = Math.ceil(totalCards / visible);
    const cardGap = parseInt(getComputedStyle(track).gap) || 0;

    // seamless loop를 위해 앞뒤로 복제
    const items = Array.from(track.children);
    const prepend = items.slice(-visible).map(item => item.cloneNode(true));
    const append = items.slice(0, visible).map(item => item.cloneNode(true));
    for (let i = prepend.length - 1; i >= 0; i--) {
        track.insertBefore(prepend[i], track.firstChild);
    }
    append.forEach(item => track.appendChild(item));

    let currentPage = 0;

    function update(animate = true) {
        // 트랙의 마지막에서 처음으로 돌아갈 때는 되감기 트랜지션 없이 이동
        track.style.transition = animate ? 'transform 0.5s ease' : 'none';

        const offset = (viewport.offsetWidth + cardGap) * (currentPage + 1); // +1: 앞쪽 복제 
        track.style.transform = `translateX(-${offset}px)`;

        // 인디케이터 업데이트
        indicator.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPage);
        });
    }

    nextBtn.addEventListener('click', () => {
        currentPage++;
        update();

        // 복제 카드까지 넘어간 경우
        if (currentPage >= totalPages) {
            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                currentPage = 0; // 첫 페이지로 순간이동
                update(false);
            }, { once: true });
        }
    });

    prevBtn.addEventListener('click', () => {
        currentPage--;
        update();

        // 복제 카드 전까지 간 경우
        if (currentPage < 0) {
            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                currentPage = totalPages - 1; // 마지막 페이지로 순간이동
                update(false);
            }, { once: true });
        }
    });

    update(false); // 초기 세팅
}

function initLikeFeature(section) {
    section.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', e => {
        e.preventDefault();
        const card = e.target.closest('.card');
        const id = card.dataset.id;

        // toggle
        btn.classList.toggle('liked');
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const main = document.querySelector('main.page');
    const { modalContent, categoryContent: rawCategories } = await loadData();

    // JSON을 받아서 categoryContent 생성
    const categoryContent = {};
    Object.entries(rawCategories).forEach(([name, { title, visible, count }]) => {
        categoryContent[name] = makeCategory(name, title, visible, count);
    });

    // categoryContent 전체를 순회하면서 row 생성
    Object.entries(categoryContent).forEach(([key, category]) => {
        const section = renderCategoryRow(key, category);
        main.appendChild(section);
        initCarousel(section, category);
        initLikeFeature(section); 
    });

    renderHeaderModal(modalContent);
});