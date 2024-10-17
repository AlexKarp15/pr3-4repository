// Масив з логами для бою
const logs = [
    '[ПЕРСОНАЖ №1] згадав щось важливе, але раптово [ПЕРСОНАЖ №2], не пам\'ятаючи себе від страху, вдарив у передпліччя ворога.',
    '[ПЕРСОНАЖ №1] поперхнувся, і за це [ПЕРСОНАЖ №2] з переляку вдарив коліном у лоб ворога.',
    '[ПЕРСОНАЖ №1] задумався, але в цей час нахабний [ПЕРСОНАЖ №2], прийнявши вольове рішення, безшумно підійшов ззаду і вдарив.',
    '[ПЕРСОНАЖ №1] прийшов до тями, але раптово [ПЕРСОНАЖ №2] випадково завдав потужного удару.',
    '[ПЕРСОНАЖ №1] поперхнувся, але в цей час [ПЕРСОНАЖ №2] неохоче роздробив кулаком ворога.',
    '[ПЕРСОНАЖ №1] здивувався, а [ПЕРСОНАЖ №2] похитнувся і завдав підступного удару.',
    '[ПЕРСОНАЖ №1] висморкався, але раптово [ПЕРСОНАЖ №2] завдав дроблячого удару.',
    '[ПЕРСОНАЖ №1] похитнувся, і раптом нахабний [ПЕРСОНАЖ №2] без причини вдарив у ногу противника.',
    '[ПЕРСОНАЖ №1] засмутився, як раптом, несподівано [ПЕРСОНАЖ №2] випадково завдав удару в живіт суперника.',
    '[ПЕРСОНАЖ №1] намагався щось сказати, але раптом [ПЕРСОНАЖ №2] від нудьги розбив брову супротивнику.'
];

// Функція для генерації випадкового лог-повідомлення
function generateLog(attackerName, defenderName, damage, remainingHealth) {
    const logIndex = Math.floor(Math.random() * logs.length);
    const log = logs[logIndex]
        .replace('[ПЕРСОНАЖ №1]', attackerName)
        .replace('[ПЕРСОНАЖ №2]', defenderName);
    return `${log} Нанесено ${damage} шкоди. Залишилося ${remainingHealth} здоров'я.`;
}

// Функція для додавання логів у div з id="logs"
function addLog(message) {
    const logContainer = document.getElementById('logs');
    const newLog = document.createElement('div');
    newLog.textContent = message;
    logContainer.prepend(newLog); // Додаємо новий лог зверху
}

// Об'єкт персонажа
let character = {
    name: "Pikachu",
    health: 100,
    maxHealth: 100,
    elementName: "character",
    attackPower: 40,

    updateHealth() {
        const healthDisplay = document.getElementById(`health-${this.elementName}`);
        const progressBar = document.getElementById(`progressbar-${this.elementName}`);
        healthDisplay.textContent = `${this.health} / ${this.maxHealth}`;
        progressBar.style.width = `${(this.health / this.maxHealth) * 100}%`;
    },

    attack(target) {
        const damage = Math.floor(Math.random() * this.attackPower) + 1;
        target.health -= damage;
        if (target.health < 0) target.health = 0;
        target.updateHealth();

        // Генеруємо лог бою
        const logMessage = generateLog(this.name, target.current.name, damage, target.health);
        addLog(logMessage);

        if (target.health === 0) {
            alert(`Ви перемогли ${target.current.name}!`);
            loadNextEnemy();
        } else {
            target.attack(this); // Ворога атакує персонаж
        }
    }
};

// Об'єкт ворога
let enemy = {
    enemiesList: [
        { name: 'Charmander', maxHealth: 100, attackPower: 15, sprite: '/assets/Charmander.png' },
        { name: 'Bulbasaur', maxHealth: 120, attackPower: 20, sprite: '/assets/Bulbasaur.png' },
        { name: 'Squirtle', maxHealth: 140, attackPower: 25, sprite: '/assets/Squirtle.png' }
    ],
    currentEnemyIndex: 0,

    get current() {
        return this.enemiesList[this.currentEnemyIndex];
    },

    health: 100,

    updateHealth() {
        const healthDisplay = document.getElementById(`health-enemy`);
        const progressBar = document.getElementById(`progressbar-enemy`);
        const { maxHealth } = this.current; // Деструктуризація
        healthDisplay.textContent = `${this.health} / ${maxHealth}`;
        progressBar.style.width = `${(this.health / maxHealth) * 100}%`;
    },

    attack(target) {
        const { attackPower, name: enemyName } = this.current; // Деструктуризація
        const damage = Math.floor(Math.random() * attackPower) + 1;
        target.health -= damage;
        if (target.health < 0) target.health = 0;
        target.updateHealth();

        // Генеруємо лог бою
        const logMessage = generateLog(enemyName, target.name, damage, target.health);
        addLog(logMessage);

        if (target.health === 0) {
            alert(`Вам не пощастило! Ви програли!`);
            resetGame();
        }
    }
};

// Оновлюємо зображення та інформацію про суперника
function updateEnemyDisplay() {
    const enemySprite = document.querySelector('.enemy .sprite');
    const enemyName = document.getElementById("name-enemy");

    const { sprite, name, maxHealth } = enemy.current; // Деструктуризація
    enemySprite.src = sprite;
    enemyName.textContent = name;

    enemy.health = maxHealth;
    enemy.updateHealth();
}

// Завантаження наступного суперника
function loadNextEnemy() {
    enemy.currentEnemyIndex++;

    if (enemy.currentEnemyIndex >= enemy.enemiesList.length) {
        alert("Ви перемогли всіх суперників! Гра завершена!");
        resetGame();
        return;
    }

    updateEnemyDisplay();
}

// Змінні для зберігання обробників подій
let thunderJoltHandler = null;
let quickAttackHandler = null;

// Функція для підрахунку кліків з обмеженням кількості
function createClickCounter(buttonName, maxClicks, clickCounter) {
    return function() {
        if (clickCounter.count < maxClicks) {
            clickCounter.count++;
            console.log(`Button ${buttonName} clicked ${clickCounter.count} times. Remaining: ${maxClicks - clickCounter.count}`);
            addLog(`Атака "${buttonName}" була виконана ${clickCounter.count} раз(и). Залишилося ${maxClicks - clickCounter.count}.`);
            
            // Виконуємо атаку, якщо ліміт не досягнутий
            character.attack(enemy); // Персонаж атакує ворога
        } else {
            console.log(`Button ${buttonName} has reached the maximum limit of ${maxClicks} clicks.`);
            addLog(`Атака "${buttonName}" досягла максимального ліміту ${maxClicks} натискань.`);
        }
    };
}

// Функція для додавання лічильника кліків до кнопки
function setupButtonClickHandlers(buttonId, buttonName, maxClicks, clickCounter) {
    const button = document.getElementById(buttonId);
    const clickHandler = createClickCounter(buttonName, maxClicks, clickCounter); // Створюємо замикання для підрахунку кліків

    button.addEventListener('click', clickHandler);

    // Зберігаємо обробник, щоб потім можна було його очистити
    if (buttonId === 'btn-kick') {
        thunderJoltHandler = clickHandler;
    } else if (buttonId === 'btn-attack-2') {
        quickAttackHandler = clickHandler;
    }
}

// Функція для очищення обробників подій
function clearButtonClickHandlers() {
    const btnKick = document.getElementById('btn-kick');
    const btnAttack2 = document.getElementById('btn-attack-2');

    if (thunderJoltHandler) {
        btnKick.removeEventListener('click', thunderJoltHandler);
    }

    if (quickAttackHandler) {
        btnAttack2.removeEventListener('click', quickAttackHandler);
    }

    // Скидаємо змінні обробників
    thunderJoltHandler = null;
    quickAttackHandler = null;
}

// Ініціалізація кнопок з лічильниками кліків
setupButtonClickHandlers('btn-kick', 'Thunder Jolt', 12, { count: 0 });
setupButtonClickHandlers('btn-attack-2', 'Quick Attack', 7, { count: 0 });

// Очищаємо всі логи
function clearLogs() {
    const logContainer = document.getElementById('logs');
    logContainer.innerHTML = ''; 
}

// Скидання гри
function resetGame() {
    enemy.currentEnemyIndex = 0;
    character.health = character.maxHealth;
    enemy.health = enemy.current.maxHealth;

    // Очищаємо попередні обробники подій
    clearButtonClickHandlers();

    // Оновлюємо лічильники кліків для обох атак
    setupButtonClickHandlers('btn-kick', 'Thunder Jolt', 12, { count: 0 });
    setupButtonClickHandlers('btn-attack-2', 'Quick Attack', 7, { count: 0 });

    // Оновлюємо здоров'я персонажів і ворогів
    character.updateHealth();
    updateEnemyDisplay();

    // Очищуємо логи
    clearLogs();
}

// Початкове завантаження стану гри
character.updateHealth();
updateEnemyDisplay();
