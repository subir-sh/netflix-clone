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
  document.querySelectorAll('.row[data-key]').forEach(row => {
    const key = row.getAttribute('data-key');
    renderCategoryRow(row, categories[key] || []);
  });

});