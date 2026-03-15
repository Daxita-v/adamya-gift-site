/* =========================================
   SCRIPT.JS - DaxitaOS Logic
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DaxitaOS script initializing (Final Options)...');
    window.DaxitaOSLoaded = true;

    const windowContainer = document.getElementById('window-container');
    const confettiContainer = document.getElementById('confetti-container');
    let highestZIndex = 100;
  
    // ==========================================
    // Core Window Management System
    // ==========================================
    
    document.querySelectorAll('.os-window').forEach(win => {
      makeDraggable(win);
      setupWindowButtons(win);
      win.addEventListener('mousedown', () => {
        highestZIndex++;
        win.style.zIndex = highestZIndex;
      });
    });
  
    function setupWindowButtons(windowEl) {
      const closeBtn = windowEl.querySelector('.btn-close');
      const minBtn = windowEl.querySelector('.btn-min');
      const maxBtn = windowEl.querySelector('.btn-max');
      
      if(closeBtn) {
        closeBtn.addEventListener('click', () => {
          windowEl.style.display = 'none';
        });
      }
      
      if(minBtn) {
        minBtn.addEventListener('click', () => {
          const content = windowEl.querySelector('.window-content');
          if(content.style.display === 'none') {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        });
      }

      if(maxBtn) {
        let isMaximized = false;
        let prevStyle = {};
        maxBtn.addEventListener('click', () => {
          if(!isMaximized) {
            prevStyle = { width: windowEl.style.width, top: windowEl.style.top, left: windowEl.style.left, right: windowEl.style.right };
            windowEl.style.width = '100vw';
            windowEl.style.top = '0';
            windowEl.style.left = '0';
            windowEl.style.right = 'auto';
            isMaximized = true;
          } else {
            windowEl.style.width = prevStyle.width;
            windowEl.style.top = prevStyle.top;
            windowEl.style.left = prevStyle.left;
            windowEl.style.right = prevStyle.right;
            isMaximized = false;
          }
        });
      }
    }
  
    function makeDraggable(windowEl) {
      const titleBar = windowEl.querySelector('.title-bar');
      if(!titleBar) return;
  
      let isDragging = false;
      let startX, startY, initialX, initialY;
  
      titleBar.addEventListener('mousedown', (e) => {
        if(e.target.tagName === 'BUTTON') return;
        isDragging = true;
        highestZIndex++;
        windowEl.style.zIndex = highestZIndex;
        startX = e.clientX;
        startY = e.clientY;
        const rect = windowEl.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        titleBar.style.cursor = 'grabbing';
      });
  
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        windowEl.style.left = `${initialX + dx}px`;
        windowEl.style.top = `${initialY + dy}px`;
        windowEl.style.right = 'auto';
        windowEl.style.bottom = 'auto';
      });
  
      document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'move';
      });
    }
  
    // Window Factory
    function createWindow(id, title, width, height, x, y, innerHTML) {
      const existing = document.getElementById(id);
      if (existing) {
        existing.style.display = 'flex';
        const titleText = existing.querySelector('.title-text');
        const content = existing.querySelector('.window-content');
        if (titleText) titleText.innerText = title;
        if (content) content.innerHTML = innerHTML;
        highestZIndex++;
        existing.style.zIndex = highestZIndex;
        return existing;
      }
  
      highestZIndex++;
      const win = document.createElement('div');
      win.className = 'os-window';
      win.id = id;
      win.style.width = width + 'px';
      if(height) win.style.height = height + 'px';
      win.style.left = x + 'px';
      win.style.top = y + 'px';
      win.style.zIndex = highestZIndex;
  
      win.innerHTML = `
        <div class="title-bar">
          <span class="title-text">${title}</span>
          <div class="title-buttons">
            <button class="btn-min">_</button>
            <button class="btn-max">\u25a1</button>
            <button class="btn-close">X</button>
          </div>
        </div>
        <div class="window-content ${id === 'win-love-virus' ? 'center-content' : ''}">
          ${innerHTML}
        </div>
      `;
  
      windowContainer.appendChild(win);
      makeDraggable(win);
      setupWindowButtons(win);
      
      win.addEventListener('mousedown', () => {
        highestZIndex++;
        win.style.zIndex = highestZIndex;
      });
  
      return win;
    }
  
    // ==========================================
    // Boot Sequence Logic
    // ==========================================
    const bootScreen = document.getElementById('boot-screen');
    const bootMessages = document.getElementById('boot-messages');
    const bootProgress = document.getElementById('boot-progress-fill');
    const bootStatus = document.getElementById('boot-status');
  
    const messages = [
      "Booting DaxitaOS...",
      "Loading Love Engine...",
      "Loading Memory Files...",
      "Initializing Adamya Support System...",
      "Starting Scooby Module...",
      "Installing Birthday Reminder..."
    ];
  
    async function startBootProcess() {
      if (!bootScreen) {
        initDesktop();
        return;
      }
  
      // 1. Show messages one by one
      for (let i = 0; i < messages.length; i++) {
        const msg = document.createElement('div');
        msg.className = 'boot-msg';
        msg.innerText = `> ${messages[i]}`;
        bootMessages.appendChild(msg);
        await new Promise(r => setTimeout(r, 400));
      }
  
      // 2. Animate loading bar (0 to 100 in 3 seconds)
      await animateLoader(3000);
  
      // 3. Final Messages
      bootStatus.innerText = "SYSTEM STATUS: PERFECT MATCH";
      bootStatus.style.color = "#ff4081";
      
      const welcome = document.createElement('div');
      welcome.className = 'boot-final-msg';
      welcome.innerText = "WELCOME ADAMYA";
      bootMessages.appendChild(welcome);
  
      // 4. Fade out / Wipe transition after a pause
      await new Promise(r => setTimeout(r, 1500));
      bootScreen.classList.add('boot-finished');
      
      // Start the existing desktop notifications
      setTimeout(initDesktop, 500);
    }
  
    function animateLoader(duration) {
      return new Promise(resolve => {
        let start = null;
        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          bootProgress.style.width = (progress * 100) + '%';
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        window.requestAnimationFrame(step);
      });
    }
  
    function initDesktop() {
      setTimeout(() => {
        createWindow(
          'win-notify', 
          'Notification', 
          280, 150, 
          (window.innerWidth / 2) - 140, 
          (window.innerHeight / 2) - 100, 
          `<div class="center-content">
             <h3 style="font-size: 2rem;">Hi! Welcome</h3>
           </div>`
        );
    
        setTimeout(() => {
          createWindow(
            'win-bday', 
            'Error', 
            350, 200, 
            (window.innerWidth / 2) - 100, 
            (window.innerHeight / 2) - 50, 
            `<div class="center-content">
               <div class="bold-error">HAPPY BIRTHDAY<br>ADAMYA</div>
               <p style="font-size: 1.2rem;">congratulations on becoming<br>the same age as me babe \ud83d\ude0a</p>
               <button class="action-btn" onclick="document.getElementById('win-bday').style.display='none'">OK <3</button>
             </div>`
          );
        }, 2000);
        
      }, 500);
    }
  
    // Start the boot sequence!
    startBootProcess();
  
  
    // ==========================================
    // Desktop Icon Interactivity
    // ==========================================
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', (e) => {
        const action = icon.getAttribute('data-action');
        let xOffset = 250 + (Math.random() * 50);
        let yOffset = 100 + (Math.random() * 50);
  
        switch(action) {

          case 'open-memories': {
            const memories = [
              { img: "my lifes memories/1.jpeg", caption: "The first page of our story \u2014 the day I took you out and unknowingly started my favorite chapter.", date: "Our First Date" },
              { img: "my lifes memories/2.jpeg", caption: "The day \u2018you and me\u2019 officially became \u2018us\u2019.", date: "The Day We Started Dating" },
              { img: "my lifes memories/3.jpeg", caption: "The day our little family grew by four paws \u2014 welcome to the chaos, Scooby.", date: "The Day Scooby Joined Us" },
              { img: "my lifes memories/4.jpeg", caption: "Proof that love comes with extra snacks.", date: "When We Started Gaining Weight Together" },
              { img: "my lifes memories/5.jpeg", caption: "Introducing the legendary Mr. Ganju Patel.", date: "A Legendary Moment" },
              { img: "my lifes memories/6.jpeg", caption: "One random selfie, a thousand good memories.", date: "Cute Selfie #1" },
              { img: "my lifes memories/7.jpeg", caption: "If happiness had a picture, it might look like this.", date: "Cute Selfie #2" },
              { img: "my lifes memories/8.jpeg", caption: "Our cute selfie together number 3.", date: "Another Cute Moment" },
              { img: "my lifes memories/9.jpeg", caption: "Our cute selfie together number 4.", date: "Another Cute Moment" }
            ];

            let galleryHTML = '<div class="memory-explorer" style="width:100%;box-sizing:border-box;">';
            memories.forEach((mem, index) => {
              const shortCaption = mem.caption.length > 25 ? mem.caption.substring(0, 25) + '\u2026' : mem.caption;
              const safeCap = mem.caption.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
              const safeDt  = mem.date.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
              
              galleryHTML += `
                <div class="explorer-thumbnail" data-img="${mem.img}" data-caption="${safeCap}" data-date="${safeDt}">
                  <div class="thumbnail-frame">
                    <img src="${mem.img}" class="thumbnail-img" alt="Memory" loading="lazy">
                  </div>
                  <p class="thumbnail-caption">${shortCaption}</p>
                  <p class="thumbnail-date">${mem.date}</p>
                </div>
              `;
            });
            galleryHTML += '</div>';

            const memWin = createWindow('win-memories', "MY LIFE'S MEMORIES", 560, 580, (window.innerWidth / 2) - 280, 30, galleryHTML);

            setTimeout(() => {
              memWin.querySelectorAll('.explorer-thumbnail').forEach(card => {
                card.addEventListener('click', () => {
                  const img     = card.getAttribute('data-img');
                  const caption = card.getAttribute('data-caption');
                  const date    = card.getAttribute('data-date');
                  if (window.openPhotoModal) window.openPhotoModal(img, caption, date);
                });
              });
            }, 80);

            break;
          }
            
          case 'open-age':
            const ageWin = createWindow(
              'win-age',
              'CHECK MY AGE',
              600, 460,
              xOffset, yOffset,
              `<div class="age-card-layout">
                  <!-- Left Panel -->
                  <div class="age-card-left">
                    <div class="age-char-frame">
                      <img src="age.jpeg" alt="Adamya" class="age-char-img">
                    </div>
                    <div class="age-name-nav">
                      <span class="nav-arrow"><</span>
                      <span class="nav-name">Adamya</span>
                      <span class="nav-arrow">></span>
                    </div>
                    <div class="age-hearts">
                      <span>💖</span><span>💖</span><span>💖</span>
                    </div>
                  </div>

                  <!-- Right Panel -->
                  <div class="age-card-right">
                    <h2 class="age-scanner-title">AGE SCANNER</h2>
                    <p class="age-scanner-sub">Adamya Character Analysis</p>

                    <div class="age-stats-container">
                      <div class="age-stat-row">
                        <label>Age Detection</label>
                        <div class="age-bar-track">
                          <div class="age-fill pink" id="fill-age" style="width: 0%;"></div>
                        </div>
                      </div>
                      <div class="age-stat-row">
                        <label>Wisdom Level</label>
                        <div class="age-bar-track">
                          <div class="age-fill pink" id="fill-wisdom" style="width: 0%;"></div>
                        </div>
                      </div>
                      <div class="age-stat-row">
                        <label>Cuteness Level</label>
                        <div class="age-bar-track">
                          <div class="age-fill pink" id="fill-cuteness" style="width: 0%;"></div>
                        </div>
                      </div>
                    </div>

                    <button class="scan-btn" id="btn-scan-age">SCAN AGE</button>
                  </div>
               </div>`
            );

            // Attach Scan Logic
            setTimeout(() => {
              const scanBtn = document.getElementById('btn-scan-age');
              if (scanBtn) {
                scanBtn.onclick = () => {
                  // Step 1: Scanning Popup
                  const scanPopup = createWindow(
                    'win-scanning',
                    'Scanning...',
                    250, 140,
                    (window.innerWidth / 2) - 125,
                    (window.innerHeight / 2) - 70,
                    `<div class="center-content">
                      <p id="scanning-text" style="font-size:1.2rem;">Scanning Adamya.exe</p>
                     </div>`
                  );

                  let dots = 0;
                  const dotInterval = setInterval(() => {
                    const txt = document.getElementById('scanning-text');
                    if (txt) {
                      dots = (dots + 1) % 4;
                      txt.innerText = 'Scanning Adamya.exe' + '.'.repeat(dots);
                    }
                  }, 400);

                  // Step 2: Fill Bars
                  setTimeout(() => {
                    document.getElementById('fill-age').style.width = '100%';
                    document.getElementById('fill-wisdom').style.width = '40%';
                    document.getElementById('fill-cuteness').style.width = '100%';
                  }, 2000);

                  // Step 3: Result
                  setTimeout(() => {
                    clearInterval(dotInterval);
                    scanPopup.style.display = 'none';
                    
                    const resultWin = createWindow(
                      'win-age-result',
                      'AGE DETECTED',
                      320, 300,
                      (window.innerWidth / 2) - 160,
                      (window.innerHeight / 2) - 150,
                      `<div class="center-content">
                        <div class="result-status" style="text-align:left; width: 100%; padding-left: 20px;">
                          <p style="font-weight:bold; margin-bottom: 10px;">STATUS:</p>
                          <p class="pop-in" style="margin: 5px 0;">OLDER <span style="color:#ff0055;">✔</span></p>
                          <p class="pop-in" style="margin: 5px 0; animation-delay: 0.5s;">WISE <span style="color:#5d00a6;">❓</span></p>
                          <p class="pop-in" style="margin: 5px 0; animation-delay: 1s;">CUTE <span style="color:#ff0055;">✔✔✔</span></p>
                        </div>
                        <p style="margin-top: 20px; font-style: italic; color: #888; animation: fadeIn 2s forwards; animation-delay: 1.5s;">
                          Conclusion: still extremely adorable.
                        </p>
                        <button class="action-btn small-btn" style="margin-top: 15px;" onclick="document.getElementById('win-age-result').style.display='none'">Yay! ❤️</button>
                      </div>`
                    );

                    // Confetti Celebration
                    if (typeof triggerConfetti === 'function') {
                      setTimeout(triggerConfetti, 500);
                    }
                  }, 4000);
                };
              }
            }, 100);
            break;
            
          case 'open-belong':
            createWindow(
              'win-belong',
              'WHERE I BELONG',
              500, 600,
              xOffset - 100, yOffset,
              `<div class="belong-container">
                 <div id="reveal-screen-overlay" class="reveal-overlay">
                   <div class="answer-found">
                     <h2 style="color:#d81b60; font-family: 'Courier New';">ANSWER FOUND</h2>
                     <br>
                     <p style="font-size:1.2rem; font-weight:bold; color:#ad1457;">WHERE I BELONG:</p>
                     <p style="font-size:1.5rem; margin-top:10px; color:#e91e63;">Right next to you.</p>
                     <div style="font-size:2rem; margin-top:20px;">💖 ✨ 💖</div>
                     <button class="action-btn small-btn" style="margin-top:20px;" onclick="document.getElementById('reveal-screen-overlay').style.display='none'">❤️</button>
                   </div>
                 </div>

                 <!-- Section 1: Destiny Analyzer -->
                 <div class="destiny-panel" id="destiny-panel">
                   <div class="destiny-title">Destiny Analyzer</div>
                   <div class="input-group">
                     <label>Name 1</label>
                     <input type="text" class="destiny-input" id="name1" value="Daxita">
                   </div>
                   <div class="input-group">
                     <label>Name 2</label>
                     <input type="text" class="destiny-input" id="name2" value="Adamya">
                   </div>
                   <button class="calculate-btn" id="btn-calculate">CALCULATE DESTINY</button>
                   
                   <div class="analysis-log" id="analysis-log"></div>
                   <div class="progress-container" id="destiny-progress-wrap">
                     <div class="progress-bar" id="destiny-progress-fill"></div>
                   </div>

                   <!-- Results -->
                   <div class="result-panel" id="destiny-result">
                      <div class="destiny-title">DESTINY RESULT</div>
                      <div class="match-level">100%</div>
                      <div class="status-list">
                        <div class="status-item" id="s1">SOULMATES ✔</div>
                        <div class="status-item" id="s2">PARTNERS IN CRIME ✔</div>
                        <div class="status-item" id="s3">FOREVER TYPE ✔</div>
                      </div>
                   </div>
                 </div>

                 <!-- Section 2: Interactive Buttons -->
                 <div class="reveal-section" id="reveal-section">
                   <button class="destiny-btn" id="btn-home">
                     <div class="pixel-art-icon">
                       <svg viewBox="0 0 32 32" fill="#ff80ab">
                         <rect x="6" y="14" width="20" height="14" />
                         <polygon points="4,16 16,6 28,16" />
                         <rect x="14" y="20" width="4" height="8" fill="#d11d5a" />
                         <circle cx="24" cy="18" r="2" fill="white" />
                       </svg>
                     </div>
                     <div class="destiny-btn-text">HOME</div>
                   </button>

                   <button class="destiny-btn" id="btn-place">
                     <div class="pixel-art-icon">
                       <svg viewBox="0 0 32 32" fill="#ce93d8">
                         <rect x="4" y="22" width="24" height="6" />
                         <rect x="8" y="10" width="16" height="12" />
                         <path d="M 8 10 Q 16 2 24 10" fill="#ba68c8" />
                         <circle cx="12" cy="15" r="2" fill="white" />
                         <circle cx="20" cy="15" r="2" fill="white" />
                       </svg>
                     </div>
                     <div class="destiny-btn-text">FAVORITE PLACE</div>
                   </button>

                   <button class="destiny-btn" id="btn-belong">
                     <div class="pixel-art-icon">
                       <svg viewBox="0 0 32 32">
                         <circle cx="12" cy="12" r="6" fill="#f48fb1" />
                         <circle cx="20" cy="12" r="6" fill="#f06292" />
                         <rect x="8" y="18" width="8" height="10" fill="#f48fb1" />
                         <rect x="16" y="18" width="8" height="10" fill="#f06292" />
                         <path d="M 12 10 Q 16 6 20 10" fill="none" stroke="red" />
                       </svg>
                     </div>
                     <div class="destiny-btn-text">WHERE I BELONG</div>
                   </button>
                 </div>

                 <div class="secret-destiny-heart" id="secret-belong-heart">💖</div>
              </div>`
            );

            // Logic for Where I Belong logic
            setTimeout(() => {
              const btnCalc = document.getElementById('btn-calculate');
              const log = document.getElementById('analysis-log');
              const progressWrap = document.getElementById('destiny-progress-wrap');
              const progressFill = document.getElementById('destiny-progress-fill');
              const resultPanel = document.getElementById('destiny-result');
              const revealSection = document.getElementById('reveal-section');

              btnCalc.onclick = () => {
                btnCalc.disabled = true;
                btnCalc.style.opacity = '0.5';
                log.innerHTML = '';
                
                const messages = [
                  'Analyzing compatibility...',
                  'Checking emotional database...',
                  'Consulting the universe...'
                ];

                let msgIndex = 0;
                const msgInterval = setInterval(() => {
                  const p = document.createElement('p');
                  p.innerText = messages[msgIndex];
                  p.style.margin = '4px 0';
                  p.style.animation = 'fadeIn 0.5s forwards';
                  log.appendChild(p);
                  msgIndex++;
                  if (msgIndex === messages.length) {
                    clearInterval(msgInterval);
                    startLoading();
                  }
                }, 800);
              };

              function startLoading() {
                progressWrap.style.display = 'block';
                let width = 0;
                const loadInterval = setInterval(() => {
                  width += 2;
                  progressFill.style.width = width + '%';
                  if (width >= 100) {
                    clearInterval(loadInterval);
                    showResults();
                  }
                }, 60); // 3 seconds total
              }

              function showResults() {
                log.style.display = 'none';
                progressWrap.style.display = 'none';
                resultPanel.style.display = 'block';

                const statuses = ['s1', 's2', 's3'];
                statuses.forEach((id, i) => {
                  setTimeout(() => {
                    const item = document.getElementById(id);
                    if (item) {
                      item.style.opacity = '1';
                      item.style.transform = 'translateY(0)';
                      item.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    }
                  }, 500 * (i + 1));
                });

                setTimeout(() => {
                  if (typeof spawnHearts === 'function') spawnHearts();
                  revealSection.style.display = 'flex';
                  setTimeout(() => {
                    revealSection.style.opacity = '1';
                  }, 100);
                }, 2000);
              }

              // Buttons Interaction
              document.getElementById('btn-home').onclick = () => {
                createWindow('win-destiny-msg', 'HOME', 300, 150, window.innerWidth/2-150, window.innerHeight/2-75,
                  '<div class="center-content"><p style="font-size:1.1rem;">"Anywhere with you feels like home."</p></div>');
              };

              document.getElementById('btn-place').onclick = () => {
                createWindow('win-destiny-msg', 'PLACE', 300, 150, window.innerWidth/2-150, window.innerHeight/2-75,
                  '<div class="center-content"><p style="font-size:1.1rem;">"Probably wherever we are eating together."</p></div>');
              };

              document.getElementById('btn-belong').onclick = () => {
                const overlay = document.getElementById('reveal-screen-overlay');
                overlay.style.display = 'flex';
                if (typeof spawnHearts === 'function') spawnHearts();
              };

              document.getElementById('secret-belong-heart').onclick = () => {
                createWindow('win-secret-found', 'SECRET FOUND', 350, 250, window.innerWidth/2-175, window.innerHeight/2-125,
                  `<div class="center-content">
                    <p style="font-size:1.1rem; color:#d81b60; font-weight:bold;">SECRET FOUND</p>
                    <p style="margin: 10px 0;">"You unlocked bonus girlfriend affection."</p>
                    <div style="background:#fff0f5; border:1px dashed var(--bubblegum); padding:10px; border-radius:10px; margin-top:10px; font-family: monospace; font-size:0.85rem;">
                      <p style="color:#ad1457; font-weight:bold; margin-bottom:5px;">SYSTEM MESSAGE</p>
                      Adamya,<br>Thank you for choosing<br>DaxitaOS<br>as your default girlfriend.
                    </div>
                    <div style="font-size:1.2rem; margin-top:10px;">💖 💖 💖</div>
                  </div>`
                );
                if (typeof spawnHearts === 'function') spawnHearts();
              };
            }, 100);
            break;
            
          case 'open-explorer':
            createWindow(
              'win-explorer',
              'GFLAND EXPLORER',
              600, 500,
              xOffset + 50, yOffset,
              `<div id="gfland-map">
                <div class="map-island"></div>
                
                <!-- SVG Paths between locations for a more "mapped" feel -->
                <svg class="map-paths" viewBox="0 0 600 400">
                  <path d="M 100 85 L 270 120 L 440 95 L 470 345 L 140 345 Z" 
                        fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-dasharray="8,8" />
                </svg>

                <!-- Decorative Deco -->
                <div class="map-deco" style="left: 180px; top: 120px;">🌳</div>
                <div class="map-deco" style="left: 350px; top: 80px;">🌸</div>
                <div class="map-deco" style="left: 500px; top: 150px;">🌳</div>
                <div class="map-deco" style="left: 200px; top: 300px;">🌸</div>
                <div class="map-deco" style="left: 400px; top: 350px;">🌳</div>

                <div class="gf-ui">STARS: <span id="star-count">0</span> / 5</div>
                <div class="gf-prompt" id="map-prompt">PRESS ENTER TO EXPLORE</div>
                
                <!-- Locations -->
                <div class="gf-location" style="left: 80px; top: 60px;" id="loc-1">
                  <div class="loc-icon-container"><span class="loc-icon">☕</span></div>
                  <span class="loc-label">First Date Café</span>
                </div>
                <div class="gf-location" style="left: 250px; top: 100px;" id="loc-2">
                  <div class="loc-icon-container"><span class="loc-icon">🏠</span></div>
                  <span class="loc-label">Scooby's House</span>
                </div>
                <div class="gf-location" style="left: 420px; top: 70px;" id="loc-3">
                  <div class="loc-icon-container"><span class="loc-icon">⛰️</span></div>
                  <span class="loc-label">Selfie Mountain</span>
                </div>
                <div class="gf-location" style="left: 120px; top: 280px;" id="loc-4">
                  <div class="loc-icon-container"><span class="loc-icon">🍔</span></div>
                  <span class="loc-label">Foodie Street</span>
                </div>
                <div class="gf-location" style="left: 450px; top: 280px;" id="loc-5">
                  <div class="loc-icon-container"><span class="loc-icon">🏙️</span></div>
                  <span class="loc-label">Future City</span>
                </div>

                <!-- Stars -->
                <div class="gf-star" style="left: 150px; top: 180px;" data-star="1">⭐</div>
                <div class="gf-star" style="left: 320px; top: 150px;" data-star="2">⭐</div>
                <div class="gf-star" style="left: 480px; top: 180px;" data-star="3">⭐</div>
                <div class="gf-star" style="left: 200px; top: 380px;" data-star="4">⭐</div>
                <div class="gf-star" style="left: 380px; top: 280px;" data-star="5">⭐</div>

                <!-- Secret -->
                <div class="secret-heart" style="left: 300px; top: 200px;" id="gf-secret">💖</div>

                <!-- Player -->
                <div class="gf-player" id="gf-player" style="left: 50px; top: 50px;">
                  <span class="player-sprite">👧</span>
                  <span class="player-name">DAXITA</span>
                </div>
             </div>`
            );

            // Map Game Logic
            setTimeout(() => {
              const player = document.getElementById('gf-player');
              const map = document.getElementById('gfland-map');
              const prompt = document.getElementById('map-prompt');
              const starCountEl = document.getElementById('star-count');
              
              let pX = 50;
              let pY = 50;
              let starsFound = 0;
              let currentLoc = null;
              let gameFinished = false;

              const locs = [
                { id: 'loc-1', name: 'First Date Café', text: 'The place where everything started.' },
                { id: 'loc-2', name: "Scooby's House", text: 'The day Scooby joined our world.' },
                { id: 'loc-3', name: 'Selfie Mountain', text: 'Peak selfie performance achieved.' },
                { id: 'loc-4', name: 'Foodie Street', text: 'Where we gained relationship weight together.' },
                { id: 'loc-5', name: 'Future City', text: 'Loading future memories...' }
              ];

              const move = (dx, dy) => {
                const newX = Math.max(0, Math.min(560, pX + dx));
                const newY = Math.max(0, Math.min(360, pY + dy));
                pX = newX;
                pY = newY;
                player.style.left = pX + 'px';
                player.style.top = pY + 'px';
                checkCollisions();
              };

              const checkCollisions = () => {
                // Check Stars
                document.querySelectorAll('.gf-star').forEach(star => {
                  const sX = parseInt(star.style.left);
                  const sY = parseInt(star.style.top);
                  const dist = Math.hypot(pX - sX, pY - sY);
                  if (dist < 25) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle-pop';
                    sparkle.innerHTML = '✨';
                    sparkle.style.left = sX + 'px';
                    sparkle.style.top = sY + 'px';
                    map.appendChild(sparkle);
                    star.remove();
                    starsFound++;
                    starCountEl.innerText = starsFound;
                    setTimeout(() => sparkle.remove(), 600);
                    
                    if (starsFound === 5 && !gameFinished) {
                      gameFinished = true;
                      setTimeout(() => {
                        createWindow('win-letter', 'LOVE LETTER UNLOCKED', 350, 200, window.innerWidth/2-175, window.innerHeight/2-100,
                          `<div class="center-content">
                            <p style="font-size:1.1rem; line-height:1.4;">"Thank you for being my favorite person in this world."</p>
                            <div style="font-size:1.5rem; margin-top:10px;">💖 ✨ 💖</div>
                          </div>`
                        );
                      }, 500);
                    }
                  }
                });

                // Check Secret Heart
                const secret = document.getElementById('gf-secret');
                if (secret) {
                  const hX = parseInt(secret.style.left);
                  const hY = parseInt(secret.style.top);
                  if (Math.hypot(pX - hX, pY - hY) < 20) {
                    secret.remove();
                    createWindow('win-secret-found', 'SECRET FOUND', 300, 180, window.innerWidth/2-150, window.innerHeight/2-90,
                      `<div class="center-content">
                        <p style="font-size:1.1rem;">You unlocked bonus girlfriend affection.</p>
                        <div style="font-size:2rem; margin-top:10px;">🥰</div>
                      </div>`
                    );
                  }
                }

                // Check Locations
                let nearby = null;
                locs.forEach(l => {
                  const el = document.getElementById(l.id);
                  const lX = parseInt(el.style.left);
                  const lY = parseInt(el.style.top);
                  const dist = Math.hypot(pX - lX, pY - lY);
                  if (dist < 40) {
                    nearby = l;
                    el.classList.add('nearby');
                  } else {
                    el.classList.remove('nearby');
                  }
                });

                currentLoc = nearby;
                prompt.style.display = nearby ? 'block' : 'none';
              };

              const handleKeys = (e) => {
                if (document.getElementById('win-explorer').style.display === 'none') return;
                
                if (e.key === 'ArrowUp' || e.key === 'w') move(0, -15);
                if (e.key === 'ArrowDown' || e.key === 's') move(0, 15);
                if (e.key === 'ArrowLeft' || e.key === 'a') move(-15, 0);
                if (e.key === 'ArrowRight' || e.key === 'd') move(15, 0);
                
                if (e.key === 'Enter' && currentLoc) {
                  createWindow('win-loc-info', currentLoc.name, 450, 150, window.innerWidth/2-225, window.innerHeight/2-75,
                    `<div class="center-content" style="overflow:hidden;">
                      <p style="font-size:1.1rem; padding: 0 10px; white-space: nowrap;">"${currentLoc.text}"</p>
                      <button class="action-btn small-btn" style="margin-top:15px;" onclick="document.getElementById('win-loc-info').style.display='none'">Cute! ❤️</button>
                    </div>`
                  );
                }
              };

              window.addEventListener('keydown', handleKeys);
              
              // Cleanup on close
            const closeBtn = document.querySelector('#win-explorer .btn-close');
            if (closeBtn) {
              const oldClick = closeBtn.onclick;
              closeBtn.onclick = () => {
                window.removeEventListener('keydown', handleKeys);
                if (oldClick) oldClick();
              };
            }
            }, 100);
            
            break;
        }
      });
    });
  
  
    // ==========================================
    // Hidden Feature: Hidden Affection Protocol
    // ==========================================
    let desktopClickCount = 0;
    
    document.body.addEventListener('click', (e) => {
      // DO NOT count clicks on windows, desktop icons, or the start button
      const isUI = e.target.closest('.os-window') || 
                   e.target.closest('.desktop-icon') || 
                   e.target.closest('.action-btn');
      
      if(!isUI) {
        desktopClickCount++;
        if(desktopClickCount === 5) {
          triggerAffectionProtocol(e);
          desktopClickCount = 0; // Reset counter
        }
      } else {
        // Reset counter if they click a window/icon
        desktopClickCount = 0;
      }
    });

    function triggerAffectionProtocol(e) {
      createWindow(
        'win-affection', 
        'SECRET FOUND', 
        320, 220, 
        (window.innerWidth / 2) - 160, 
        (window.innerHeight / 2) - 110, 
        `<div class="center-content">
           <p style="font-size: 1.2rem; margin-bottom: 10px;">"You discovered Daxita's hidden affection protocol."</p>
           <p style="font-size: 0.9rem; color: #888; font-style: italic; margin-bottom: 20px;">
             "Adamya, you are loved more than this OS can compute."
           </p>
           <button class="action-btn small-btn" onclick="document.getElementById('win-affection').style.display='none'">OK</button>
         </div>`
      );
      
      // Trigger visual effects
      if (typeof spawnHearts === 'function') spawnHearts(e);
      if (typeof spawnSparkles === 'function') spawnSparkles(e);
    }

    // Sparkle Effect
    window.spawnSparkles = function(e) {
      for(let i = 0; i < 15; i++) {
        spawnParticle(['✨', '⭐', '✨'], e ? e.clientX : window.innerWidth/2, e ? e.clientY : window.innerHeight/2);
      }
    };
  
    // ==========================================
    // Particle Effects
    // ==========================================
    function triggerConfetti() {
      for(let i = 0; i < 30; i++) {
        spawnParticle(['\ud83c\udf89', '\ud83c\udf82', '\u2728', '\ud83d\udc96', '\ud83c\udf88']);
      }
    }
  
    window.spawnHearts = function(e) {
      for(let i = 0; i < 15; i++) {
        spawnParticle(['\ud83d\udc96', '\ud83d\udc97', '\ud83d\udc95'], e ? e.clientX : window.innerWidth/2, e ? e.clientY : window.innerHeight/2);
      }
    };
  
    function spawnParticle(emojis, startX, startY) {
      const p = document.createElement('div');
      p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      p.className = 'floating-heart';
      const x = startX !== undefined ? startX : (window.innerWidth / 2) + ((Math.random() - 0.5) * 200);
      const y = startY !== undefined ? startY : (window.innerHeight / 2) + ((Math.random() - 0.5) * 100);
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      confettiContainer.appendChild(p);
      setTimeout(() => {
        if(p.parentNode) p.parentNode.removeChild(p);
      }, 3000);
    }
  
  
    // ==========================================
    // Final Shutdown Sequence
    // ==========================================
    const shutdownBtn = document.getElementById('btn-shutdown');
    const shutdownScreen = document.getElementById('shutdown-screen');
  
    shutdownBtn.addEventListener('click', () => {
      shutdownScreen.classList.remove('hidden');
    });
  
    // ==========================================
    // Photo Modal Logic
    // ==========================================
    const photoModal     = document.getElementById('photo-modal');
    const modalImg       = document.getElementById('modal-photo');
    const modalCaption   = document.getElementById('modal-caption');
    const modalDate      = document.getElementById('modal-date');
    const btnCloseModal  = document.getElementById('btn-close-modal');
  
    if(photoModal) {
      window.openPhotoModal = function(src, caption, date) {
        modalImg.src = src;
        modalCaption.innerText = caption;
        modalDate.innerText    = date;
        photoModal.classList.add('active');
        highestZIndex++;
        photoModal.style.zIndex = highestZIndex;
        // Fix: recover content if the `x` button set it to display: none
        const content = photoModal.querySelector('.photo-modal-content');
        if (content) content.style.display = '';
      };
  
      btnCloseModal.addEventListener('click', () => {
        photoModal.classList.remove('active');
      });
  
      photoModal.addEventListener('click', (e) => {
        if(e.target === photoModal) {
          photoModal.classList.remove('active');
        }
      });
    }

    // ==========================================
    // mood.mp3 Logic
    // ==========================================
    const moodAudio = document.getElementById('mood-audio');
    const playMoodBtn = document.getElementById('btn-play-mood');
    const pauseMoodBtn = document.getElementById('btn-pause-mood');
    const progressFill = document.getElementById('mood-progress-fill');
    
    if (moodAudio && playMoodBtn && pauseMoodBtn) {
      const startTime = 145; // 2:25
      const endTime = 173;   // 2:53
      
      playMoodBtn.addEventListener('click', () => {
        console.log('Play clicked. Current time:', moodAudio.currentTime);
        try {
          if (moodAudio.currentTime < startTime || moodAudio.currentTime > endTime) {
            console.log('Seeking to segment start:', startTime);
            moodAudio.currentTime = startTime;
          }
          
          let playPromise = moodAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Playback failed/blocked:", error);
              // Fallback: If seeking failed or blocked, try to just play from start
              if (moodAudio.currentTime !== 0) {
                 console.log("Attempting fallback play from 0");
                 moodAudio.currentTime = 0;
                 moodAudio.play();
              }
            });
          }
        } catch (err) {
          console.error("Critical audio error:", err);
        }
      });
      
      pauseMoodBtn.addEventListener('click', () => {
        console.log('Pause clicked');
        moodAudio.pause();
      });
      
      moodAudio.addEventListener('timeupdate', () => {
        if (moodAudio.currentTime >= endTime) {
          console.log('End of segment reached. Pausing.');
          moodAudio.pause();
          moodAudio.currentTime = startTime; // reset to start
        }
        // Update progress bar visually
        let currentRange = moodAudio.currentTime - startTime;
        let totalRange = endTime - startTime;
        
        if (currentRange < 0) currentRange = 0;
        let percentage = (totalRange > 0) ? (currentRange / totalRange) * 100 : 0;
        if (percentage > 100) percentage = 100;
        
        if(progressFill) {
          progressFill.style.width = percentage + '%';
        }
      });

      // Log load errors
      moodAudio.addEventListener('error', (e) => {
        console.error("Audio Load Error:", moodAudio.error);
      });
    }

  // ==========================================
  // IMPORTANT Popup Logic
  // ==========================================
  const impWin = document.getElementById('win-important');
  if (impWin) {
    const tabBtns = impWin.querySelectorAll('.tab-btn');
    const tabs = impWin.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabs.forEach(t => {
          if (t.id === target) {
            t.classList.remove('hidden-tab');
          } else {
            t.classList.add('hidden-tab');
          }
        });
      });
    });

    // July 20 Warning Interaction
    const bdayCard = document.getElementById('card-july-20');
    if (bdayCard) {
      bdayCard.addEventListener('click', () => {
        createWindow(
          'win-warning', 
          'WARNING', 
          320, 240, 
          (window.innerWidth / 2) - 160, 
          (window.innerHeight / 2) - 120, 
          `<div class="center-content">
             <div style="font-size:3rem; margin-bottom:10px;">🎂⚠️</div>
             <p style="font-weight:bold; color:#ad1457; margin-bottom:10px;">Girlfriend Birthday Detected</p>
             <p style="font-size:0.9rem; line-height:1.4; color:#555;">
               Forgetting this date may result in:<br>
               • emotional damage<br>
               • reduced cuddles<br>
               • emergency apology missions
             </p>
             <button class="action-btn small-btn" style="margin-top:15px;" onclick="document.getElementById('win-warning').style.display='none'">I promise to remember! ❤️</button>
           </div>`
        );
      });
    }

    // Ambient Sparkles in IMPORTANT popup
    setInterval(() => {
      if (impWin.style.display !== 'none') {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-pop';
        sparkle.innerHTML = '✨';
        sparkle.style.left = (Math.random() * 250 + 20) + 'px';
        sparkle.style.top = (Math.random() * 300 + 50) + 'px';
        impWin.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
      }
    }, 4000);
  }

});
