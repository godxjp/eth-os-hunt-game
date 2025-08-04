(() => {

    let isGameWon = false;
    let gameOverDisplayed = false;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createEthos() {
        return [...Array(5)].map(() => {
            return {
                x: random(0, window.innerWidth ),
                y: window.innerHeight,
                speedX: random(-25, 25),
                speedY: random(4, 8)
            };
        });
    }

    function setupEthosElement(ethos) {
        const ethosElem = document.createElement('div');
        ethosElem.className = 'ethos';
        ethosElem.style.left = `${ethos.x}px`;
        ethosElem.style.top = `${ethos.y}px`;
        ethosElem.style.backgroundImage = 'url(1-left.png)';
        document.body.appendChild(ethosElem);

        return { ethos, ethosElem }
    }
    
    function getEthosBackgroundImage(ethos, ethosElem) {
        const direction = ethos.speedX > 0 ?'right' : 'left';
        return ethosElem.style.backgroundImage.indexOf('1') !== -1 ? 
        `url(2-${direction}.png)` : 
        `url(1-${direction}.png)`;
    }

    function moveEthos(ethosElem, ethos) {
        const { left, top } = ethosElem.getBoundingClientRect();
        const outOfBoundX = ethos.x < 0 || ethos.x > window.innerWidth;
        const outOfBoundY = ethos.y < 0 || ethos.y > window.innerHeight;

        if (outOfBoundX) {
            ethos.speedX *= -1;
        }
        if (outOfBoundY) {
            ethos.speedY *= -1;
        }

        ethos.x = left + ethos.speedX;
        ethos.y = top - ethos.speedY;
        ethosElem.style.left = `${ethos.x}px`;
        ethosElem.style.top = `${ethos.y}px`;

        ethosElem.style.backgroundImage = getEthosBackgroundImage(ethos, ethosElem);
    }

    function shootEthos(event) {
        if (isGameWon || gameOverDisplayed) return;

        const ethosElem = event.target;
        ethosElem.style.transition = 'top 2s';
        ethosElem.style.top = `${window.innerHeight}px`
        const direction = window.getComputedStyle(ethosElem).backgroundImage.replace(/^url\(["']?([^"']+)["']?\)$/, '$1');
        if (direction.includes('right')) {
            ethosElem.style.backgroundImage = 'url(dead-right.png)';
        } else {
            ethosElem.style.backgroundImage = 'url(dead-left.png)';
        }

        clearInterval(ethosElem.interval);
        setTimeout(() => {
            document.body.removeChild(ethosElem);
            const ethos = document.querySelector('.ethos');

            if (!ethos) {
                const winning = document.createElement('h1');
                winning.className = 'winning';
                winning.innerText = 'You Win!';
                document.body.appendChild(winning);
                isGameWon = true;
            }
        }, 2000);
    }

    function start(ammoLeft) {
        const ethoses = createEthos();
        const ethosElems = ethoses.map(setupEthosElement);

        document.addEventListener('click', () => {
            if (ammoLeft > 0 && !isGameWon) {
                ammoLeft -= 1;
                document.querySelector('.ammo').innerText = 'Ammo Left: ' + ammoLeft;
            }
            if (ammoLeft <= 0 && !gameOverDisplayed && !isGameWon) {
                gameOverDisplayed = true;
                setTimeout(() => {
                    const ethos = document.querySelector('.ethos');
                    if (ethos) {
                        const gameOver = document.createElement('h1');
                        gameOver.className = 'winning';
                        gameOver.innerText = 'Game Over';
                        document.body.appendChild(gameOver);
                    }
                }, 2001)
            }
        });

        ethosElems.forEach(({ ethos, ethosElem }) => {
            ethosElem.interval = setInterval(() => moveEthos(ethosElem, ethos), 100);
            ethosElem.addEventListener('click', shootEthos); 
        });
    }

    function run() {
        const mode = {'easy': 21, 'normal': 11, 'hard': 6};
        let ammoLeft;

        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.addEventListener('click',() => {
                ammoLeft = mode[button.id];
                const ammoDisplay = document.createElement('div');
                ammoDisplay.className = 'ammo';
                ammoDisplay.innerHTML = 'Ammo Left : ' + ammoLeft;
                document.body.appendChild(ammoDisplay);

                buttons.forEach((btn) => btn.remove());
                start(ammoLeft);
            })
        });
    }

    run();

})();
