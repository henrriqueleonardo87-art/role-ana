/**
 * Ana Gabriela & Leonardo // O Convite
 * Aplicação web exclusiva desenvolvida com elegância, carinho e maturidade.
 */

// Application State
const gameState = {
  currentScreen: 0,
  preferences: {
    ride: 'Na garupa da moto com o Leo',
    cuisine: '',
    dateDay: '',
    drink: '',
    dessert: '',
    vibe: ''
  },
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
  setupDecisionScreen();
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
    { fill: '14%', step: 'Identificação', tag: 'ACESSO RESERVADO' },
    { fill: '28%', step: 'O Motivo', tag: 'REGISTRO // 2021-2026' },
    { fill: '44%', step: 'Transporte', tag: 'LOGÍSTICA // ROTA' },
    { fill: '60%', step: 'Gastronomia', tag: 'EXPERIÊNCIA // ETAPA 01' },
    { fill: '76%', step: 'Detalhes', tag: 'PLANEJAMENTO // ETAPA 02' },
    { fill: '88%', step: 'Organizando...', tag: 'SISTEMA // PREPARAÇÃO' },
    { fill: '96%', step: 'O Convite', tag: 'DECISÃO // CONVITE' },
    { fill: '100%', step: 'Confirmado', tag: 'ENCONTRO CONFIRMADO' }
  ];

  const info = screenMap[gameState.currentScreen] || { fill: '100%', step: 'Finalizado', tag: 'ENCONTRO' };
  if (progressFill) progressFill.style.width = info.fill;
  if (stepIndicator) stepIndicator.textContent = info.step;
  if (missionTag) missionTag.textContent = info.tag;
}

// ==========================================================================
// TOAST NOTIFICATION SYSTEM (PARA BOTÕES BLOQUEADOS COM BOM HUMOR)
// ==========================================================================
let toastTimeout = null;
function showBlockedToast(message, icon = '🔒') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  container.innerHTML = `
    <div class="toast-card toast-shake">
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    </div>
  `;

  container.classList.add('visible');

  if (window.soundEngine) {
    window.soundEngine.playBlockedSound();
  }

  if (navigator.vibrate) {
    navigator.vibrate([40, 30, 40]);
  }

  toastTimeout = setTimeout(() => {
    container.classList.remove('visible');
    setTimeout(() => {
      container.innerHTML = '';
    }, 300);
  }, 4200);
}

// ==========================================================================
// FASE 0: BIOMETRIC SCANNER + VOZ SINTETIZADA
// ==========================================================================
function setupBiometricScanner() {
  const btn = document.getElementById('biometricBtn');
  const fill = document.getElementById('scanProgressFill');
  const percentText = document.getElementById('scanPercent');
  const msg = document.getElementById('telemetryMsg');
  const voiceBox = document.getElementById('voiceIdentifiedBox');
  
  if (!btn) return;

  let scanProgress = 0;
  let scanInterval = null;
  let isCompleted = false;
  let resetTimeout = null;

  // Checkpoints maduros e respeitosos (~10 segundos)
  const telemetryCheckpoints = [
    { p: 2, text: '> Acesso verificado: Ana Gabriela.' },
    { p: 18, text: '> Resgatando a história: O ponto de ônibus em 2021 e a velha desculpa do Centro.' },
    { p: 38, text: '> Cinco anos se passaram — e você continua com aquela inteligência rara e humor afiado.' },
    { p: 58, text: '> Mulher dedicada, que se cobra tanto e merece uma noite pensada exclusivamente para ela.' },
    { p: 80, text: '> Chegou a hora do nosso primeiro encontro de verdade.' },
    { p: 98, text: '> Identidade confirmada. Liberando síntese de áudio...' }
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
      if (window.soundEngine && currentProgress > 4 && currentProgress < 98) {
        window.soundEngine.playPop();
      }
      setTimeout(() => {
        msg.textContent = chosenText;
        msg.classList.remove('changing');
      }, 150);
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
      navigator.vibrate(30);
    }
    if (window.soundEngine) {
      window.soundEngine.init();
      window.soundEngine.playScanHum();
    }

    scanInterval = setInterval(() => {
      scanProgress += 0.42;
      if (scanProgress > 100) scanProgress = 100;

      if (fill) fill.style.width = `${scanProgress}%`;
      if (percentText) percentText.textContent = `${Math.floor(scanProgress)}%`;
      updateTelemetryText(scanProgress);

      if (Math.floor(scanProgress) % 30 === 0 && window.soundEngine) {
        window.soundEngine.playScanHum();
      }

      if (scanProgress >= 100) {
        clearInterval(scanInterval);
        isCompleted = true;
        btn.classList.remove('scanning');
        btn.classList.add('success');
        
        if (navigator.vibrate) {
          navigator.vibrate([60, 40, 100]);
        }
        if (window.soundEngine) {
          window.soundEngine.playChime();
        }

        // Exibe o card de voz visual
        if (voiceBox) {
          voiceBox.style.display = 'block';
          voiceBox.classList.add('voice-appear');
        }

        // Executa a voz sintetizada solicitada pelo usuário
        const speechText = 'Pessoa identificada: Ana Gabriela. Característica marcante: Um sorriso lindo, mente brilhante e um deboche sem igual. Acesso liberado.';
        if (window.soundEngine) {
          window.soundEngine.speakVoice(speechText);
        }

        // Transição suave para a tela 1 dando tempo de ouvir e ver
        setTimeout(() => {
          goToScreen(1); // Vai para o Briefing (Tela 1)
        }, 3200);
      }
    }, 45);
  };

  const pauseScanning = () => {
    if (isCompleted) return;
    clearInterval(scanInterval);
    btn.classList.remove('scanning');
    
    if (scanProgress < 100) {
      msg.textContent = '> Leitura pausada. Mantenha o polegar no leitor para continuar...';
      resetTimeout = setTimeout(() => {
        scanProgress = 0;
        if (fill) fill.style.width = '0%';
        if (percentText) percentText.textContent = '0%';
        msg.textContent = 'Toque e mantenha o polegar no sensor para carregar os dados...';
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
      goToScreen(2); // Go to Transport (Screen 2)
    });
  }
}

// ==========================================================================
// FASE 2: LOGÍSTICA & TRANSPORTE (COM OPÇÕES BLOQUEADAS UBER E ÔNIBUS)
// ==========================================================================
function setupQuizPhase1() {
  const optMoto = document.getElementById('optMoto');
  const optEncontro = document.getElementById('optEncontro');
  const optUber = document.getElementById('optUber');
  const optBus = document.getElementById('optBus');
  const nextBtn = document.getElementById('nextBtn1');

  const selectOption = (selectedEl, unselectedEl, val) => {
    if (selectedEl) selectedEl.classList.add('selected');
    if (unselectedEl) unselectedEl.classList.remove('selected');
    gameState.preferences.ride = val;
    if (window.soundEngine) window.soundEngine.playSelect();
  };

  if (optMoto) {
    optMoto.addEventListener('click', () => {
      selectOption(optMoto, optEncontro, 'Na garupa da moto com o Leo');
    });
  }

  if (optEncontro) {
    optEncontro.addEventListener('click', () => {
      selectOption(optEncontro, optMoto, 'Nos encontramos direto no restaurante');
    });
  }

  // Opção Bloqueada: UBER
  if (optUber) {
    optUber.addEventListener('click', (e) => {
      e.preventDefault();
      optUber.classList.add('shake');
      setTimeout(() => optUber.classList.remove('shake'), 400);
      showBlockedToast('🚗 Opção Bloqueada: Nada de motorista estranho no trânsito hoje! A carona oficial é de moto com o Leo ou nos encontramos lá 😉', '🚗');
    });
  }

  // Opção Bloqueada: ÔNIBUS
  if (optBus) {
    optBus.addEventListener('click', (e) => {
      e.preventDefault();
      optBus.classList.add('shake');
      setTimeout(() => optBus.classList.remove('shake'), 400);
      showBlockedToast('🚌 Opção Bloqueada: O ônibus pro Centro cumpriu a missão em 2021 pra gente se conhecer. Mas em 2026 o rolê é de alto nível!', '🚌');
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToScreen(3); // Go to Gastronomia (Screen 3)
    });
  }
}

// ==========================================================================
// FASE 3: GASTRONOMIA
// ==========================================================================
function setupQuizPhase2() {
  const cards = document.querySelectorAll('#cuisineGrid .option-card');
  const nextBtn = document.getElementById('nextBtn2');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameState.preferences.cuisine = card.dataset.val;
      if (nextBtn) nextBtn.disabled = false;
      if (window.soundEngine) window.soundEngine.playSelect();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToScreen(4); // Go to Detalhes (Screen 4)
    });
  }
}

// ==========================================================================
// FASE 4: DETALHES DO ROLÊ (DIA, OUTRA DATA, BEBIDA, DOCE, VIBE)
// ==========================================================================
function setupQuizPhase3() {
  const customDateContainer = document.getElementById('customDateContainer');
  const customDateInput = document.getElementById('customDateInput');
  const pillOtherDate = document.getElementById('pillOtherDate');
  const dayPills = document.querySelectorAll('#dayOptions .pill-btn');

  // Gerenciamento dos dias (incluindo opção personalizada)
  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dayPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');

      if (pill.id === 'pillOtherDate') {
        // Exibe input para ela digitar a data
        if (customDateContainer) {
          customDateContainer.style.display = 'block';
          if (customDateInput) {
            customDateInput.focus();
            if (customDateInput.value.trim()) {
              gameState.preferences.dateDay = `Outra data (${customDateInput.value.trim()})`;
            } else {
              gameState.preferences.dateDay = '';
            }
          }
        }
      } else {
        // Oculta campo personalizado se escolheu uma das 3 opções
        if (customDateContainer) {
          customDateContainer.style.display = 'none';
        }
        gameState.preferences.dateDay = pill.dataset.val;
      }

      if (window.soundEngine) window.soundEngine.playPop();
      checkPhase3Complete();
    });
  });

  // Atualização em tempo real quando ela digita a outra data
  if (customDateInput) {
    customDateInput.addEventListener('input', () => {
      const val = customDateInput.value.trim();
      if (val) {
        gameState.preferences.dateDay = `Outra data (${val})`;
      } else {
        gameState.preferences.dateDay = '';
      }
      checkPhase3Complete();
    });
  }

  // Grupos simples de botões
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

  setupGroup('drinkOptions', 'drink');
  setupGroup('dessertOptions', 'dessert');
  setupGroup('vibeOptions', 'vibe');

  const checkPhase3Complete = () => {
    const { dateDay, drink, dessert, vibe } = gameState.preferences;
    const nextBtn = document.getElementById('nextBtn3');
    if (dateDay && drink && dessert && vibe && nextBtn) {
      nextBtn.disabled = false;
    } else if (nextBtn) {
      nextBtn.disabled = true;
    }
  };

  const nextBtn = document.getElementById('nextBtn3');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      runCurationSummary(); // Go to Summary (Screen 5)
    });
  }
}

// ==========================================================================
// FASE 5: RESUMO DO ITINERÁRIO (CURADORIA LIMPA)
// ==========================================================================
function runCurationSummary() {
  goToScreen(5);

  const previewDate = document.getElementById('previewDate');
  const previewCuisine = document.getElementById('previewCuisine');
  const previewRide = document.getElementById('previewRide');
  const progressFill = document.getElementById('aiProgressFill');

  if (previewDate) previewDate.textContent = gameState.preferences.dateDay || 'Final de semana';
  if (previewCuisine) previewCuisine.textContent = gameState.preferences.cuisine || 'Restaurante Exclusivo';
  if (previewRide) previewRide.textContent = gameState.preferences.ride || 'Carona de moto';

  let p = 0;
  const interval = setInterval(() => {
    p += 8;
    if (p > 100) p = 100;

    if (progressFill) progressFill.style.width = `${p}%`;

    if (p >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const chosenDay = gameState.preferences.dateDay || 'Sexta que vem';
        const displayEl = document.getElementById('chosenDateDisplay');
        if (displayEl) displayEl.textContent = chosenDay.toUpperCase();
        const spanEl = document.getElementById('inviteDaySpan');
        if (spanEl) spanEl.textContent = chosenDay.toLowerCase();
        goToScreen(6); // Go to The Invitation (Screen 6)
      }, 700);
    }
  }, 70);
}

// ==========================================================================
// FASE 6: O CONVITE OFICIAL (COM BOTÃO NÃO BLOQUEADO & RESPOSTAS DIVERTIDAS)
// ==========================================================================
function setupDecisionScreen() {
  const btnYes = document.getElementById('btnYes');
  const btnThink = document.getElementById('btnThink');
  const btnNo = document.getElementById('btnNo');
  const thinkResponse = document.getElementById('thinkResponse');

  // Respostas divertidas e respeitosas caso ela tente clicar no NÃO
  const funnyExcuses = [
    '⛔ Erro 404: Opção "Não" indisponível no sistema do Leo.',
    '🔒 Acesso Negado: O desenvolvedor passou horas programando essa aplicação com carinho, essa opção está revogada!',
    '😅 Tentativa de recusa negada: Depois de 5 anos esperando esse rolê, o sistema não aceita essa resposta!',
    '📊 Diagnóstico do sistema: Nível de esforço e dedicação aos estudos altíssimo. Você merece essa pausa, recusa cancelada!',
    '🚌 Bloqueio nostálgico: Desde aquele ponto de ônibus em 2021 eu queria esse momento. Tenta clicar no SIM 😉',
    '✨ Alerta do sistema: A mesa já está na mira e a carona garantida. Clica no "SIM" que a leveza é garantida!'
  ];
  let excuseIndex = 0;

  if (btnThink && thinkResponse) {
    btnThink.addEventListener('click', () => {
      thinkResponse.classList.add('visible');
      if (btnYes) {
        btnYes.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (window.soundEngine) {
        window.soundEngine.playPop();
      }
    });
  }

  // Botão NÃO Bloqueado
  if (btnNo) {
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      btnNo.classList.add('shake');
      setTimeout(() => btnNo.classList.remove('shake'), 400);

      const excuse = funnyExcuses[excuseIndex % funnyExcuses.length];
      excuseIndex++;
      showBlockedToast(excuse, '🔒');
    });
  }

  // Botão SIM
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.playChime();
      }
      if (navigator.vibrate) {
        navigator.vibrate([60, 40, 100]);
      }

      fireTastefulConfetti();
      renderBoardingPassTicket();
      goToScreen(7); // Go to Boarding Pass / WhatsApp (Screen 7)
    });
  }
}

function fireTastefulConfetti() {
  if (!window.confetti) return;

  confetti({
    particleCount: 75,
    spread: 65,
    origin: { y: 0.65 },
    colors: ['#e11d48', '#be123c', '#fb7185', '#d97706', '#f59e0b', '#ffffff']
  });
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

  const ticketRideValue = document.getElementById('ticketRideValue');
  if (ticketRideValue) {
    ticketRideValue.textContent = ride || 'Moto (Carona Oficial)';
  }

  const tags = [
    dateDay ? `📅 ${dateDay}` : '📅 Final de semana',
    cuisine || 'Restaurante Exclusivo',
    drink || 'Bebida Especial',
    dessert || 'Sobremesa',
    vibe ? `✨ ${vibe}` : 'Conversa Boa'
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

  const dayHeader = dateDay ? ` (${dateDay})` : '';

  const message = 
`Oi Leo! Vi a aplicação que você programou... achei de muito bom gosto e super especial.

Confirmando o nosso primeiro rolê oficial${dayHeader}:
✅ CONVITE ACEITO!

📋 O que eu escolhi:
• Quando: ${dateDay || 'Final de semana que vem'}
• Como vamos: ${ride || 'Na garupa da moto com o Leo'}
• O que comer: ${cuisine || 'Restaurante exclusivo'}
• Acompanhamento: ${drink || 'Bebida especial'}
• Sobremesa: ${dessert || 'Sobremesa'}
• Vibe: ${vibe || 'Conversa sincera e leveza'}

Já que demorou cinco anos desde aquele ponto de ônibus 😂, te passo a localização certinha pra gente ir! 🛵✨`;

  const encodedMsg = encodeURIComponent(message);
  whatsappBtn.href = `https://wa.me/${gameState.hostPhone}?text=${encodedMsg}`;
}

function updateCalendarLink() {
  const calBtn = document.getElementById('calendarBtn');
  if (!calBtn) return;
  
  const { dateDay } = gameState.preferences;
  const title = encodeURIComponent(`Encontro: Leonardo & Ana Gabriela (${dateDay || 'Rolê'} 🛵✨)`);
  const details = encodeURIComponent(
    'Primeiro encontro oficial confirmado pelo convite reservado!\n' +
    'Anfitrião: Leonardo\n' +
    'Convidada de Honra: Ana Gabriela\n' +
    `Data Escolhida: ${dateDay || 'Final de semana'}\n` +
    'Programação: Gastronomia de alto nível, boa conversa e leveza.'
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
      const thinkResponse = document.getElementById('thinkResponse');
      if (thinkResponse) thinkResponse.classList.remove('visible');
      goToScreen(0);
    });
  }
}
