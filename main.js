// Configurações
const musicInfo = {
    name: "Quando Bate Aquela Saudade",
    artist: "Canção de Rubel ‧ 2013"
};

// Elementos
const elements = {
    dhlpBtn: document.getElementById('dhlpBtn'),
    videoContainer: document.getElementById('videoContainer'),
    closeBtn: document.getElementById('closeBtn'),
    myVideo: document.getElementById('myVideo'),
    bgMusic: document.getElementById('bgMusic'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    musicText: document.getElementById('musicText'),
    daysBadge: document.getElementById('daysBadge'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    videoLoading: document.getElementById('videoLoading'),
    readMoreBtn: document.getElementById('readMoreBtn'),
    additionalContent: document.getElementById('additionalContent'),
    startExperience: document.getElementById('startExperience')
};

// Atualiza display da música
function updateMusicDisplay() {
    elements.musicText.innerHTML = `
        <span class="song-name">${musicInfo.name}</span>
        <span class="artist-name">${musicInfo.artist}</span>
    `;
}

// Alterna entre play e pause
function togglePlayPause() {
    if (elements.bgMusic.paused) {
        elements.bgMusic.play()
            .then(() => {
                elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(e => {
                console.log("Erro ao reproduzir música:", e);
            });
    } else {
        elements.bgMusic.pause();
        elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Tenta reproduzir a música automaticamente (versão modificada)
function tryAutoPlay() {
    elements.bgMusic.volume = 0.8;

    // Primeiro tentamos com áudio mudo (geralmente permitido)
    elements.bgMusic.muted = true;

    const playPromise = elements.bgMusic.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Se funcionar, tentamos remover o mute
                setTimeout(() => {
                    elements.bgMusic.muted = false;
                    elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }, 1000);
            })
            .catch(error => {
                // Se falhar, mostramos o botão de play
                console.log("Autoplay bloqueado:", error);
                elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';

                // Preparamos para desbloquear com interação do usuário
                const unlockAudio = () => {
                    elements.bgMusic.play()
                        .then(() => {
                            elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                            document.body.removeEventListener('click', unlockAudio);
                        })
                        .catch(e => console.log("Erro ao reproduzir:", e));
                };

                document.body.addEventListener('click', unlockAudio);
            });
    }
}

// Alternar conteúdo adicional
function toggleAdditionalContent() {
    if (elements.additionalContent.style.display === 'block') {
        elements.additionalContent.style.display = 'none';
        elements.readMoreBtn.textContent = '❤ Ler mais ❤';
    } else {
        elements.additionalContent.style.display = 'block';
        elements.readMoreBtn.textContent = '❤ Ler menos ❤';
    }
}

// Inicialização
function init() {
    updateMusicDisplay();

    // Verifica se temos o overlay de início
    if (elements.startExperience) {
        // Se tiver o overlay, só tenta tocar depois que o usuário clicar
        elements.startExperience.addEventListener('click', () => {
            elements.startExperience.style.display = 'none';
            tryAutoPlay();
        });
    } else {
        // Se não tiver o overlay, tenta o autoplay diretamente
        tryAutoPlay();
    }

    // Configura o botão de play/pause
    elements.playPauseBtn.addEventListener('click', togglePlayPause);

    // Configura o botão ler mais
    elements.readMoreBtn.addEventListener('click', toggleAdditionalContent);

    // Contador de tempo
    const ultimaConversa = new Date('2025-08-09T16:07:00');
    setInterval(() => {
        const diff = new Date() - ultimaConversa;

        // Calcula os valores separadamente
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horasTotais = Math.floor(diff / (1000 * 60 * 60));
        const horasRestantes = horasTotais % 24;
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        const segundos = Math.floor((diff / 1000) % 60);

        // Atualiza o contador superior (relógio digital)
        elements.hours.textContent = horasTotais.toString().padStart(2, '0');
        elements.minutes.textContent = minutos.toString().padStart(2, '0');
        elements.seconds.textContent = segundos.toString().padStart(2, '0');

        // Atualiza o contador inferior (dias + horas)
        elements.daysBadge.textContent = `${dias} dias e ${horasRestantes}h`;
    }, 1000);

    // Eventos do vídeo
    elements.myVideo.addEventListener('waiting', () => {
        elements.videoLoading.style.display = 'flex';
        elements.videoContainer.style.cursor = 'wait';
    });

    elements.myVideo.addEventListener('playing', () => {
        elements.videoLoading.style.display = 'none';
        elements.videoContainer.style.cursor = 'default';
    });
}

// Event Listeners
elements.dhlpBtn.addEventListener('click', () => {
    elements.videoContainer.classList.add('active');
    elements.videoLoading.style.display = 'flex';
    elements.myVideo.play().catch(e => {
        console.log("Erro ao reproduzir vídeo:", e);
        elements.videoLoading.style.display = 'none';
    });
    elements.bgMusic.pause();
    elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

elements.closeBtn.addEventListener('click', () => {
    elements.videoContainer.classList.remove('active');
    elements.myVideo.pause();
    elements.myVideo.currentTime = 0;
    elements.videoLoading.style.display = 'none';
    elements.bgMusic.play()
        .then(() => {
            elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        })
        .catch(e => {
            console.log("Erro ao retomar música:", e);
            elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
});

// Inicia tudo
window.addEventListener('load', init);