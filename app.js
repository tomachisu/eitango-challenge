const words = [
  ["apple", "りんご", "アップル"], ["book", "本", "ブック"], ["cake", "ケーキ", "ケーキ"], ["city", "市", "シティ"], ["dog", "犬", "ドッグ"],
  ["egg", "たまご", "エッグ"], ["fish", "魚", "フィッシュ"], ["guitar", "ギター", "ギター"], ["hat", "帽子", "ハット"], ["juice", "ジュース", "ジュース"],
  ["king", "王", "キング"], ["lemon", "レモン", "レモン"], ["melon", "メロン", "メロン"], ["notebook", "ノート", "ノートブック"], ["piano", "ピアノ", "ピアノ"],
  ["question", "質問", "クエスチョン"], ["rabbit", "うさぎ", "ラビット"], ["sun", "太陽", "サン"], ["tennis", "テニス", "テニス"], ["umbrella", "かさ", "アンブレラ"],
  ["zoo", "動物園", "ズー"], ["watch", "時計", "ウォッチ"], ["box", "箱", "ボックス"], ["gym", "体育館", "ジム"], ["eraser", "消しゴム", "イレイサー"],
  ["bed", "ベッド", "ベッド"], ["cap", "（縁なしの）帽子", "キャップ"], ["cat", "ねこ", "キャット"], ["cup", "カップ", "カップ"], ["leg", "脚", "レッグ"],
  ["map", "地図", "マップ"], ["pen", "ペン", "ペン"], ["pet", "ペット（の）", "ペット"], ["get", "得る、〜になる", "ゲット"], ["put", "（…に）〜を置く", "プット"],
  ["sit", "すわる", "シット"], ["big", "大きい", "ビッグ"], ["hot", "暑い、熱い", "ホット"], ["red", "赤（い）", "レッド"], ["not", "〜でない", "ノット"],
  ["number", "数字", "ナンバー"], ["one", "1", "ワン"], ["two", "2", "ツー"], ["three", "3", "スリー"], ["four", "4", "フォー"],
  ["five", "5", "ファイブ"], ["six", "6", "シックス"], ["seven", "7", "セブン"], ["eight", "8", "エイト"], ["nine", "9", "ナイン"],
  ["ten", "10", "テン"], ["eleven", "11", "イレブン"], ["twelve", "12", "トゥエルブ"], ["thirteen", "13", "サーティーン"], ["fourteen", "14", "フォーティーン"],
  ["fifteen", "15", "フィフティーン"], ["twenty", "20", "トゥエンティ"], ["hundred", "100", "ハンドレッド"], ["thousand", "1,000", "サウザンド"], ["month", "（年月の）月", "マンス"],
  ["January", "1月", "ジャニュアリー"], ["February", "2月", "フェブラリー"], ["March", "3月", "マーチ"], ["April", "4月", "エイプリル"], ["May", "5月", "メイ"],
  ["June", "6月", "ジューン"], ["July", "7月", "ジュライ"], ["August", "8月", "オーガスト"], ["September", "9月", "セプテンバー"], ["October", "10月", "オクトーバー"],
  ["November", "11月", "ノベンバー"], ["December", "12月", "ディッセンバー"], ["season", "季節", "シーズン"], ["spring", "春", "スプリング"], ["summer", "夏", "サマー"],
  ["autumn (fall)", "秋", "オータム（フォール）", ["autumn", "fall"]], ["winter", "冬", "ウィンター"], ["date", "日付（日にち）", "デイト"], ["first", "1日", "ファースト"], ["second", "2日", "セカンド"],
  ["third", "3日", "サード"], ["fourth", "4日", "フォース"], ["fifth", "5日", "フィフス"], ["sixth", "6日", "シックスス"], ["seventh", "7日", "セブンス"],
  ["eighth", "8日", "エイス"], ["ninth", "9日", "ナインス"], ["tenth", "10日", "テンス"], ["eleventh", "11日", "イレブンス"], ["twelfth", "12日", "トゥエルフス"],
  ["thirteenth", "13日", "サーティーンス"], ["fourteenth", "14日", "フォーティーンス"], ["fifteenth", "15日", "フィフティーンス"], ["sixteenth", "16日", "シックスティーンス"], ["seventeenth", "17日", "セブンティーンス"],
  ["eighteenth", "18日", "エイティーンス"], ["nineteenth", "19日", "ナインティーンス"], ["twentieth", "20日", "トゥエンティース"], ["twenty-first", "21日", "トゥエンティファースト"], ["twenty-second", "22日", "トゥエンティセカンド"],
  ["twenty-third", "23日", "トゥエンティサード"], ["twenty-fourth", "24日", "トゥエンティフォース"], ["twenty-fifth", "25日", "トゥエンティフィフス"], ["twenty-sixth", "26日", "トゥエンティシックス"], ["twenty-seventh", "27日", "トゥエンティセブンス"],
  ["twenty-eighth", "28日", "トゥエンティエイス"], ["twenty-ninth", "29日", "トゥエンティナインス"], ["thirtieth", "30日", "サーティース"], ["thirty-first", "31日", "サーティーファースト"], ["Sunday", "日曜日", "サンデイ"],
  ["Monday", "月曜日", "マンデイ"], ["Tuesday", "火曜日", "チューズデイ"], ["Wednesday", "水曜日", "ウェンズデイ"], ["Thursday", "木曜日", "サーズデイ"], ["Friday", "金曜日", "フライデイ"],
  ["Saturday", "土曜日", "サタデイ"], ["day", "日、1日（曜日）", "デイ"], ["today", "今日", "トゥデイ"], ["tomorrow", "明日", "トゥモロー"], ["yesterday", "昨日", "イエスタデイ"],
  ["next", "次", "ネクスト"], ["birthday", "誕生日", "バースデイ"], ["animal", "動物", "アニマル"], ["Japanese", "国語", "ジャパニーズ"], ["math", "数学", "マス"],
  ["science", "理科", "サイエンス"], ["English", "英語", "イングリッシュ"], ["social studies", "社会", "ソーシャルスタディーズ"], ["P.E.", "体育", "ピーイー", ["p.e.", "pe", "p e"]], ["music", "音楽", "ミュージック"],
  ["art", "美術", "アート"], ["family", "家族", "ファミリー"], ["father", "父", "ファーザー"], ["mother", "母", "マザー"], ["grandpa (grandfather)", "祖父", "グランパ（グランドファーザー）", ["grandpa", "grandfather"]],
  ["grandma (grandmother)", "祖母", "グランマ（グランドマザー）", ["grandma", "grandmother"]], ["brother", "兄弟", "ブラザー"], ["sister", "姉妹", "シスター"], ["friend", "友達", "フレンド"], ["child", "子ども", "チャイルド"],
  ["sport", "スポーツ", "スポーツ"], ["baseball", "野球", "ベースボール"], ["basketball", "バスケットボール", "バスケットボール"], ["soccer", "サッカー", "サッカー"], ["volleyball", "バレーボール", "バレーボール"],
  ["food", "食べ物", "フード"], ["rice", "米", "ライス"], ["curry and rice", "カレーライス", "カリーアンドライス"], ["pizza", "ピザ", "ピザ"], ["spaghetti", "スパゲッティ", "スパゲティ"],
  ["ice cream", "アイスクリーム", "アイスクリーム"], ["country", "国", "カントリー"], ["U.S. (U.S.A)", "アメリカ合衆国", "ユーエス", ["u.s.", "u.s.a.", "us", "usa"]], ["Italy", "イタリア", "イタリー"], ["Australia", "オーストラリア", "オーストラリア"],
  ["China", "中国", "チャイナ"], ["Singapore", "シンガポール", "シンガポール"]
].map(([english, japanese, reading, answers]) => ({ english, japanese, reading, answers }));

const storageKey = "eitango-challenge-v1";
const $ = (id) => document.getElementById(id);
const screens = [$("welcome-screen"), $("quiz-screen"), $("result-screen")];
let session = [];
let position = 0;
let sessionCorrect = 0;
let missed = [];
let checked = false;
let state = loadState();

function today() { return new Date().toISOString().slice(0, 10); }
function newState() { return { cards: {}, daily: { date: today(), correct: 0, answers: 0, streak: 0, bestStreak: 0 } }; }
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    const base = saved && saved.cards ? saved : newState();
    if (base.daily.date !== today()) base.daily = { date: today(), correct: 0, answers: 0, streak: 0, bestStreak: base.daily.bestStreak || 0 };
    return base;
  } catch { return newState(); }
}
function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); updateDashboard(); }
function card(word) { return state.cards[word.english] || { streak: 0, correct: 0, wrong: 0, nextDue: 0 }; }
function daysFromNow(days) { const date = new Date(); date.setDate(date.getDate() + days); return date.getTime(); }
function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function showScreen(screen) { screens.forEach((item) => item.classList.toggle("hidden", item !== screen)); }

function updateDashboard() {
  const mastered = words.filter((word) => card(word).streak >= 3).length;
  $("mastered-count").textContent = `${mastered} / ${words.length}`;
  $("today-correct").textContent = state.daily.correct;
  $("streak-count").textContent = state.daily.streak;
}

function startSession(count) {
  const now = Date.now();
  const due = words.filter((word) => card(word).nextDue <= now);
  const later = words.filter((word) => card(word).nextDue > now);
  session = shuffle(due).concat(shuffle(later)).slice(0, count);
  position = 0;
  sessionCorrect = 0;
  missed = [];
  showScreen($("quiz-screen"));
  renderQuestion();
}

function currentWord() { return session[position]; }
function renderQuestion() {
  const word = currentWord();
  checked = false;
  $("question-number").textContent = `${position + 1} / ${session.length}`;
  $("progress-bar").style.width = `${(position / session.length) * 100}%`;
  $("meaning").textContent = word.japanese;
  $("answer-input").value = "";
  $("answer-input").disabled = false;
  $("answer-input").className = "";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("hint-text").textContent = "";
  $("check-button").classList.remove("hidden");
  $("next-button").classList.add("hidden");
  setTimeout(() => $("answer-input").focus(), 50);
}

function normalize(value) { return value.trim().toLowerCase().replace(/\s+/g, " "); }
function checkAnswer() {
  if (checked) return;
  const word = currentWord();
  const answer = normalize($("answer-input").value);
  if (!answer) { $("feedback").textContent = "英単語を入力してみよう。"; $("feedback").className = "feedback incorrect"; return; }
  checked = true;
  const correct = (word.answers || [word.english]).some((candidate) => answer === normalize(candidate));
  const record = card(word);
  state.daily.answers += 1;
  if (correct) {
    record.streak += 1;
    record.correct += 1;
    record.nextDue = daysFromNow([1, 3, 7, 14][Math.min(record.streak - 1, 3)]);
    state.daily.correct += 1;
    state.daily.streak += 1;
    state.daily.bestStreak = Math.max(state.daily.bestStreak, state.daily.streak);
    sessionCorrect += 1;
    $("feedback").textContent = `正解！ ${word.english}（${word.reading}）`;
    $("feedback").className = "feedback correct";
    $("answer-input").classList.add("correct");
    speak(word.english);
  } else {
    record.streak = 0;
    record.wrong += 1;
    record.nextDue = Date.now();
    state.daily.streak = 0;
    missed.push(word);
    $("feedback").textContent = `おしい！ 正解は ${word.english}`;
    $("feedback").className = "feedback incorrect";
    $("answer-input").classList.add("incorrect");
  }
  state.cards[word.english] = record;
  saveState();
  $("answer-input").disabled = true;
  $("check-button").classList.add("hidden");
  $("next-button").textContent = position === session.length - 1 ? "結果を見る" : "次の問題へ";
  $("next-button").classList.remove("hidden");
}

function nextQuestion() {
  position += 1;
  if (position >= session.length) return showResults();
  renderQuestion();
}

function showResults() {
  $("progress-bar").style.width = "100%";
  const allCorrect = sessionCorrect === session.length;
  $("result-mark").textContent = allCorrect ? "★" : "✦";
  $("result-title").textContent = allCorrect ? "ぜんぶ正解！すごい！" : "よくがんばったね！";
  $("score-value").textContent = sessionCorrect;
  $("result-message").textContent = allCorrect ? "次は復習の日に、もう一度出てくるよ。" : "まちがえた単語は、次のチャレンジでもう一度出てくるよ。";
  const uniqueMissed = [...new Map(missed.map((word) => [word.english, word])).values()];
  $("review-box").classList.toggle("hidden", uniqueMissed.length === 0);
  $("review-words").textContent = uniqueMissed.map((word) => `${word.japanese}：${word.english}`).join("　");
  showScreen($("result-screen"));
}

function speak(text) {  if (!window.speechSynthesis) return;  window.speechSynthesis.cancel();  const utterance = new SpeechSynthesisUtterance(text);  utterance.lang = "en-US";  const usEnglishVoices = window.speechSynthesis.getVoices()    .filter((voice) => voice.lang.replace("_", "-").toLowerCase().startsWith("en-us"));  const preferredFemaleVoice = usEnglishVoices.find((voice) =>    /samantha|ava|allison|aria|jenny|zira|sara|sonia|google us english/i.test(voice.name)  );  utterance.voice = preferredFemaleVoice || usEnglishVoices[0] || null;  utterance.rate = .82;  window.speechSynthesis.speak(utterance);}

function showHint() {
  const word = currentWord().english;
  $("hint-text").textContent = `${word[0].toUpperCase()} から始まる、${word.length}文字`;
}

function populateWordList() {
  $("word-list").innerHTML = words.map((word) => `<li><span><b>${word.english}</b><small>${word.japanese}（${word.reading}）</small></span><button class="mini-listen" type="button" data-word="${word.english}" aria-label="${word.english}の発音を聞く">🔊</button></li>`).join("");
}

document.querySelectorAll("[data-questions]").forEach((button) => button.addEventListener("click", () => startSession(Number(button.dataset.questions))));
$("check-button").addEventListener("click", checkAnswer);
$("next-button").addEventListener("click", nextQuestion);
$("hint-button").addEventListener("click", showHint);
$("listen-button").addEventListener("click", () => speak(currentWord().english));
$("answer-input").addEventListener("keydown", (event) => { if (event.key === "Enter") checked ? nextQuestion() : checkAnswer(); });
$("restart-button").addEventListener("click", () => startSession(session.length || 5));
$("home-button").addEventListener("click", () => showScreen($("welcome-screen")));
$("word-list-button").addEventListener("click", () => $("word-dialog").showModal());
$("close-dialog").addEventListener("click", () => $("word-dialog").close());
$("word-list").addEventListener("click", (event) => { if (event.target.dataset.word) speak(event.target.dataset.word); });

populateWordList();
updateDashboard();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
