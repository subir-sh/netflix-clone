// 모달
const modalContent = {
    notif: `
    <ul>
      <li><a href="#">새로운 에피소드 등장</a></li>
      <li><a href="#">내가 찜한 콘텐츠 업데이트</a></li>
      <li><a href="#">오늘 저녁 8시 공개 예정</a></li>
    </ul>
  `,
    profile: `
    <ul>
      <li><a href="#">계정</a></li>
      <li><a href="#">설정</a></li>
      <li><a href="#">고객 센터</a></li>
      <li><a href="#">로그아웃</a></li>
    </ul>
  `,
};

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

// 카테고리 데이터 생성: 각 15개, 홀수=sample.png, 짝수=sample2.png
function makeCategory(name, count) {
    const cat = [];
    for (let i = 1; i <= count; i++) {
        cat.push({
            id: `${name}${i}`,
            title: `작품 ${name}${i}`,
            img: i % 2 === 1 ? 'images/sample.png' : 'images/sample2.png',
            alt: `작품 ${name}${i} 포스터`,
        });
    }
    cat[0].img = 'images/first.png'; // 캐러셀 동작 여부 판명을 위해 첫 요소는 특별히
    return cat;
}

const categories = {
    action: makeCategory('action', 20),
    animation: makeCategory('animation', 20),
    thriller: makeCategory('thriller', 20),
};

// html의 card-container ul에 li(작품 카드)들을 동적으로 추가
function renderCategoryRow(rowEl, items) {
    const ul = rowEl.querySelector('.card-container');
    if (!ul) return;

    // data-visible -> css 변수(--cols)에 반영, 기본 6
    const visible = Number(rowEl.dataset.visible) || 6;
    rowEl.style.setProperty('--cols', visible);

    ul.innerHTML = items.map(({ id, title, img, alt }) => `
    <li class="card" data-id="${id}">
      <a href="#" aria-label="${title}">
        <img src="${img}" alt="${alt || title}">
      </a>
    </li>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // 각 카테고리 row에 데이터 렌더링
    document.querySelectorAll('.row[data-key]').forEach(row => {
        const key = row.getAttribute('data-key');
        renderCategoryRow(row, categories[key] || []);
    });
    renderHeaderModal();
});