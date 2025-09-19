export const modalContent = {
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

// 카테고리 데이터 생성: 홀수=sample.png, 짝수=sample2.png
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

export const categoryContent = {
    action: makeCategory('action', '액션', 6, 20),
    animation: makeCategory('animation', '애니메이션', 7, 40),
    thriller: makeCategory('thriller', '스릴러', 5, 35),
};