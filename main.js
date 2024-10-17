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
    logContainer.prepend(newLog);
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

        const logMessage = generateLog(this.name, target.current.name, damage, target.health);
        addLog(logMessage);

        if (target.health === 0) {
            alert(`Ви перемогли ${target.current.name}!`);
            loadNextEnemy();
        } else {
            target.attack(this);
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
        const { maxHealth } = this.current;
        healthDisplay.textContent = `${this.health} / ${maxHealth}`;
        progressBar.style.width = `${(this.health / maxHealth) * 100}%`;
    },

    attack(target) {
        const { attackPower, name: enemyName } = this.current; 
        const damage = Math.floor(Math.random() * attackPower) + 1;
        target.health -= damage;
        if (target.health < 0) target.health = 0;
        target.updateHealth();

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

    const { sprite, name, maxHealth } = enemy.current;
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

// Функція для підрахунку кліків з обмеженням кількості
function createClickCounter(buttonName, maxClicks) {
    let clicks = 0;

    return function() {
        if (clicks < maxClicks) {
            clicks++;
            console.log(`Button ${buttonName} clicked ${clicks} times. Remaining: ${maxClicks - clicks}`);
            addLog(`Атака "${buttonName}" була виконана ${clicks} раз(и). Залишилося ${maxClicks - clicks}.`);
            if (clicks <= maxClicks) {
                character.attack(enemy);
            }
        } else {
            console.log(`Button ${buttonName} has reached the maximum limit of ${maxClicks} clicks.`);
            addLog(`Атака "${buttonName}" досягла максимального ліміту ${maxClicks} натискань.`); 
        }
    };
}

// Функція для додавання лічильника кліків до кнопки
function setupButtonClickHandlers(buttonId, buttonName, maxClicks) {
    const button = document.getElementById(buttonId);
    const clickHandler = createClickCounter(buttonName, maxClicks);

    button.addEventListener('click', clickHandler);
}

// Ініціалізація кнопок з лічильниками кліків
setupButtonClickHandlers('btn-kick', 'Thunder Jolt', 12);  
setupButtonClickHandlers('btn-attack-2', 'Quick Attack', 7); 

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
    character.updateHealth();
    updateEnemyDisplay();
    clearLogs();
}

// Початкове завантаження стану гри
character.updateHealth();
updateEnemyDisplay();