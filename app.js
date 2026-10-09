// XYZ Platform Simulation Engine

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let state = {
        creatorBalance: 1240.4827,
        viewerBalance: 0.0542,
        earningsRate: 0.015, // in ₹ per second
        impressionsCount: 27566280,
        isKYCVerified: false,
        isPlaying: true,
        currentVideoIndex: 0,
        currentSlideIndex: 0,
        playerProgress: 0,
        videosList: [
            {
                title: "Decolonizing Indian Creator Finance",
                author: "@harsh_creates",
                category: "Education",
                views: 245000,
                cpm: 120,
                likes: "12.4K"
            },
            {
                title: "Making a Living Off 0.1 Paisa Payouts",
                author: "@paisa_master",
                category: "Tech",
                views: 84000,
                cpm: 90,
                likes: "8.1K"
            },
            {
                title: "Rejection by AXIOS Head: A VC Story",
                author: "@funding_seeker",
                category: "Comedy",
                views: 310000,
                cpm: 60,
                likes: "42.0K"
            },
            {
                title: "How Ad-Splits Drive Platform Growth",
                author: "@finance_guru",
                category: "Lifestyle",
                views: 43000,
                cpm: 150,
                likes: "5.2K"
            }
        ]
    };

    // --- TAB SYSTEM CONFIGURATION ---
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            // Toggle Nav Active Class
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Toggle Panel Active Class
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-${tabId}`) {
                    panel.classList.add('active');
                }
            });

            // If switching away from Viewer Hub, pause viewer earnings progress
            if (tabId !== 'viewer') {
                state.isPlaying = false;
                updatePlayPauseUI();
            } else {
                state.isPlaying = true;
                updatePlayPauseUI();
            }
        });
    });

    // --- LIVE WALLET UPDATE ENGINE ---
    // Update every 100ms
    setInterval(() => {
        // 1. Simulate general audience views/impressions globally
        if (Math.random() > 0.4) {
            state.impressionsCount += Math.floor(Math.random() * 4) + 1;
            document.getElementById('creator-impressions').innerText = formatIndianNumber(state.impressionsCount);
        }

        // 2. Creator Earnings Increment (representing organic video feed traffic)
        state.creatorBalance += state.earningsRate / 10;
        updateCreatorBalanceUI();

        // 3. Viewer Attention Rewards Ticker (if watching reels)
        if (state.isPlaying && document.getElementById('tab-viewer').classList.contains('active')) {
            // Viewer earns 0.05 paisa (₹0.0005) per second => ₹0.00005 per 100ms
            state.viewerBalance += 0.00005;
            updateViewerBalanceUI();

            // Progress bar simulation
            state.playerProgress += 2; // complete in 5 seconds (100ms * 50 ticks)
            if (state.playerProgress > 100) {
                state.playerProgress = 0;
                logAttentionReward(0.0025); // Log transaction detail (2.5 paisa accumulated)
            }
            document.getElementById('player-progress').style.width = `${state.playerProgress}%`;
        }
    }, 100);

    function updateCreatorBalanceUI() {
        const valStr = state.creatorBalance.toFixed(4);
        const parts = valStr.split('.');
        
        document.getElementById('header-creator-balance').innerText = `₹${parseFloat(valStr).toFixed(2)}`;
        document.getElementById('creator-integer').innerText = parts[0];
        document.getElementById('creator-fraction').innerText = parts[1];
    }

    function updateViewerBalanceUI() {
        const valStr = state.viewerBalance.toFixed(4);
        document.getElementById('header-viewer-balance').innerText = `₹${parseFloat(valStr).toFixed(2)}`;
        document.getElementById('viewer-wallet-val').innerText = valStr;
    }

    function logAttentionReward(amount) {
        const logsList = document.getElementById('viewer-logs');
        // Remove empty placeholder
        const emptyItem = logsList.querySelector('.empty');
        if (emptyItem) {
            logsList.innerHTML = '';
        }

        const log = document.createElement('li');
        log.className = 'log-item';
        log.innerHTML = `
            <span>Earned Attention Reward (Watch Time)</span>
            <strong class="text-neon-green">+₹${amount.toFixed(4)}</strong>
        `;
        logsList.insertBefore(log, logsList.firstChild);

        // Cap logs count
        if (logsList.children.length > 5) {
            logsList.removeChild(logsList.lastChild);
        }
    }

    // --- REEL/PLAYER SIMULATOR ---
    const playerViewport = document.getElementById('player-viewport');
    const playPauseBtn = document.getElementById('play-pause-btn');

    function updateVideoDisplay() {
        const video = state.videosList[state.currentVideoIndex];
        document.getElementById('player-title').innerText = video.title;
        document.getElementById('player-author').innerText = video.author;
        document.getElementById('player-category').innerText = video.category;
        document.getElementById('player-likes').innerText = video.likes;
        
        // Dynamic backgrounds based on video categories for distinct visual feel
        const bg = document.getElementById('video-visual-bg');
        if (video.category === 'Education') {
            bg.innerHTML = `<div class="gradient-animation-bg" style="background: linear-gradient(45deg, #1e1b4b, #2d0645, #0f2b3b);"></div>`;
        } else if (video.category === 'Tech') {
            bg.innerHTML = `<div class="gradient-animation-bg" style="background: linear-gradient(45deg, #022c22, #0d303b, #1b2336);"></div>`;
        } else if (video.category === 'Comedy') {
            bg.innerHTML = `<div class="gradient-animation-bg" style="background: linear-gradient(45deg, #4c0519, #2e0854, #180828);"></div>`;
        } else {
            bg.innerHTML = `<div class="gradient-animation-bg" style="background: linear-gradient(45deg, #3b0764, #1e1b4b, #030712);"></div>`;
        }
        
        state.playerProgress = 0;
    }

    function updatePlayPauseUI() {
        if (state.isPlaying) {
            playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
        } else {
            playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i> Play`;
        }
    }

    playPauseBtn.addEventListener('click', () => {
        state.isPlaying = !state.isPlaying;
        updatePlayPauseUI();
    });

    document.getElementById('next-video-btn').addEventListener('click', () => {
        state.currentVideoIndex = (state.currentVideoIndex + 1) % state.videosList.length;
        updateVideoDisplay();
    });

    document.getElementById('prev-video-btn').addEventListener('click', () => {
        state.currentVideoIndex = (state.currentVideoIndex - 1 + state.videosList.length) % state.videosList.length;
        updateVideoDisplay();
    });

    // --- TIP CREATOR INTERACTION ---
    const tipBtns = document.querySelectorAll('.tip-option-btn');
    tipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tipVal = parseFloat(btn.getAttribute('data-tip'));
            executeTip(tipVal);
        });
    });

    document.getElementById('btn-submit-tip').addEventListener('click', () => {
        const inputTip = document.getElementById('custom-tip-amount');
        const tipVal = parseFloat(inputTip.value);
        if (isNaN(tipVal) || tipVal <= 0) {
            showToast("Please enter a valid tip amount", "error");
            return;
        }
        executeTip(tipVal);
        inputTip.value = '';
    });

    function executeTip(amount) {
        if (state.viewerBalance < amount) {
            showToast("Insufficient balance in Viewer Attention Wallet!", "error");
            return;
        }
        
        // Perform off-chain ledger transfer
        state.viewerBalance -= amount;
        state.creatorBalance += amount;
        updateViewerBalanceUI();
        updateCreatorBalanceUI();
        
        // Log transaction
        const logsList = document.getElementById('viewer-logs');
        const emptyItem = logsList.querySelector('.empty');
        if (emptyItem) logsList.innerHTML = '';
        
        const log = document.createElement('li');
        log.className = 'log-item';
        log.style.borderColor = 'rgba(124, 58, 237, 0.3)';
        log.innerHTML = `
            <span>Tipped ${state.videosList[state.currentVideoIndex].author}</span>
            <strong style="color: var(--primary-light)">-₹${amount.toFixed(4)}</strong>
        `;
        logsList.insertBefore(log, logsList.firstChild);

        // Flash message
        const successMsg = document.getElementById('tip-success-msg');
        successMsg.innerText = `Tip of ₹${amount.toFixed(4)} sent with 0 transaction fees!`;
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 3000);

        showToast(`Tipped ₹${amount.toFixed(4)} to creator!`, "success");
    }

    // --- MOCK CONTENT UPLOAD FORM ---
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('video-title').value;
        const category = document.getElementById('video-category').value;
        const cpm = parseFloat(document.getElementById('ad-cpm').value);

        const newVideo = {
            title: title,
            author: "@harsh_creates",
            category: category,
            views: 0,
            cpm: cpm,
            likes: "0"
        };

        // Add to state and tables
        state.videosList.push(newVideo);
        renderCreatorVideosTable();
        
        // Adjust creator metrics earnings rate based on uploaded videos
        state.earningsRate += (cpm / 8000); // Higher CPM = Higher live incremental rate simulation
        document.getElementById('earnings-rate').innerText = `₹${state.earningsRate.toFixed(3)}/sec`;

        uploadForm.reset();
        showToast("Video published to feed!", "success");
    });

    function renderCreatorVideosTable() {
        const tbody = document.getElementById('creator-videos-table');
        tbody.innerHTML = '';

        state.videosList.forEach((video, index) => {
            // gross ad revenue = (views / 1000) * cpm
            const gross = (video.views / 1000) * video.cpm;
            const netPayout = gross * 0.5; // 50% split

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <span class="cell-title">${video.title}</span>
                    <span class="cell-secondary">${video.author}</span>
                </td>
                <td><span class="badge badge-accent">${video.category}</span></td>
                <td>${formatIndianNumber(video.views)}</td>
                <td>₹${video.cpm.toFixed(2)}</td>
                <td>₹${gross.toFixed(2)}</td>
                <td class="text-neon-green">₹${netPayout.toFixed(4)}</td>
                <td><span class="badge badge-success">MONETIZED</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --- DAILY WITHDRAWAL SYSTEM (UPI) ---
    const withdrawalForm = document.getElementById('withdrawal-form');
    const withdrawalStatus = document.getElementById('withdrawal-status');
    const withdrawAmountInput = document.getElementById('withdraw-amount');

    document.getElementById('btn-max-withdraw').addEventListener('click', () => {
        withdrawAmountInput.value = state.creatorBalance.toFixed(4);
    });

    withdrawalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const upi = document.getElementById('withdraw-upi').value;
        const amount = parseFloat(withdrawAmountInput.value);

        if (amount > state.creatorBalance) {
            showToast("Amount exceeds your available Creator Ledger balance!", "error");
            return;
        }

        // RBI Mandate Check: Check if KYC is completed
        if (!state.isKYCVerified) {
            showToast("RBI Mandate Violation: Please complete PAN KYC Verification first!", "error");
            
            // Auto redirect or highlight KYC Console
            const consoleBox = document.getElementById('kyc-console');
            consoleBox.innerHTML = `
                <span class="console-line text-danger">ERROR: TRANSACTION REJECTED BY ESCROW BOARD</span>
                <span class="console-line text-warning">REASON: Section 194R PML Act requires KYC identity check for cumulative transaction clearing.</span>
                <span class="console-line text-muted">Awaiting PAN verification form submit in RBI KYC Center tab...</span>
            `;
            return;
        }

        // If verified, proceed with settlement spinner simulation
        withdrawalStatus.classList.remove('hidden');
        document.querySelector('#withdrawal-form button').disabled = true;

        setTimeout(() => {
            state.creatorBalance -= amount;
            updateCreatorBalanceUI();
            
            withdrawalStatus.classList.add('hidden');
            document.querySelector('#withdrawal-form button').disabled = false;
            withdrawalForm.reset();

            showToast(`Settlement of ₹${amount.toFixed(2)} processed to UPI: ${upi}`, "success");
            
            // Console log
            const consoleBox = document.getElementById('kyc-console');
            const logLine = document.createElement('span');
            logLine.className = 'console-line text-neon-green';
            logLine.innerText = `Cleared payout batch node. Settled ₹${amount.toFixed(4)} via IMPS API. Flat fee charged to platform: ₹0.15.`;
            consoleBox.appendChild(logLine);
        }, 2000);
    });

    // --- RBI KYC CENTER ACTIONS ---
    const kycForm = document.getElementById('kyc-verification-form');
    const kycConsole = document.getElementById('kyc-console');
    const kycBadgeStatus = document.getElementById('kyc-badge-status');

    kycForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('kyc-name').value.toUpperCase();
        const pan = document.getElementById('kyc-pan').value.toUpperCase();
        const aadhaar = document.getElementById('kyc-aadhaar').value.replace(/\s+/g, '');
        const upi = document.getElementById('kyc-bank-upi').value;

        // PAN Regex Validation (RBI/Income Tax format)
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan)) {
            showToast("Invalid PAN format! (Must be e.g. ABCDE1234F)", "error");
            kycConsole.innerHTML = `<span class="console-line text-danger">VALIDATION EXCEPTION: NSDL format mismatch on string "${pan}". Code: 403-NSDL.</span>`;
            return;
        }

        // Aadhaar check
        if (aadhaar.length !== 12 || isNaN(aadhaar)) {
            showToast("Aadhaar must be exactly 12 digits!", "error");
            return;
        }

        // If validated, trigger compliance onboarding sequence animation in console
        kycConsole.innerHTML = '';
        const lines = [
            `Connecting to NSDL PAN validation node...`,
            `Validating PAN: ${pan} under holder name: ${name}...`,
            `NSDL Match Status: VERIFIED. Holder verified as ACTIVE taxpayer.`,
            `Initiating UIDAI OTP Mock Gateway for Aadhaar ending ${aadhaar.slice(-4)}...`,
            `Aadhaar Handshake complete. Status: MATCHED.`,
            `Creating RBI compliance nodal ledger profile. Escrow Routing Active.`,
            `SUCCESS: KYC verification established. Daily UPI settlements unlocked.`
        ];

        let lineIdx = 0;
        const renderNextConsoleLine = () => {
            if (lineIdx < lines.length) {
                const line = document.createElement('span');
                line.className = 'console-line';
                if (lineIdx === 2 || lineIdx === 4) line.className += ' text-accent';
                if (lineIdx === 6) line.className += ' text-neon-green';
                line.innerText = lines[lineIdx];
                kycConsole.appendChild(line);
                kycConsole.scrollTop = kycConsole.scrollHeight;
                lineIdx++;
                setTimeout(renderNextConsoleLine, 600);
            } else {
                // Done
                state.isKYCVerified = true;
                kycBadgeStatus.className = 'verification-status-pill verified';
                kycBadgeStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> KYC VERIFIED`;
                showToast("RBI KYC Onboarding Complete!", "success");
            }
        };

        renderNextConsoleLine();
    });

    // --- RBI ACCORDION TRIGGER ---
    const accTriggers = document.querySelectorAll('.accordion-trigger');
    accTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('i');
            
            // Toggle open
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.paddingTop = '0px';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = '10px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // --- INVESTOR PITCH SLIDES ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.deck-dots .dot');
    const prevSlideBtn = document.getElementById('prev-slide-btn');
    const nextSlideBtn = document.getElementById('next-slide-btn');

    function updateSlideDisplay() {
        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            dots[idx].classList.remove('active');
            if (idx === state.currentSlideIndex) {
                slide.classList.add('active');
                dots[idx].classList.add('active');
            }
        });
        document.getElementById('slide-num').innerText = state.currentSlideIndex + 1;
    }

    nextSlideBtn.addEventListener('click', () => {
        state.currentSlideIndex = (state.currentSlideIndex + 1) % slides.length;
        updateSlideDisplay();
    });

    prevSlideBtn.addEventListener('click', () => {
        state.currentSlideIndex = (state.currentSlideIndex - 1 + slides.length) % slides.length;
        updateSlideDisplay();
    });

    // --- REVENUE SCALING CALCULATOR ---
    const rangeDau = document.getElementById('range-dau');
    const rangeViews = document.getElementById('range-views');
    const rangeCpm = document.getElementById('range-cpm');

    function updateCalculator() {
        const dau = parseInt(rangeDau.value);
        const views = parseInt(rangeViews.value);
        const cpm = parseFloat(rangeCpm.value);

        // Display current values
        document.getElementById('val-dau').innerText = formatIndianNumber(dau);
        document.getElementById('val-views').innerText = views;
        document.getElementById('val-cpm').innerText = `₹${cpm}`;

        // Compute Math
        const totalViewsDaily = dau * views;
        const totalAdRevenueDaily = (totalViewsDaily / 1000) * cpm;
        const creatorPoolDaily = totalAdRevenueDaily * 0.5;
        const platformPoolDaily = totalAdRevenueDaily * 0.5;
        
        // Est. UPI batch clearing costs (batch routing flat rate estimation)
        // Assume 1 in 10 active users trigger a batch settlement daily, each settlement costs ₹0.15 flat
        const estimatedSettlements = (dau * 0.05); // 5% active cashouts daily
        const totalSettlementFeesDaily = estimatedSettlements * 0.15; 

        const netPlatformProfitDaily = platformPoolDaily - totalSettlementFeesDaily;
        const netPlatformProfitMonthly = netPlatformProfitDaily * 30;

        // Render calculations
        document.getElementById('calc-total-rev').innerText = `₹${formatIndianNumber(Math.round(totalAdRevenueDaily))}`;
        document.getElementById('calc-creator-pool').innerText = `₹${formatIndianNumber(Math.round(creatorPoolDaily))}`;
        document.getElementById('calc-platform-pool').innerText = `₹${formatIndianNumber(Math.round(platformPoolDaily))}`;
        document.getElementById('calc-fees').innerText = `₹${formatIndianNumber(Math.round(totalSettlementFeesDaily))} (Batch Clearing)`;
        document.getElementById('calc-net-monthly').innerText = `₹${formatIndianNumber(Math.round(netPlatformProfitMonthly))}`;
    }

    [rangeDau, rangeViews, rangeCpm].forEach(slider => {
        slider.addEventListener('input', updateCalculator);
    });


    // --- HELPERS ---
    function formatIndianNumber(x) {
        // Formats numbers according to Indian counting system: Lakhs and Crores (e.g. 10,00,000)
        x = x.toString();
        let lastThree = x.substring(x.length - 3);
        let otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    }

    function showToast(message, type = 'info') {
        const toast = document.getElementById('alert-toast');
        const msgEl = toast.querySelector('.alert-message');
        
        toast.className = `alert-toast ${type}`;
        msgEl.innerText = message;
        toast.classList.remove('hidden');

        // Auto hide after 3.5 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3500);
    }

    // --- INITIALIZE VIEWS ---
    updateVideoDisplay();
    renderCreatorVideosTable();
    updateCalculator();
});
