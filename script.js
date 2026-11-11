// Находим кнопки поиска и очистки
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

// Добавляем обработчики событий, если элементы существуют (чтобы не было ошибок на других страницах)
if (btnSearch && btnClear) {
    btnSearch.addEventListener('click', performSearch);
    btnClear.addEventListener('click', clearResults);
}

function clearResults() {
    document.getElementById('searchInput').value = '';
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('introSection').style.display = 'block';
}

function performSearch() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('resultsContainer');
    const introSection = document.getElementById('introSection');

    // Очищаем предыдущие результаты
    resultsContainer.innerHTML = ''; 

    // Если введено пустое значение, выходим
    if(!input) return;

    // Скрываем блок приветствия во время поиска
    introSection.style.display = 'none'; 

    // Загружаем данные из JSON файла
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let results = [];

            // Проверяем введенное ключевое слово (с учетом единственного и множественного числа)
            if (input === 'beach' || input === 'beaches') {
                results = data.beaches.slice(0, 2); // Берем первые 2 пляжа
            } else if (input === 'temple' || input === 'temples') {
                results = data.temples.slice(0, 2); // Берем первые 2 храма
            } else if (input === 'country' || input === 'countries') {
                results = data.countries[0].cities.slice(0, 2); // Берем 2 города из первой страны
            }

            // Отрисовываем результаты, если они есть
            if (results.length > 0) {
                results.forEach(item => {
                    resultsContainer.innerHTML += `
                        <div class="card">
                            <img src="${item.imageUrl}" alt="${item.name}">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <button class="visit-btn">Visit</button>
                        </div>
                    `;
                });
            } else {
                resultsContainer.innerHTML = '<h3>No recommendations found. Try searching for "beaches", "temples", or "countries".</h3>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}