// Danielius Sescila – 11 laboratorinis

document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('#contact form.php-email-form');
  if (!contactForm) return;

  // build form
  contactForm.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="firstName">Vardas</label>
          <input type="text" id="firstName" name="first_name" required>
          <small class="error-message"></small>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="lastName">Pavardė</label>
          <input type="text" id="lastName" name="last_name" required>
          <small class="error-message"></small>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="email">El. paštas</label>
          <input type="email" id="email" name="email" required>
          <small class="error-message"></small>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="phone">Telefono numeris</label>
          <input type="tel" id="phone" name="phone" required>
          <small class="error-message"></small>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="address">Adresas</label>
      <input type="text" id="address" name="address" required>
      <small class="error-message"></small>
    </div>

    <div class="form-group">
      <label for="rating1">Klausimas 1 (įvertinkite 1–10)</label>
      <input type="number" id="rating1" name="rating1" min="1" max="10" required>
      <small class="error-message"></small>
    </div>

    <div class="form-group">
      <label for="rating2">Klausimas 2 (įvertinkite 1–10)</label>
      <input type="number" id="rating2" name="rating2" min="1" max="10" required>
      <small class="error-message"></small>
    </div>

    <div class="form-group">
      <label for="rating3">Klausimas 3 (įvertinkite 1–10)</label>
      <input type="number" id="rating3" name="rating3" min="1" max="10" required>
      <small class="error-message"></small>
    </div>

    <div class="my-3">
      <div class="loading">Loading</div>
      <div class="error-message"></div>
      <div class="sent-message">Your message has been sent. Thank you!</div>
    </div>

    <button type="submit" class="submit-btn" disabled>
      <span>Submit</span>
      <i class="bi bi-arrow-right"></i>
    </button>
  `;

  // elements
  const firstNameInput = contactForm.querySelector('#firstName');
  const lastNameInput = contactForm.querySelector('#lastName');
  const emailInput = contactForm.querySelector('#email');
  const phoneInput = contactForm.querySelector('#phone');
  const addressInput = contactForm.querySelector('#address');
  const rating1Input = contactForm.querySelector('#rating1');
  const rating2Input = contactForm.querySelector('#rating2');
  const rating3Input = contactForm.querySelector('#rating3');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  // result box
  const resultBox = document.createElement('div');
  resultBox.className = 'form-result mt-4';
  resultBox.style.backgroundColor = '#f5f5f5';
  resultBox.style.padding = '16px';
  resultBox.style.borderRadius = '8px';
  resultBox.style.fontSize = '0.95rem';
  resultBox.style.display = 'none';
  contactForm.parentElement.appendChild(resultBox);

  // popup
  const popupOverlay = document.createElement('div');
  popupOverlay.style.position = 'fixed';
  popupOverlay.style.inset = '0';
  popupOverlay.style.display = 'none';
  popupOverlay.style.alignItems = 'center';
  popupOverlay.style.justifyContent = 'center';
  popupOverlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
  popupOverlay.style.zIndex = '9999';

  const popupBox = document.createElement('div');
  popupBox.style.backgroundColor = '#ffffff';
  popupBox.style.padding = '20px 28px';
  popupBox.style.borderRadius = '12px';
  popupBox.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
  popupBox.style.maxWidth = '320px';
  popupBox.style.textAlign = 'center';
  popupBox.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const popupTitle = document.createElement('h4');
  popupTitle.textContent = 'Duomenys pateikti sėkmingai!';
  popupTitle.style.margin = '0 0 8px 0';

  const popupText = document.createElement('p');
  popupText.textContent = 'Jūsų kontaktų formos duomenys sėkmingai išsaugoti.';
  popupText.style.margin = '0 0 16px 0';
  popupText.style.fontSize = '0.95rem';

  const popupBtn = document.createElement('button');
  popupBtn.textContent = 'Uždaryti';
  popupBtn.style.border = 'none';
  popupBtn.style.padding = '8px 16px';
  popupBtn.style.borderRadius = '999px';
  popupBtn.style.cursor = 'pointer';
  popupBtn.style.backgroundColor = '#0d6efd';
  popupBtn.style.color = '#ffffff';
  popupBtn.style.fontSize = '0.9rem';

  popupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  popupBox.appendChild(popupTitle);
  popupBox.appendChild(popupText);
  popupBox.appendChild(popupBtn);
  popupOverlay.appendChild(popupBox);
  document.body.appendChild(popupOverlay);

  function showSuccessPopup() {
    popupOverlay.style.display = 'flex';
  }

  // validation helpers
  function setFieldError(input, message) {
    const group = input.closest('.form-group');
    const errorEl = group ? group.querySelector('.error-message') : null;
    if (!errorEl) return;
    if (message) {
      input.classList.add('field-error');
      input.style.borderColor = '#dc3545';
      errorEl.textContent = message;
      errorEl.style.color = '#dc3545';
    } else {
      input.classList.remove('field-error');
      input.style.borderColor = '';
      errorEl.textContent = '';
    }
  }

  function validateName(input) {
    const value = input.value.trim();
    if (!value) {
      setFieldError(input, 'Laukas negali būti tuščias');
      return false;
    }
    const re = /^[A-Za-zÀ-ž\s'-]+$/u;
    if (!re.test(value)) {
      setFieldError(input, 'Naudokite tik raides');
      return false;
    }
    setFieldError(input, '');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setFieldError(emailInput, 'El. paštas privalomas');
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) {
      setFieldError(emailInput, 'Neteisingas el. pašto formatas');
      return false;
    }
    setFieldError(emailInput, '');
    return true;
  }

  function validateAddress() {
    const value = addressInput.value.trim();
    if (!value) {
      setFieldError(addressInput, 'Adresas privalomas');
      return false;
    }
    setFieldError(addressInput, '');
    return true;
  }

  function validateRating(input) {
    const value = input.value.trim();
    if (!value) {
      setFieldError(input, 'Įvertinimas privalomas');
      return false;
    }
    let n = parseFloat(value);
    if (Number.isNaN(n)) {
      setFieldError(input, 'Įveskite skaičių');
      return false;
    }
    if (n < 1 || n > 10) {
      setFieldError(input, 'Skaičius turi būti 1–10');
      return false;
    }
    setFieldError(input, '');
    return true;
  }

  // phone helpers
  function internalPhoneDigits() {
    let digits = phoneInput.value.replace(/\D/g, '');
    if (digits.startsWith('370')) digits = digits.slice(3);
    if (digits.startsWith('0')) digits = digits.slice(1);
    return digits;
  }

  function formatPhone() {
    let digits = phoneInput.value.replace(/\D/g, '');
    if (digits.startsWith('370')) digits = digits.slice(3);
    if (digits.startsWith('0')) digits = digits.slice(1);

    if (digits.length > 0 && digits[0] !== '6') {
      digits = '6' + digits.slice(1);
    }

    digits = digits.slice(0, 8); // 6 + 7 digits

    let formatted = '+370';
    if (digits.length > 0) {
      const firstBlock = digits.slice(0, 3); // 6xx
      const secondBlock = digits.slice(3);   // xxxxx
      formatted += ' ' + firstBlock;
      if (secondBlock.length > 0) {
        formatted += ' ' + secondBlock;
      }
    }

    phoneInput.value = formatted.trim();
    return digits;
  }

  function validatePhone() {
    const digits = formatPhone();
    if (digits.length !== 8) {
      setFieldError(phoneInput, 'Numeris turi būti formatu +370 6xx xxxxx');
      return false;
    }
    setFieldError(phoneInput, '');
    return true;
  }

  function recalcSubmitState() {
    const requiredEmpty =
      !firstNameInput.value.trim() ||
      !lastNameInput.value.trim() ||
      !emailInput.value.trim() ||
      !addressInput.value.trim() ||
      !rating1Input.value.trim() ||
      !rating2Input.value.trim() ||
      !rating3Input.value.trim();

    const phoneDigits = internalPhoneDigits();
    const hasErrors = !!contactForm.querySelector('.field-error');

    submitBtn.disabled = requiredEmpty || hasErrors || phoneDigits.length !== 8;
  }

  function validateAll() {
    const v1 = validateName(firstNameInput);
    const v2 = validateName(lastNameInput);
    const v3 = validateEmail();
    const v4 = validateAddress();
    const v5 = validateRating(rating1Input);
    const v6 = validateRating(rating2Input);
    const v7 = validateRating(rating3Input);
    const v8 = validatePhone();
    recalcSubmitState();
    return v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8;
  }

  // realtime validation
  firstNameInput.addEventListener('input', () => {
    validateName(firstNameInput);
    recalcSubmitState();
  });
  lastNameInput.addEventListener('input', () => {
    validateName(lastNameInput);
    recalcSubmitState();
  });
  emailInput.addEventListener('input', () => {
    validateEmail();
    recalcSubmitState();
  });
  addressInput.addEventListener('input', () => {
    validateAddress();
    recalcSubmitState();
  });
  rating1Input.addEventListener('input', () => {
    validateRating(rating1Input);
    recalcSubmitState();
  });
  rating2Input.addEventListener('input', () => {
    validateRating(rating2Input);
    recalcSubmitState();
  });
  rating3Input.addEventListener('input', () => {
    validateRating(rating3Input);
    recalcSubmitState();
  });
  phoneInput.addEventListener('input', () => {
    validatePhone();
    recalcSubmitState();
  });

  // submit
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateAll()) return;

    const data = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      rating1: parseFloat(rating1Input.value),
      rating2: parseFloat(rating2Input.value),
      rating3: parseFloat(rating3Input.value)
    };

    console.log('Kontaktų formos duomenys:', data);

    const avg = (data.rating1 + data.rating2 + data.rating3) / 3;
    const avgRounded = Math.round(avg * 10) / 10;
    const fullName = `${data.firstName} ${data.lastName}`.trim();

    resultBox.innerHTML = `
      <p><strong>Vardas:</strong> ${data.firstName}</p>
      <p><strong>Pavardė:</strong> ${data.lastName}</p>
      <p><strong>El. paštas:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Tel. Numeris:</strong> ${data.phone}</p>
      <p><strong>Adresas:</strong> ${data.address}</p>
      <p><strong>Klausimas 1:</strong> ${data.rating1}</p>
      <p><strong>Klausimas 2:</strong> ${data.rating2}</p>
      <p><strong>Klausimas 3:</strong> ${data.rating3}</p>
      <hr>
      <p><strong>${fullName}:</strong> vidurkis ${avgRounded}</p>
    `;
    resultBox.style.display = 'block';

    showSuccessPopup();
  });
  
});

// --- Zaidimo logika ---

document.addEventListener("DOMContentLoaded", function () {
  // pagrindiniai DOM
  const boardEl = document.getElementById("gameBoard");
  const movesEl = document.getElementById("movesCount");
  const pairsEl = document.getElementById("pairsFound");
  const msgEl = document.getElementById("gameMessage");
  const timerEl = document.getElementById("gameTimer");
  const bestEasyEl = document.getElementById("bestEasy");
  const bestHardEl = document.getElementById("bestHard");

  const btnStart = document.getElementById("btnStart");
  const btnReset = document.getElementById("btnReset");
  const diffEasy = document.getElementById("difficultyEasy");
  const diffHard = document.getElementById("difficultyHard");

  // zaidimo konfiguracija
  const symbols = ["🍎","🍌","🍇","🍉","🍒","🍓","🥝","🍑","🍍","🥥","🥕","🍅"];

  // localStorage raktai
  const BEST_EASY_KEY = "memory_best_easy_moves";
  const BEST_HARD_KEY = "memory_best_hard_moves";

  let gameStarted = false;
  let moves = 0;
  let pairsFound = 0;
  let totalPairs = 0;
  let currentDifficulty = "easy";

  let firstCard = null;
  let secondCard = null;
  let boardLocked = false;

  // laikmatis
  let timerInterval = null;
  let elapsedSeconds = 0;

  // issaugoti rekordai
  let bestEasyMoves = null;
  let bestHardMoves = null;

  // ----- Laikmatis -----

  // atnaujina laikmacio tekst
  function updateTimerDisplay() {
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    const mm = m < 10 ? "0" + m : "" + m;
    const ss = s < 10 ? "0" + s : "" + s;
    if (timerEl) timerEl.textContent = mm + ":" + ss;
  }

  // paleidzia laikmati
  function startTimer() {
    stopTimer();
    elapsedSeconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      elapsedSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  // sustabdo laikmati
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ----- Rekordai (localStorage) -----

  // uzkrauna rekordus
  function loadBestResults() {
    const easy = localStorage.getItem(BEST_EASY_KEY);
    const hard = localStorage.getItem(BEST_HARD_KEY);
    bestEasyMoves = easy ? parseInt(easy, 10) : null;
    bestHardMoves = hard ? parseInt(hard, 10) : null;
    renderBestResults();
  }

  // atvaizduoja rekordus
  function renderBestResults() {
    bestEasyEl.textContent = bestEasyMoves != null ? bestEasyMoves : "-";
    bestHardEl.textContent = bestHardMoves != null ? bestHardMoves : "-";
  }

  // issaugo geresni rekorda
  function saveBestResult(difficulty, currentMoves) {
    if (difficulty === "easy") {
      if (bestEasyMoves == null || currentMoves < bestEasyMoves) {
        bestEasyMoves = currentMoves;
        localStorage.setItem(BEST_EASY_KEY, String(currentMoves));
      } else {
        return;
      }
    } else {
      if (bestHardMoves == null || currentMoves < bestHardMoves) {
        bestHardMoves = currentMoves;
        localStorage.setItem(BEST_HARD_KEY, String(currentMoves));
      } else {
        return;
      }
    }
    renderBestResults();
  }

  // ----- Pagalbiniai -----

  // grazina pasirinkta sudetinguma
  function getDifficulty() {
    return diffHard.checked ? "hard" : "easy";
  }

  // sukuria nauja kalade
  function createDeck(difficulty) {
    const pairCount = difficulty === "hard" ? 12 : 6;
    const base = symbols.slice(0, pairCount);
    const deck = [...base, ...base];
    shuffleArray(deck);
    return deck;
  }

  // sumaiso masyva
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // nupiesia lenta
  function renderBoard(deck, difficulty) {
    boardEl.innerHTML = "";

    if (difficulty === "hard") {
      boardEl.style.gridTemplateColumns = "repeat(6, minmax(0, 1fr))";
    } else {
      boardEl.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
    }

    deck.forEach(function (value) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "game-card";
      card.dataset.value = value;

      card.innerHTML = `
        <div class="game-card-inner">
          <div class="game-card-face game-card-front">?</div>
          <div class="game-card-face game-card-back">${value}</div>
        </div>
      `;

      card.addEventListener("click", onCardClick);
      boardEl.appendChild(card);
    });
  }

  // pradeda nauja zaidima
  function startGame() {
    currentDifficulty = getDifficulty();
    const deck = createDeck(currentDifficulty);

    totalPairs = currentDifficulty === "hard" ? 12 : 6;
    moves = 0;
    pairsFound = 0;
    firstCard = null;
    secondCard = null;
    boardLocked = false;
    gameStarted = true;

    boardEl.classList.remove("is-locked");
    msgEl.textContent = "";
    msgEl.classList.remove("game-message--win");

    stopTimer();
    startTimer();
    updateStats();
    renderBoard(deck, currentDifficulty);
  }

  // atnaujina statistika
  function updateStats() {
    movesEl.textContent = moves;
    pairsEl.textContent = pairsFound + " / " + totalPairs;
  }

  // korteles paspaudimas
  function onCardClick(e) {
    if (!gameStarted) return;
    if (boardLocked) return;

    const card = e.currentTarget;

    if (card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
      return;
    }

    flipCard(card);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    boardLocked = true;
    moves++;
    updateStats();

    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    if (isMatch) {
      handleMatch();
    } else {
      handleMismatch();
    }
  }

  // apvercia kortele
  function flipCard(card) {
    card.classList.add("is-flipped");
  }

  // kai pora sutampa
  function handleMatch() {
    firstCard.classList.add("is-matched");
    secondCard.classList.add("is-matched");

    resetSelection();

    pairsFound++;
    updateStats();
    checkWin();
  }

  // kai pora nesutampa
  function handleMismatch() {
    boardEl.classList.add("is-locked");

    setTimeout(function () {
      if (firstCard) firstCard.classList.remove("is-flipped");
      if (secondCard) secondCard.classList.remove("is-flipped");

      boardEl.classList.remove("is-locked");
      resetSelection();
    }, 900);
  }

  // isvalo laikina pasirinkima
  function resetSelection() {
    firstCard = null;
    secondCard = null;
    boardLocked = false;
  }

  // tikrina ar laimejo
  function checkWin() {
    if (pairsFound === totalPairs) {
      msgEl.textContent = "Sveikinimai! Laimejai zaidima.";
      msgEl.classList.add("game-message--win");
      boardEl.classList.add("is-locked");
      stopTimer();
      saveBestResult(currentDifficulty, moves);
    }
  }

  // mygtukas Start
  btnStart.addEventListener("click", function () {
    startGame();
  });

  // mygtukas Atnaujinti
  btnReset.addEventListener("click", function () {
    startGame();
    msgEl.textContent = "Zaidimas atnaujintas.";
    msgEl.classList.remove("game-message--win");
  });

  // sudetingumo keitimas
  diffEasy.addEventListener("change", function () {
    if (this.checked && gameStarted) {
      startGame();
    }
  });

  diffHard.addEventListener("change", function () {
    if (this.checked && gameStarted) {
      startGame();
    }
  });

  // inicialiai uzkraunam rekordus ir laikmati
  loadBestResults();
  elapsedSeconds = 0;
  updateTimerDisplay();
});