const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');

// Helper function to remove Tashkeel
function removeTashkeel(word) {
    return word.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');
}

// Function to create and display a result
function createResult(word, meaning, num, surah) {
    const result = document.createElement('div');
    result.classList.add('result');

    result.innerHTML = `
            <p id="word">الكلمة:${word}</p>
            <p id="meaning">${meaning}</p>
            <p id="number">آية:${num !== null ? num : 'N/A'}</p>
            <p id="surah">${surah !== null ? surah : 'N/A'}</p>
    `;

    resultsContainer.appendChild(result);
}

async function getWord() {
    const word = wordInput.value.trim();
    if (word === '') {
        wordInput.style.borderColor = 'red';
        setTimeout(() => {
            wordInput.style.borderColor = '#ced4da';
        }, 2000);
        return;
    }

    const response = await fetch('../words.json');
    const data = await response.json();

    // Preprocess data to store both the original word and the word without Tashkeel
    const processedData = data.map(entry => ({
        ...entry,
        wordWithoutTashkeel: removeTashkeel(entry.word)
    }));

    const normalizedWord = removeTashkeel(word);

    const results = processedData.filter(entry => entry.wordWithoutTashkeel === normalizedWord);

    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>لم يتم العثور على نتائج</p>';
    } else {
        results.forEach(entry => {
            createResult(entry.word, entry.meaning, entry.ayaNumber, entry.surahName);
        });
    }
}

// Event listener for 'Enter' key press
wordInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        getWord();
    } else {
        suggest();
    }
});

wordInput.onfocus = function () {
    document.querySelector(".container").style.display = 'none';
    document.querySelector(".container").style.transition = 'all 0.3s'  
    document.querySelector(".search-box").style.margin = '0';
    document.querySelector(".search-box input").style.width = "100%";
    document.querySelector(".search-box").style.transition = "all 0.3s";
    document.querySelector(".search-box input").style.borderTop = 'none';
    document.querySelector(".search-box input").style.borderRight = 'none';
    document.querySelector(".search-box input").style.borderLeft = 'none';
    document.querySelector(".search-box input").style.borderWidth = '1px';
    document.querySelector(".search-box input").style.padding = "15px";
    document.querySelector(".search-box input").placeholder = '';
}

async function suggest() {
    const words = await fetch("../words.json");
    const data = await words.json();

    const processedData = data.map(entry => ({
        ...entry,
        wordWithoutTashkeel: removeTashkeel(entry.word)
    }));

    const normalizedWord = removeTashkeel(wordInput.value);

    const suggestions = processedData.filter(entry => entry.wordWithoutTashkeel.startsWith(normalizedWord));

    const suggestContainer = document.getElementById('suggest');
    suggestContainer.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(entry => {
            const suggestion = document.createElement('p');
            suggestion.innerHTML = `${entry.word}`;
            suggestion.classList.add('suggestionP');
            suggestContainer.appendChild(suggestion);

            suggestion.addEventListener('click', () => {
                document.querySelector(".search-box").style.display = 'none';
                document.querySelector(".container").style.display = 'block';
                createResult(entry.word, entry.meaning, entry.ayaNumber, entry.surahName);
                wordInput.value = entry.word;
                suggestContainer.innerHTML = '';
            });
        });
    } else {
        const suggestion = document.createElement('p');
        suggestion.innerHTML = 'No suggestions';
        suggestion.classList.add('suggestion');
        suggestContainer.appendChild(suggestion);
    }
}