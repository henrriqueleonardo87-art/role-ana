/**
 * Ana Gabriela & Leonardo // Nosso Primeiro Rolê ✨🛵
 * Software Engineer & Custom Personal Date Invitation
 */

// Application State
const gameState = {
  currentScreen: 0,
  preferences: {
    ride: '',
    cuisine: '',
    dateDay: '',
    drink: '',
    dessert: '',
    vibe: ''
  },
  dodgeCount: 0,
  hostPhone: '5531999768062' // Leonardo's phone number
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupAudioListeners();
  setupBiometricScanner();
  setupBriefingNext();
  setupQuizPhase1();
  setupQuizPhase2();
  setupQuizPhase3();
  setupRunawayDecision();
  setupTicketAndActions();
  updateProgressBar();
});

// Audio controls
function setupAudioListeners() {
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  const unlockAudio = () => {
    if (window.soundEngine) {
      window.soundEngine.init();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.soundEngine) {
        const isMuted = window.soundEngine.toggleMute();
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
        soundToggle.style.opacity = isMuted ? '0.5' : '1';
      }
    });
  }
}

// Navigate between screens
function goToScreen(index) {
  const current = document.getElementById(`screen${gameState.currentScreen}`);
  const next = document.getElementById(`screen${index}`);

  if (current) current.classList.remove('active');
  if (next) next.classList.add('active');

  gameState.currentScreen = index;
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.soundEngine) {
    window.soundEngine.playPop();
  }
}

function updateProgressBar() {
  const progressFill = document.getElementById('progressFill');
  const stepIndicator = document.getElementById('stepIndicator');
  const missionTag = document.getElementById('missionTag');

  const screenMap = [
    { fill: '12%', step: 'Identificação', tag: 'SECURITY // BIOMETRICS' },
    { fill: '25%', step: 'O Porquê', tag: 'STORY // BRIEFING' },
    { fill: '40%', step: 'Transporte', tag: 'LOGISTICS // PROTOCOL' },
    { fill: '55%', step: 'Cardápio', tag: 'GASTRONOMY // SELECT' },
    { fill: '70%', step: 'Detalhes', tag: 'TUNING // EXPERIENCE' },
    { fill: '85%', step: 'Compilando...', tag: 'SYSTEM // COMPILER' },
    { fill: '95%', step: 'Momento Decisivo', tag: 'DECISION // PROMPT' },
    { fill: '100%', step: 'Rolê Confirmado ✨', tag: 'BUILD // SUCCESS' }
  ];

  const info = screenMap[gameState.currentScreen] || { fill: '100%', step: 'Finalizado', tag: 'DATE // CONFIRMED' };
  if (progressFill) progressFill.style.width = info.fill;
  if (stepIndicator) stepIndicator.textContent = info.step;
  if (missionTag) missionTag.textContent = info.tag;
}

// ==========================================================================
// FASE 0: BIOMETRIC SCANNER (CADÊNCIA CALIBRADA PARA LEITURA CONFORTÁVEL)
// ==========================================================================
function setupBiometricScanner() {
  const btn = document.getElementById('biometricBtn');
  const fill = document.getElementById('scanProgressFill');
  const percentText = document.getElementById('scanPercent');
  const msg = document.getElementById('telemetryMsg');
  
  if (!btn) return;

  let scanProgress = 0;
  let scanInterval = null;
  let isCompleted = false;
  let resetTimeout = null;

  // 7 checkpoints espaçados para ~11.5 segundos totais (~1.6s a 1.8s cada)
  const telemetryCheckpoints = [
    { p: 2, text: '> 🚏 Localizando registros de 2021... É ela mesma: Ana Gabriela.' },
    { p: 16, text: '> 💭 Lembra daquela desculpa boba do ônibus pro Centro? Era só pretexto pra falar com você.' },
    { p: 32, text: '> 📚 Identificando traços: Mente afiada, esforçada ao extremo e irônica na dose certa.' },
    { p: 48, text: '> ✨ Cinco anos se passaram e a gente nunca teve o nosso encontro de verdade, à sua altura.' },
    { p: 66, text: '> 💻 Motivo do software: Mulher especial não se convida com mensagem genérica no WhatsApp.' },
    { p: 84, text: '> 🛵 Protocolo oficial: Um rolê preparado sob medida pra você sorrir e se sentir cuidada.' },
    { p: 98, text: '> 💖 Identidade confirmada: Ana Gabriela, seu convite oficial foi desbloqueado com sucesso!' }
  ];

  const updateTelemetryText = (currentProgress) => {
    let chosenText = msg.textContent;
    for (const cp of telemetryCheckpoints) {
      if (currentProgress >= cp.p) {
        chosenText = cp.text;
      }
    }
    if (msg.textContent !== chosenText) {
      msg.classList.add('changing');
      if (window.soundEngine && currentProgress > 3 && currentProgress < 98) {
        window.soundEngine.playPop();
      }
      setTimeout(() => {
        msg.textContent = chosenText;
        msg.classList.remove('changing');
      }, 160);
    }
  };

  const startScanning = (e) => {
    if (isCompleted) return;
    if (e.cancelable) e.preventDefault();

    if (resetTimeout) {
      clearTimeout(resetTimeout);
      resetTimeout = null;
    }

    btn.classList.add('scanning');

    if (navigator.vibrate) {
      navigator.vibrate(35);
    }
    if (window.soundEngine) {
      window.soundEngine.playScanHum();
    }

    scanInterval = setInterval(() => {
      // Incremento suave: 0.38 a cada 45ms (~11.8s no total para leitura confortável)
      scanProgress += 0.38;
      if (scanProgress > 100) scanProgress = 100;

      if (fill) fill.style.width = `${scanProgress}%`;
      if (percentText) percentText.textContent = `${Math.floor(scanProgress)}%`;
      updateTelemetryText(scanProgress);

      if (Math.floor(scanProgress) % 25 === 0 && window.soundEngine) {
        window.soundEngine.playScanHum();
      }

      if (scanProgress >= 100) {
        clearInterval(scanInterval);
        isCompleted = true;
        btn.classList.remove('scanning');
        btn.classList.add('success');
        
        if (navigator.vibrate) {
          navigator.vibrate([60, 50, 90]);
        }
        if (window.soundEngine) {
          window.soundEngine.playScanSuccess();
          if (window.soundEngine.playChime) {
            setTimeout(() => window.soundEngine.playChime(), 300);
          }
        }

        if (window.confetti) {
          confetti({
            particleCount: 85,
            spread: 80,
            origin: { y: 0.6 }
          });
        }

        setTimeout(() => {
          goToScreen(1); // Go to Briefing (Screen 1)
        }, 1500);
      }
    }, 45);
  };

  const pauseScanning = () => {
    if (isCompleted) return;
    clearInterval(scanInterval);
    btn.classList.remove('scanning');
    
    if (scanProgress < 100) {
      msg.textContent = '> ⏸️ Leitura pausada. Mantenha o dedo pressionado para continuar...';
      // Só reseta se ela passar mais de 4 segundos sem tocar
      resetTimeout = setTimeout(() => {
        scanProgress = 0;
        if (fill) fill.style.width = '0%';
        if (percentText) percentText.textContent = '0%';
        msg.textContent = '> Toque e mantenha o dedo no sensor biométrico...';
      }, 4000);
    }
  };

  btn.addEventListener('mousedown', startScanning);
  btn.addEventListener('mouseup', pauseScanning);
  btn.addEventListener('mouseleave', pauseScanning);

  btn.addEventListener('touchstart', startScanning, { passive: false });
  btn.addEventListener('touchend', pauseScanning);
  btn.addEventListener('touchcancel', pauseScanning);
}

// ==========================================================================
// FASE 1: BRIEFING NEXT
// ==========================================================================
function setupBriefingNext() {
  const btn = document.getElementById('briefingNextBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playSelect();
      goToScreen(2); // Go to Transport / Logística
    });
  }
}

// ==========================================================================
// FASE 2: LOGÍSTICA & A MOTO (COM BLOQUEIO DE CARRO/UBER)
// ==========================================================================
function setupQuizPhase1() {
  const optMoto = document.getElementById('optMoto');
  const optCarro = document.getElementById('optCarro');
  const optUber = document.getElementById('optUber');
  const nextBtn = document.getElementById('nextBtn1');
  const toast = document.getElementById('dictatorToast');
  const toastText = document.getElementById('dictatorToastText');

  const playfulPhrases = [
    'Ônibus pro Centro em 2026?! Nem pensar, aquela desculpa já cumpriu o papel dela! 😂',
    'Pode guardar esse sorrisinho debochado: hoje a convidada de honra vai de moto!',
    'Carro negado! A moto é nosso transporte oficial pro primeiro rolê de verdade 🏍️',
    '5 anos depois daquele ponto de ônibus, você merece chegar com estilo!',
    'Aqui é democracia relativa: quatro rodas e busão bloqueados pelo desenvolvedor!',
    'Piloto que deixa a Ana Gabriela ir de busão perde a moral de vez 😂'
  ];

  let phraseIdx = 0;

  const rejectFakeOption = (btn, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (navigator.vibrate) {
      navigator.vibrate([40, 30, 40]);
    }
    if (window.soundEngine) {
      window.soundEngine.playDodge();
    }

    btn.classList.remove('rejected');
    void btn.offsetWidth;
    btn.classList.add('rejected');

    const randomX = (Math.random() * 2 - 1) * 35;
    const randomY = (Math.random() * 2 - 1) * 15;
    btn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    toastText.textContent = playfulPhrases[phraseIdx % playfulPhrases.length];
    phraseIdx++;
    toast.classList.add('active');

    clearTimeout(btn._toastTimer);
    btn._toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  };

  ['click', 'touchstart'].forEach(evt => {
    if (optCarro) optCarro.addEventListener(evt, (e) => rejectFakeOption(optCarro, e));
    if (optUber) optUber.addEventListener(evt, (e) => rejectFakeOption(optUber, e));
  });

  if (optMoto) {
    optMoto.addEventListener('click', () => {
      optMoto.classList.add('selected');
      gameState.preferences.ride = optMoto.dataset.val;
      nextBtn.disabled = false;
      
      if (optCarro) optCarro.style.transform = 'translate(0, 0)';
      if (optUber) optUber.style.transform = 'translate(0, 0)';

      toastText.textContent = 'Decisão aprovada! Garupa da moto confirmada para o nosso primeiro rolê oficial ✨';
      toast.classList.add('active');

      if (window.soundEngine) {
        window.soundEngine.playSelect();
      }
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (toast) toast.classList.remove('active');
      goToScreen(3); // Go to Gastronomia (Screen 3)
    });
  }
}

// ==========================================================================
// FASE 3: CARDÁPIO GASTRONÔMICO
// ==========================================================================
function setupQuizPhase2() {
  const cards = document.querySelectorAll('#cuisineGrid .option-card');
  const nextBtn = document.getElementById('nextBtn2');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.preferences.cuisine = card.dataset.val;
      nextBtn.disabled = false;
      if (window.soundEngine) window.soundEngine.playSelect();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToScreen(4); // Go to Bebidas/Sobremesa/Dia (Screen 4)
    });
  }
}

// ==========================================================================
// FASE 4: DETALHES (DIA, BEBIDA, DOCE, VIBE)
// ==========================================================================
function setupQuizPhase3() {
  const setupGroup = (containerId, key) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const pills = container.querySelectorAll('.pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        gameState.preferences[key] = pill.dataset.val;
        if (window.soundEngine) window.soundEngine.playPop();
        checkPhase3Complete();
      });
    });
  };

  setupGroup('dayOptions', 'dateDay');
  setupGroup('drinkOptions', 'drink');
  setupGroup('dessertOptions', 'dessert');
  setupGroup('vibeOptions', 'vibe');

  const checkPhase3Complete = () => {
    const { dateDay, drink, dessert, vibe } = gameState.preferences;
    const nextBtn = document.getElementById('nextBtn3');
    if (dateDay && drink && dessert && vibe && nextBtn) {
      nextBtn.disabled = false;
      if (window.soundEngine && window.soundEngine.playChime) {
        window.soundEngine.playChime();
      }
    }
  };

  const nextBtn = document.getElementById('nextBtn3');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      runAIComputationScreen(); // Go to Compiler (Screen 5)
    });
  }
}

// ==========================================================================
// FASE 5: COMPUTING SCREEN (TERMINAL COMPILER)
// ==========================================================================
function runAIComputationScreen() {
  goToScreen(5);

  const logs = [
    '> npm run init-date --target=ana-gabriela',
    '> Carregando histórico de 2021: Ponto de ônibus pro Centro... Localizado!',
    '> Analisando tempo decorrido: 5 anos de amizade e zero encontros formais...',
    '> Aplicando resolução do desenvolvedor: Agendar o primeiro rolê de verdade.',
    '> Mapeando perfil da Ana: Inteligente, dedicada, irônica e incrivelmente especial.',
    '> Rota traçada na moto: Mesa reservada, comida de alto nível e conversa boa.',
    '> Compilação concluída: 100% de sintonia confirmada para o nosso encontro!'
  ];

  const terminalBody = document.getElementById('terminalLogs');
  if (terminalBody) terminalBody.innerHTML = '';

  const aiProgressFill = document.getElementById('aiProgressFill');
  const matchNumber = document.getElementById('matchNumber');

  let logIdx = 0;
  let score = 0;

  const logInterval = setInterval(() => {
    if (terminalBody && logIdx < logs.length) {
      const p = document.createElement('p');
      p.className = 'term-line';
      p.textContent = logs[logIdx];
      terminalBody.appendChild(p);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      logIdx++;
    }
  }, 650);

  const scoreInterval = setInterval(() => {
    score += 4;
    if (score > 100) score = 100;
    if (aiProgressFill) aiProgressFill.style.width = `${score}%`;
    if (matchNumber) matchNumber.textContent = `${score}%`;

    if (score >= 100) {
      clearInterval(scoreInterval);
      clearInterval(logInterval);
      if (matchNumber) matchNumber.textContent = '100%';

      setTimeout(() => {
        const chosenDay = gameState.preferences.dateDay || 'Sexta que vem';
        const displayEl = document.getElementById('chosenDateDisplay');
        if (displayEl) displayEl.textContent = chosenDay.toUpperCase();
        const spanEl = document.getElementById('inviteDaySpan');
        if (spanEl) spanEl.textContent = chosenDay.toLowerCase();
        goToScreen(6); // Go to The Big Question (Screen 6)
      }, 950);
    }
  }, 65);
}

// ==========================================================================
// FASE 6: THE BIG QUESTION & RUNAWAY "NÃO" BUTTON
// ==========================================================================
function setupRunawayDecision() {
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const btnNoText = document.getElementById('btnNoText');
  const runawayZone = document.getElementById('runawayZone');

  const wittyNoPhrases = [
    'Não...',
    'Erro 404: Deboche bloqueado pelo sistema 😂',
    '5 anos esperando pra você clicar em Não?! 🚫',
    'Eu programei um software inteiro, aceita logo! 😉',
    'Você merece essa noite especial, clica no SIM! ✨',
    'O desenvolvedor desativou o Não com carinho! 👏',
    'Sem deboche agora: vai ser incrível, clica no SIM! ❤️'
  ];

  let currentScale = 1.0;

  const dodgeButton = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    gameState.dodgeCount++;

    if (navigator.vibrate) {
      navigator.vibrate(35);
    }
    if (window.soundEngine) {
      window.soundEngine.playDodge();
    }

    const phraseIndex = Math.min(gameState.dodgeCount, wittyNoPhrases.length - 1);
    btnNoText.textContent = wittyNoPhrases[phraseIndex];

    currentScale += 0.08;
    if (currentScale > 1.45) currentScale = 1.45;
    btnYes.style.transform = `scale(${currentScale})`;

    const zoneRect = runawayZone.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxMoveX = (zoneRect.width / 2) - (btnRect.width / 2) - 10;
    const maxMoveY = 55;

    const randomX = (Math.random() * 2 - 1) * maxMoveX;
    const randomY = (Math.random() * 2 - 1) * maxMoveY;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeButton);
    btnNo.addEventListener('touchstart', dodgeButton, { passive: false });
    btnNo.addEventListener('pointerdown', dodgeButton);
    btnNo.addEventListener('click', dodgeButton);
  }

  // YES BUTTON CLICK
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
      }
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 120]);
      }

      fireRefinedConfetti();
      renderBoardingPassTicket();
      goToScreen(7); // Go to Boarding Pass / WhatsApp (Screen 7)
    });
  }
}

function fireRefinedConfetti() {
  if (!window.confetti) return;

  const duration = 3.2 * 1000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    confetti({
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#d97706', '#f59e0b', '#ffffff']
    });
  }, 240);
}

// ==========================================================================
// FASE 7: BOARDING PASS & WHATSAPP
// ==========================================================================
function renderBoardingPassTicket() {
  const container = document.getElementById('ticketPrefTags');
  if (!container) return;
  container.innerHTML = '';

  const { dateDay, ride, cuisine, drink, dessert, vibe } = gameState.preferences;

  const ticketDateValue = document.getElementById('ticketDateValue');
  if (ticketDateValue) {
    ticketDateValue.textContent = dateDay || 'Final de semana que vem';
  }

  const tags = [
    dateDay ? `📅 ${dateDay}` : '📅 Final de semana',
    cuisine || 'Restaurante Exclusivo',
    drink || 'Bebida Especial',
    dessert || 'Sobremesa',
    ride ? `🏍️ ${ride.substring(0, 26)}...` : 'Carona de Moto',
    vibe ? `✨ ${vibe.substring(0, 26)}...` : 'Conversa Boa'
  ];

  tags.forEach(tagText => {
    const badge = document.createElement('span');
    badge.className = 'pref-tag-badge';
    badge.textContent = tagText;
    container.appendChild(badge);
  });

  updateWhatsAppLink();
  updateCalendarLink();
}

function updateWhatsAppLink() {
  const whatsappBtn = document.getElementById('whatsappShareBtn');
  if (!whatsappBtn) return;
  const { dateDay, ride, cuisine, drink, dessert, vibe } = gameState.preferences;

  const dayHeader = dateDay ? ` (${dateDay.toUpperCase()})` : '';

  const message = 
`Oi Leo! Vi que você codou um sistema inteiro só pra me chamar pro nosso primeiro rolê de verdade... achei incrível e muito fofo! 😂🏍️💻

Minha confirmação oficial para o nosso ROLÊ${dayHeader}:
✅ CONVITE ACEITO!

📋 Meu roteiro da noite especial:
• Quando: ${dateDay || 'Final de semana que vem'}
• Transporte: ${ride || 'Vou na garupa da moto com estilo!'}
• O que comer: ${cuisine || 'Jantar especial selecionado'}
• Para acompanhar: ${drink || 'Bebida bem gelada'}
• Sobremesa: ${dessert || 'Sobremesa especial'}
• Vibe do encontro: ${vibe || 'Conversa boa e leveza'}

Prometo dar uma trégua no deboche pelo menos no começo da noite 😂. E já que demorou 5 anos desde aquele ponto de ônibus, te passo a localização certinha pra você me buscar de moto! 📍🛵`;

  const encodedMsg = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/${gameState.hostPhone}?text=${encodedMsg}`;
}

function updateCalendarLink() {
  const calBtn = document.getElementById('calendarBtn');
  if (!calBtn) return;
  
  const { dateDay } = gameState.preferences;
  const title = encodeURIComponent(`Primeiro Rolê: Leonardo & Ana Gabriela (${dateDay || 'Rolê'} 🛵✨)`);
  const details = encodeURIComponent(
    'Nosso primeiro encontro oficial confirmado pelo convite interativo!\n' +
    'Dev & Piloto: Leonardo\n' +
    'Convidada de Honra: Ana Gabriela\n' +
    `Data Escolhida: ${dateDay || 'Final de semana'}\n` +
    'Programação: Carona de moto, gastronomia de alto nível e conversa boa.'
  );
  const location = encodeURIComponent('Lugar Especial');

  // Next target day: Sexta (5), Sábado (6), Domingo (0)
  let targetDayOfWeek = 5;
  if (dateDay && dateDay.toLowerCase().includes('sábado')) targetDayOfWeek = 6;
  if (dateDay && dateDay.toLowerCase().includes('domingo')) targetDayOfWeek = 0;

  const now = new Date();
  const targetDate = new Date();
  const daysToAdd = ((targetDayOfWeek - now.getDay() + 7) % 7) || 7;
  targetDate.setDate(now.getDate() + daysToAdd);
  targetDate.setHours(targetDayOfWeek === 0 ? 17 : 20, 0, 0, 0);
  const endDate = new Date(targetDate.getTime() + 3 * 3600 * 1000);

  const pad = (n) => String(n).padStart(2, '0');
  const formatTime = (d) => 
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const dates = `${formatTime(targetDate)}/${formatTime(endDate)}`;

  calBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function setupTicketAndActions() {
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      gameState.dodgeCount = 0;
      const btnYes = document.getElementById('btnYes');
      const btnNo = document.getElementById('btnNo');
      const btnNoText = document.getElementById('btnNoText');
      
      if (btnYes) btnYes.style.transform = 'scale(1)';
      if (btnNo) {
        btnNo.style.transform = 'translate(0, 0)';
        btnNoText.textContent = 'Não...';
      }

      goToScreen(0);
    });
  }
}
