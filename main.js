const request = new XMLHttpRequest();
const REQUEST_STATUS = {
    FINISHED: 4,
    OK: 200,
};
let results = [];
let answerCount = 0;
let correctAnswerCount = 0;
const btnContainer = document.querySelector('#btnContainer');
const titleDiv = document.getElementById('title');
const titleElement = document.createElement('h1');

const textDiv = document.getElementById('text');
const textElement = document.createElement('input');
textElement.setAttribute('readonly', '');
textElement.setAttribute('style', 'width: 100%');

const categoryDiv = document.getElementById('category');
const categoryElement = document.createElement('h2');
const difficultyDiv = document.getElementById('difficulty');
const difficultyElement = document.createElement('h2');

const answerBtn1Div = document.getElementById('answerBtn1');
const answerBtn1Element = document.createElement('input');
const answerBtn2Div = document.getElementById('answerBtn2');
const answerBtn2Element = document.createElement('input');
const answerBtn3Div = document.getElementById('answerBtn3');
const answerBtn3Element = document.createElement('input');
const answerBtn4Div = document.getElementById('answerBtn4');
const answerBtn4Element = document.createElement('input');
const answerBtnElements = [
    answerBtn1Element,
    answerBtn2Element,
    answerBtn3Element,
    answerBtn4Element,
];
answerBtn1Element.setAttribute('type', 'submit');
answerBtn2Element.setAttribute('type', 'submit');
answerBtn3Element.setAttribute('type', 'submit');
answerBtn4Element.setAttribute('type', 'submit');
answerBtn1Element.addEventListener('click', () => {
    answerBtnEvent()
});
answerBtn2Element.addEventListener('click', () => {
    answerBtnEvent()
});
answerBtn3Element.addEventListener('click', () => {
    answerBtnEvent()
});
answerBtn4Element.addEventListener('click', () => {
    answerBtnEvent()
});


const startBtn = document.getElementById('startBtn');
const startBtnElement = document.createElement('input');
const homeBtn = document.getElementById('homeBtn');
const homeBtnElement = document.createElement('input');
startBtnElement.setAttribute('type', 'submit');
startBtnElement.value = '開始';
startBtn.appendChild(startBtnElement);
startBtnElement.addEventListener('click', () => {
    startBtn.removeChild(startBtnElement);
    request.onreadystatechange = () => {
        // 通信の完了時
        if (request.readyState === REQUEST_STATUS.FINISHED) {
            // 通信の成功時
            if (request.status === REQUEST_STATUS.OK) {
                results = JSON.parse(request.responseText).results;
                setQuestion(titleElement, results, answerCount);
                btnContainer.setAttribute('style', 'display:block');
            }
        } else {
            // 通信の未完了時
            titleElement.textContent = '取得中';
            textElement.value = '少々お待ちください';
        }
    }
    request.open('GET', 'https://opentdb.com/api.php?amount=10&type=multiple', true);
    request.send(null);
});

/**
 * shuffle
 * @param arr
 * @returns {*}
 */
const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};


/**
 * answerBtnEvent
 * 回答時のイベント
 */
const answerBtnEvent = () => {
    answerCount++;
    if (answerCount < 10) {
        setQuestion(titleElement, results, answerCount);
    } else {
        homeBtn.setAttribute('style', 'display:block');
        btnContainer.setAttribute('style', 'display:none');
        titleElement.textContent = 'あなたの正答数は' + correctAnswerCount + 'です!!';
        titleDiv.appendChild(titleElement);
        textElement.value = '再度チャレンジしたい場合以下のボタンをクリック';
        textDiv.appendChild(textElement);
        homeBtnElement.value = 'ホームに戻る';
        homeBtnElement.setAttribute('type', 'submit');
        homeBtn.appendChild(homeBtnElement);
        homeBtnElement.addEventListener('click', () => {
            reset();
        });
        categoryDiv.removeChild(categoryElement);
        difficultyDiv.removeChild(difficultyElement);
    }
}

/**
 * setQuestion
 * 問題を表示
 * @param titleElement
 * @param question
 * @param number
 */
const setQuestion = (titleElement, question, number) => {
    titleElement.textContent = '問題' + (number + 1);
    textElement.value = unescapeHTML(question[number]['question']);
    categoryElement.textContent = '[ジャンル]' + question[number]['category'];
    categoryDiv.appendChild(categoryElement);
    difficultyElement.textContent = '[難易度]' + question[number]['difficulty'];
    difficultyDiv.appendChild(difficultyElement);

    answerBtn1Element.value = unescapeHTML(question[number]['correct_answer']);
    answerBtn2Element.value = unescapeHTML(question[number]['incorrect_answers'][0]);
    answerBtn3Element.value = unescapeHTML(question[number]['incorrect_answers'][1]);
    answerBtn4Element.value = unescapeHTML(question[number]['incorrect_answers'][2]);

    let shuffledArray = shuffle(answerBtnElements);
    answerBtn1Div.appendChild(shuffledArray[0]);
    answerBtn2Div.appendChild(shuffledArray[1]);
    answerBtn3Div.appendChild(shuffledArray[2]);
    answerBtn4Div.appendChild(shuffledArray[3]);
}
answerBtn1Element.addEventListener('click', () => {
    correctAnswerCount++;
});

/**
 * reset
 * 表示内容を初期化
 */
const reset = () => {
    answerCount = 0;
    titleElement.textContent = 'ようこそ';
    titleDiv.appendChild(titleElement);
    textElement.value = '以下のボタンをクリック';
    textDiv.appendChild(textElement);
    startBtnElement.setAttribute('type', 'submit');
    startBtnElement.value = '開始';
    startBtn.appendChild(startBtnElement);
    homeBtn.setAttribute('style', 'display:none');
}

/**
 * unescapeHTML
 * 特殊文字の変換
 * @param str
 * @returns {string}
 */
const unescapeHTML = (str) => {
    return str.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}
reset();
