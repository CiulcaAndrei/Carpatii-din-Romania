// Funcția pentru meniul mobil
function myFunction() {
    const nav = document.getElementById('myTopnav');
    if (!nav) {
        console.error('Navigation element not found');
        return;
    }
    nav.classList.toggle('responsive');
}

function setupStickyNav() {
    const nav = document.querySelector('.topnav');
    if (!nav) return;

    let lastScrollTop = 0;
    let isThrottled = false;

    window.addEventListener('scroll', () => {
        if (isThrottled) return;
        isThrottled = true;
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;

            if (nav.classList.contains('responsive')) {
                nav.classList.remove('responsive');
            }

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.classList.add('nav-collapsed');
            } else {
                nav.classList.remove('nav-collapsed');
            }

            lastScrollTop = scrollTop;
            isThrottled = false;
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav.classList.remove('responsive');
        }
    });
}

function setupBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('visible', window.pageYOffset > 300);
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');

    if (!modal || !modalImg || !modalCaption || !element) {
        return;
    }

    const img = element.querySelector('img');
    const captionElement = element.querySelector('.home-gallery-caption, .gallery-caption');

    if (!img) return;

    modalImg.src = img.src;
    modalCaption.textContent = captionElement ? captionElement.textContent : img.alt || '';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    const modal = document.getElementById('imageModal');
    if (!modal || !event) return;

    if (event.target.classList.contains('modal') || event.target.classList.contains('close-modal')) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function setupFactDetailsToggle() {
    const factToggles = document.querySelectorAll('.fact-toggle');
    factToggles.forEach(toggle => {
        const item = toggle.closest('.fact-item');
        if (!item) return;

        const detail = item.querySelector('.fact-detail');
        if (!detail) return;

        detail.style.display = 'none';
        detail.style.maxHeight = '0';
        detail.style.opacity = '0';
        detail.classList.remove('open');

        toggle.setAttribute('aria-expanded', 'false');

        toggle.addEventListener('click', () => {
            const isOpen = detail.classList.toggle('open');

            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            toggle.textContent = isOpen ? 'Ascunde detalii' : 'Afișează detalii';

            if (isOpen) {
                detail.style.display = 'block';
                window.requestAnimationFrame(() => {
                    detail.style.maxHeight = detail.scrollHeight + 'px';
                    detail.style.opacity = '1';
                });
            } else {
                detail.style.maxHeight = '0';
                detail.style.opacity = '0';
                setTimeout(() => {
                    if (!detail.classList.contains('open')) {
                        detail.style.display = 'none';
                    }
                }, 350);
            }
        });
    });
}

function setupQuiz() {
    const quizForm = document.getElementById('quiz-form');
    const resultContainer = document.getElementById('result');
    const scoreDisplay = document.getElementById('score');
    const feedbackDisplay = document.getElementById('feedback');
    const timeDisplay = document.getElementById('time');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const currentQuestionDisplay = document.getElementById('currentQuestion');
    const achievementsDisplay = document.getElementById('achievements');

    if (!quizForm || !resultContainer || !scoreDisplay || !feedbackDisplay || !timeDisplay) {
        return;
    }

    const correctAnswers = { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a', q6: 'a', q7: 'a', q8: 'a', q9: 'b', q10: 'b', q11: 'a', q12: 'a' };
    const questionTexts = {
        q1: 'Care este cea mai înaltă altitudine din Carpații Occidentali?',
        q2: 'Care sunt cele trei grupe majore de munți din Carpații Orientali?',
        q3: 'Ce caracteristică distinctivă au Carpații Meridionali?',
        q4: 'Care este limita vestică a Carpaților Orientali?',
        q5: 'Ce procent din Carpați se află pe teritoriul României?',
        q6: 'Care este altitudinea maximă în Carpații Meridionali?',
        q7: 'Ce reprezintă "flișul" în alcătuirea geografică a Carpaților Occidentali?',
        q8: 'Care este limita estică a Carpaților Orientali?',
        q9: 'Care este cel mai mare lac glaciar din Carpații Meridionali?',
        q10: 'Ce tip de relief predomină în Munții Apuseni?',
        q11: 'Care este vârful principal al Munților Retezat?',
        q12: 'În ce grupă montană se află Cheile Turzii?'
    };

    const answerTexts = {
        q1: { a: '1849 m în Munții Bihor, Vârful Curcubăta Mare', b: '2544 m în Munții Făgăraș', c: '2303 m în Munții Rodnei' },
        q2: { a: 'Carpații Maramureșului și Bucovinei, Carpații Moldo-Transilvani, Carpații de Curbură', b: 'Munții Apuseni, Munții Poiana Ruscă, Munții Banatului', c: 'Munții Făgăraș, Munții Bucegi, Munții Piatra Craiului' },
        q3: { a: 'Sunt cea mai masivă și spectaculoasă regiune montană, asemănătoare cu Alpii', b: 'Sunt cea mai fragmentată regiune montană', c: 'Sunt cea mai joasă regiune montană' },
        q4: { a: 'Depresiunea Colinară a Transilvaniei, Dealurile de Vest și Câmpia de Vest', b: 'Dunăre, Barcău și Someș', c: 'Valea Prahovei și Subcarpații de Curbură' },
        q5: { a: '51%', b: '45%', c: '60%' },
        q6: { a: '2544 m în Munții Făgăraș', b: '1849 m în Munții Bihor', c: '2303 m în Munții Rodnei' },
        q7: { a: 'Un complex de roci sedimentare, alternând strate de gresii și marne', b: 'Roci vulcanice eruptive', c: 'Roci metamorfice cristaline' },
        q8: { a: 'Valea Siretului și Subcarpații Moldovei', b: 'Depresiunea Colinară a Transilvaniei', c: 'Dunăre și Barcău' },
        q9: { a: 'Lacul Vidraru', b: 'Lacul Bâlea', c: 'Lacul Iezer' },
        q10: { a: 'Vulcanic', b: 'Carstic', c: 'Glaciar' },
        q11: { a: 'Peleaga', b: 'Parângul Mare', c: 'Moldoveanu' },
        q12: { a: 'Munții Apuseni', b: 'Munții Făgăraș', c: 'Munții Rodnei' }
    };

    let currentSlide = 1;
    let timerInterval = null;
    let userAnswers = {};
    let submitTestFunction = null;

    const updateProgress = () => {
        const totalQuestions = Object.keys(correctAnswers).length;
        const percentage = Math.round((currentSlide - 1) / (totalQuestions - 1) * 100);
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressPercent) progressPercent.textContent = `${percentage}%`;
        if (currentQuestionDisplay) currentQuestionDisplay.textContent = currentSlide;
    };

    const updateTimerDisplay = (timeLeft) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getAchievements = (score, totalQuestions) => {
        const percentage = (score / totalQuestions) * 100;
        let achievements = [];

        if (percentage >= 90) {
            achievements.push('🏆 Expert Carpatin');
        } else if (percentage >= 75) {
            achievements.push('🥈 Specialist Carpați');
        } else if (percentage >= 60) {
            achievements.push('🥉 Cunoștințe Bune');
        } else {
            achievements.push('📚 Mai învață!');
        }

        if (score === totalQuestions) {
            achievements.push('⭐ Perfect Score!');
        }

        return achievements;
    };

    submitTestFunction = () => {
        if (timerInterval) clearInterval(timerInterval);

        let score = 0;
        let feedback = '';

        Object.keys(correctAnswers).forEach(question => {
            const selectedAnswer = document.querySelector(`input[name="${question}"]:checked`);
            if (selectedAnswer) {
                userAnswers[question] = selectedAnswer.value;
                if (selectedAnswer.value === correctAnswers[question]) {
                    score += 1;
                    feedback += `<p class="correct">✓ Întrebarea ${question.slice(1)}: Corect!</p>`;
                } else {
                    feedback += `<p class="incorrect">✗ Întrebarea ${question.slice(1)}: Incorect</p>`;
                }
            } else {
                userAnswers[question] = null;
                feedback += `<p class="incorrect">✗ Întrebarea ${question.slice(1)}: Fără răspuns</p>`;
            }
        });

        scoreDisplay.textContent = score;
        feedbackDisplay.innerHTML = feedback;

        // Add achievements
        const achievements = getAchievements(score, Object.keys(correctAnswers).length);
        achievementsDisplay.innerHTML = achievements.map(achievement =>
            `<span class="achievement">${achievement}</span>`
        ).join('');

        resultContainer.classList.add('show');

        quizForm.querySelectorAll('input').forEach(input => input.disabled = true);
        const submitButton = quizForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
            testResults.push({ date: new Date().toISOString(), score, totalQuestions: Object.keys(correctAnswers).length });
            localStorage.setItem('testResults', JSON.stringify(testResults));
        } catch (error) {
            console.error('Error saving test results:', error);
        }
    };

    // Make submitTest globally accessible
    window.submitTest = submitTestFunction;

    // Finish quiz function with validation
    window.finishQuiz = function() {
        const currentOptions = document.querySelectorAll(`#slide-12 input[type="radio"]`);
        const selectedOption = document.querySelector(`#slide-12 input[type="radio"]:checked`);

        if (!selectedOption) {
            // Highlight options briefly to indicate selection is required
            currentOptions.forEach(option => {
                const label = option.closest('.option');
                label.style.animation = 'incorrectShake 0.6s ease';
                setTimeout(() => label.style.animation = '', 600);
            });
            return;
        }

        // All questions answered, submit the test
        submitTestFunction();
    };

    // Slide navigation functions
    window.nextQuestion = function(questionNumber) {
        const currentOptions = document.querySelectorAll(`#slide-${questionNumber} input[type="radio"]`);
        const selectedOption = document.querySelector(`#slide-${questionNumber} input[type="radio"]:checked`);

        if (!selectedOption) {
            // Highlight options briefly to indicate selection is required
            currentOptions.forEach(option => {
                const label = option.closest('.option');
                label.style.animation = 'incorrectShake 0.6s ease';
                setTimeout(() => label.style.animation = '', 600);
            });
            return;
        }

        // Show next slide
        document.getElementById(`slide-${questionNumber}`).classList.remove('active');
        document.getElementById(`slide-${questionNumber + 1}`).classList.add('active');
        currentSlide = questionNumber + 1;
        updateProgress();
    };

    window.prevQuestion = function(questionNumber) {
        document.getElementById(`slide-${questionNumber}`).classList.remove('active');
        document.getElementById(`slide-${questionNumber - 1}`).classList.add('active');
        currentSlide = questionNumber - 1;
        updateProgress();
    };

    // Add click handlers for options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                // Remove selected class from siblings
                this.parentElement.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                // Add selected class to current
                this.classList.add('selected');
            }
        });
    });

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitTestFunction();
    });

    let timeLeft = 600;
    updateTimerDisplay(timeLeft);
    updateProgress();

    timerInterval = setInterval(() => {
        timeLeft -= 1;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

function showReview() {
    const reviewMode = document.getElementById('reviewMode');
    const reviewContent = document.getElementById('reviewContent');

    if (!reviewMode || !reviewContent) return;

    const correctAnswers = { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a', q6: 'a', q7: 'a', q8: 'a', q9: 'b', q10: 'b', q11: 'a', q12: 'a' };
    const questionTexts = {
        q1: 'Care este cea mai înaltă altitudine din Carpații Occidentali?',
        q2: 'Care sunt cele trei grupe majore de munți din Carpații Orientali?',
        q3: 'Ce caracteristică distinctivă au Carpații Meridionali?',
        q4: 'Care este limita vestică a Carpaților Orientali?',
        q5: 'Ce procent din Carpați se află pe teritoriul României?',
        q6: 'Care este altitudinea maximă în Carpații Meridionali?',
        q7: 'Ce reprezintă "flișul" în alcătuirea geografică a Carpaților Occidentali?',
        q8: 'Care este limita estică a Carpaților Orientali?',
        q9: 'Care este cel mai mare lac glaciar din Carpații Meridionali?',
        q10: 'Ce tip de relief predomină în Munții Apuseni?',
        q11: 'Care este vârful principal al Munților Retezat?',
        q12: 'În ce grupă montană se află Cheile Turzii?'
    };

    const answerTexts = {
        q1: { a: '1849 m în Munții Bihor, Vârful Curcubăta Mare', b: '2544 m în Munții Făgăraș', c: '2303 m în Munții Rodnei' },
        q2: { a: 'Carpații Maramureșului și Bucovinei, Carpații Moldo-Transilvani, Carpații de Curbură', b: 'Munții Apuseni, Munții Poiana Ruscă, Munții Banatului', c: 'Munții Făgăraș, Munții Bucegi, Munții Piatra Craiului' },
        q3: { a: 'Sunt cea mai masivă și spectaculoasă regiune montană, asemănătoare cu Alpii', b: 'Sunt cea mai fragmentată regiune montană', c: 'Sunt cea mai joasă regiune montană' },
        q4: { a: 'Depresiunea Colinară a Transilvaniei, Dealurile de Vest și Câmpia de Vest', b: 'Dunăre, Barcău și Someș', c: 'Valea Prahovei și Subcarpații de Curbură' },
        q5: { a: '51%', b: '45%', c: '60%' },
        q6: { a: '2544 m în Munții Făgăraș', b: '1849 m în Munții Bihor', c: '2303 m în Munții Rodnei' },
        q7: { a: 'Un complex de roci sedimentare, alternând strate de gresii și marne', b: 'Roci vulcanice eruptive', c: 'Roci metamorfice cristaline' },
        q8: { a: 'Valea Siretului și Subcarpații Moldovei', b: 'Depresiunea Colinară a Transilvaniei', c: 'Dunăre și Barcău' },
        q9: { a: 'Lacul Vidraru', b: 'Lacul Bâlea', c: 'Lacul Iezer' },
        q10: { a: 'Vulcanic', b: 'Carstic', c: 'Glaciar' },
        q11: { a: 'Peleaga', b: 'Parângul Mare', c: 'Moldoveanu' },
        q12: { a: 'Munții Apuseni', b: 'Munții Făgăraș', c: 'Munții Rodnei' }
    };

    let reviewHTML = '';

    Object.keys(correctAnswers).forEach(question => {
        const userAnswer = document.querySelector(`input[name="${question}"]:checked`);
        const isCorrect = userAnswer && userAnswer.value === correctAnswers[question];
        const userAnswerText = userAnswer ? answerTexts[question][userAnswer.value] : 'Fără răspuns';

        reviewHTML += `
            <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                <h4>${question.slice(1)}. ${questionTexts[question]}</h4>
                <p><strong>Răspunsul tău:</strong> ${userAnswerText}</p>
                <p><strong>Răspunsul corect:</strong> ${answerTexts[question][correctAnswers[question]]}</p>
                <p class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? '✓ Corect' : '✗ Incorect'}</p>
            </div>
        `;
    });

    reviewContent.innerHTML = reviewHTML;
    reviewMode.classList.add('show');
    reviewMode.scrollIntoView({ behavior: 'smooth' });
}

function restartQuiz() {
    location.reload();
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Testează-ți cunoștințele despre Carpații României!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Testează-ți cunoștințele despre Carpații României! #CarpatiiRomaniei');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Testează-ți cunoștințele despre Carpații României! ' + window.location.href);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function copyLink(event) {
    event.preventDefault();
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = event.currentTarget || (event.target && event.target.closest('.social-btn'));
        if (!btn) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copiat!';
        btn.style.background = '#27AE60';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(error => {
        console.error('Clipboard error:', error);
    });
}

// Feature Modal Functions
const featureData = [
    {
        title: 'Trei Grupuri Majore',
        description: 'Carpații României sunt împărțiți în trei grupuri majore, fiecare cu caracteristici geomorfologice și biologice distincte:\n\n• Carpații Occidentali: Cea mai fragmentată regiune, incluzând Munții Apuseni, Poiana Ruscă și Munții Banatului, cu o altitudine maximă de 1.849 m.\n\n• Carpații Orientali: O regiune mai compactă cu relief glaciar bine dezvoltat, incluzând Munții Rodnei, Munții Călimani și Munții Ceahlău.\n\n• Carpații Meridionali: Cea mai masivă și cea mai înaltă regiune, cu peisaje alpine spectaculoase și vârfuri de peste 2.500 m, incluzând Munții Făgăraș și Munții Bucegi.'
    },
    {
        title: 'Biodiversitate Bogată',
        description: 'Carpații României reprezintă un adevărat tezaur de biodiversitate cu:\n\n• Flora: Peste 3.500 de specii de plante vasculare, din care aproximativ 200 sunt endemice României. Regiunea găzduiește păduri de foiose și răsinose, precum și plante alpine rare.\n\n• Fauna: Aproximativ 1.300 de specii de animale, incluzând ursul brun, lupul cenușiu, râsul eurasiatic și over 200 de specii de păsări. Multe dintre aceste specii sunt protejate și geniale.\n\n• Ecosisteme protejate: Parcuri naționale și rezervații naturale care conservă habitate critice pentru speciile vulnerabile.'
    },
    {
        title: 'Vârfuri Spectaculoase',
        description: 'Carpații României sunt acasă unor vârfuri spectaculoase și iconic:\n\n• Moldoveanu (2.544 m): Cel mai înalt vârf din România, situat în Munții Făgăraș.\n\n• Negoiu (2.535 m): Al doilea vârf ca înălțime, de asemenea în Munții Făgăraș.\n\n• Omu (2.505 m): Situat în Munții Bucegi, cunoscut pentru Sfinxul și Babelele sale iconic.\n\nAceste vârfuri oferă aventuri remarcabile pentru alpiniști și drumeți, cu viste panoramice spectaculoase și oportunități de explorare naturală.'
    },
    {
        title: 'Test Interactiv',
        description: 'Testul nostru interactiv te va ajuta să-ți consolidezi cunoștințele despre Carpații României:\n\n• 12 întrebări cu răspunsuri multiple care acoperă geografie, biodiversitate și informații culturale.\n\n• Sistem de notare care urmărește progresul tău și oferă feedback instantaneu.\n\n• Cronometru pentru a testa viteza și acuratețea răspunsurilor tale.\n\n• Recenzii detaliate care îți permit să vezi răspunsurile corecte și să înveți din greșeli.\n\nTe invităm să participi la test și să afli cât de mult cunoști despre acești munți fascinatori!'
    },
    {
        title: 'Galerii de Imagini',
        description: 'Site-ul nostru conține galerii de imagini care prezintă frumusețea Carpaților:\n\n• Fotografii ale vârfurilor iconice și peisajelor spectaculoase.\n\n• Imagini ale faunei și florei specifice regiunilor montane.\n\n• Galerii regionale care arată caracteristicile unice ale fiecărei zone.\n\n• Imagini sezoniere care demonstrează transformările naturale în munți.\n\nTe poți delecta cu frumusețea naturală și inedită a Carpaților prin aceste galerii vizuale.'
    },
    {
        title: 'Informații Detaliate',
        description: 'Site-ul nostru oferă informații comprehensive despre Carpații României:\n\n• Date geografice: Locație, extensie, altitudine și graniță cu alte regiuni.\n\n• Informații climatice: Temperatura, precipitații și modele meteorologice sezoniere.\n\n• Detalii ecologice: Tipuri de ecosisteme, zone de vegetație și habitate critice.\n\n• Date istorice și culturale: Importanța culturală a munților, tradiții locale și heritage natural.\n\n• Ghiduri pentru turiști: Informații despre drumeții, trasee recomandate și atracții principale.\n\nTotul este prezentat în formate ușor de înțeles și accesibil pentru toți vizitatorii.'
    }
];

function openFeatureModal(index) {
    const modal = document.getElementById('featureModal');
    const title = document.getElementById('featureTitle');
    const description = document.getElementById('featureDescription');
    
    if (modal && title && description) {
        title.textContent = featureData[index].title;
        description.textContent = featureData[index].description;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeFeatureModal() {
    const modal = document.getElementById('featureModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Image Gallery Functions
const galleryData = {
    occidentali: [
        { src: 'imagini/muntii-apuseni.jpg', caption: 'Munții Apuseni - Peisaj spectaculos' },
        { src: 'imagini/cheile-turzii.jpg', caption: 'Cheile Turzii - Formație geologică unică' },
        { src: 'imagini/bihor.jpg', caption: 'Munții Bihor - Vârful Curcubăta Mare' },
        { src: 'imagini/banatul.jpg', caption: 'Munții Banatului - Apus minunat' }
    ],
    orientali: [
        { src: 'imagini/rodnei.jpg', caption: 'Munții Rodnei - Relief glaciar' },
        { src: 'imagini/ceahlau.jpg', caption: 'Masivul Ceahlău - Monument al naturii' },
        { src: 'imagini/ciucas.jpg', caption: 'Munții Ciucaș - Forme spectaculoase' },
        { src: 'imagini/calimani.jpg', caption: 'Munții Călimani - Relief vulcanic' }
    ],
    meridionali: [
        { src: 'imagini/fagaras.jpg', caption: 'Munții Făgăraș - Cel mai înalt masiv' },
        { src: 'imagini/bucegi.jpg', caption: 'Munții Bucegi - Sfinxul și Babele' },
        { src: 'imagini/retezat.jpg', caption: 'Munții Retezat - Lacuri glaciare' },
        { src: 'imagini/parâng.jpg', caption: 'Munții Parâng - Transfăgărășanul' }
    ]
};

let currentGalleryRegion = '';
let currentGalleryIndex = 0;
let shuffledGallery = [];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startImageGallery(region) {
    currentGalleryRegion = region;
    shuffledGallery = shuffleArray(galleryData[region] || []);
    currentGalleryIndex = 0;
    
    const modal = document.getElementById('imageGalleryModal');
    if (modal && shuffledGallery.length > 0) {
        modal.classList.add('show');
        displayGalleryImage();
        document.body.style.overflow = 'hidden';
    }
}

function displayGalleryImage() {
    if (shuffledGallery.length === 0) return;
    
    const image = shuffledGallery[currentGalleryIndex];
    const imgElement = document.getElementById('galleryImage');
    const captionElement = document.getElementById('galleryCaption');
    const counterElement = document.getElementById('galleryCounter');
    const titleElement = document.getElementById('galleryTitle');
    
    if (imgElement && captionElement && counterElement && titleElement) {
        imgElement.src = image.src;
        captionElement.textContent = image.caption;
        counterElement.textContent = `${currentGalleryIndex + 1} / ${shuffledGallery.length}`;
        
        const regionNames = {
            occidentali: 'Carpații Occidentali - Galerie Imagini',
            orientali: 'Carpații Orientali - Galerie Imagini',
            meridionali: 'Carpații Meridionali - Galerie Imagini'
        };
        titleElement.textContent = regionNames[currentGalleryRegion] || 'Galerie Imagini';
    }
}

function nextGalleryImage() {
    if (shuffledGallery.length > 0) {
        currentGalleryIndex = (currentGalleryIndex + 1) % shuffledGallery.length;
        displayGalleryImage();
    }
}

function previousGalleryImage() {
    if (shuffledGallery.length > 0) {
        currentGalleryIndex = (currentGalleryIndex - 1 + shuffledGallery.length) % shuffledGallery.length;
        displayGalleryImage();
    }
}

function closeImageGallery() {
    const modal = document.getElementById('imageGalleryModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const featureModal = document.getElementById('featureModal');
    const galleryModal = document.getElementById('imageGalleryModal');
    
    if (event.target === featureModal) {
        closeFeatureModal();
    }
    if (event.target === galleryModal) {
        closeImageGallery();
    }
});

// ==============================================================
// DARK MODE
// ==============================================================
function toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle('dark-mode');
    
    // Save preference
    const isDarkMode = html.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update icon
    const icon = document.querySelector('.dark-mode-toggle i');
    if (icon) {
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    }
}

// Load dark mode preference
function initDarkMode() {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    if (darkModePreference) {
        document.documentElement.classList.add('dark-mode');
        const icon = document.querySelector('.dark-mode-toggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// ==============================================================
// FAQ ACCORDION
// ==============================================================
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ==============================================================
// INTERACTIVE MAP WITH LEAFLET
// ==============================================================
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Center of Carpathians Romania
    const centerCoords = [45.4, 24.5];
    
    // Initialize map
    const map = L.map('map').setView(centerCoords, 7);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        maxNativeZoom: 18
    }).addTo(map);
    
    // Add markers for main peaks
    const peaks = [
        { name: 'Moldoveanu (2544m)', coords: [45.3693, 24.6329], type: 'peak' },
        { name: 'Negoiu (2535m)', coords: [45.3756, 24.6402], type: 'peak' },
        { name: 'Omu (2505m)', coords: [45.4107, 25.4732], type: 'peak' },
        { name: 'Munții Apuseni', coords: [46.4, 23.2], type: 'region' },
        { name: 'Munții Rodnei', coords: [47.5, 24.6], type: 'region' },
        { name: 'Munții Piatra Craiului', coords: [45.45, 24.9], type: 'region' }
    ];
    
    peaks.forEach(peak => {
        const icon = L.icon({
            iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzI3QUU2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7vuI88L3RleHQ+PC9zdmc+`,
            iconSize: [32, 32],
            popupAnchor: [0, -16]
        });
        
        L.marker(peak.coords, { icon }).addTo(map)
            .bindPopup(`<strong>${peak.name}</strong><br/><em>${peak.type === 'peak' ? 'Vârf principal' : 'Región montană'}</em>`);
    });
}

// ==============================================================
// BLOG MODAL SYSTEM
// ==============================================================
const blogContent = [
    {
        title: 'Transalpina: Drumul cu cea mai înaltă altitudine din România',
        image: "url('imagini/blog-transalpina.svg')",
        content: `
            <p><strong>Transalpina</strong> este drumul cu cea mai înaltă altitudine din România, cu o lungime de 146 km și care traversează lanțul Carpaților Meridionali.</p>
            
            <h4>Caracteristici principale:</h4>
            <ul>
                <li><strong>Altitudine maximă:</strong> 2.145 m la Pasul Urdele</li>
                <li><strong>Lungime:</strong> 146 km de la Ovidiu (Constanța) la Drobeta (Mehedinți)</li>
                <li><strong>Construcție:</strong> Finalizată în 1938</li>
                <li><strong>Peisaje:</strong> Spectaculoase, cu viste panoramice incredibile</li>
            </ul>
            
            <h4>Perioada optimă de vizită:</h4>
            <p>Iunie până septembrie sunt lunile ideale pentru a parcurge Transalpina. Iarna drumul este închis din cauza zăpezii abundente.</p>
            
            <h4>Sfaturi practice:</h4>
            <ul>
                <li>Verifica condiția drumului și meteo înainte de plecare</li>
                <li>Combustibil plin și apă suficientă</li>
                <li>Cizme de drumeție dacă vrei să faci trekking</li>
                <li>Aparat foto pentru peisajele spectaculoase</li>
            </ul>
            
            <p>Transalpina nu este doar un drum, este o aventură prin inima Carpaților!</p>
        `
    },
    {
        title: 'Sfaturi pentru Drumeții de Primăvară în Carpați',
        image: "url('imagini/blog-primavara.svg')",
        content: `
            <p>Primăvara este o perioadă magică pentru drumeții în Carpați, cu peisaje care se trezesc la viață și vremea mai blândă.</p>
            
            <h4>Provocări ale primăverii montane:</h4>
            <ul>
                <li><strong>Apă abundentă:</strong> Topirea zăpezii creează pâraie puternice și cărări noroioase</li>
                <li><strong>Vremea imprevizibilă:</strong> Soarele și ploaia se pot schimba rapid</li>
                <li><strong>Zăpadă reziduală:</strong> Pe vârfuri mai înalte</li>
            </ul>
            
            <h4>Echipament recomandat:</h4>
            <ul>
                <li>Cizme impermeabile cu branț rigid</li>
                <li>Haine în straturi (fleece + jachetă impermeabilă)</li>
                <li>Pantaloni impermeabili</li>
                <li>Ciucur și protecție solară</li>
                <li>Rucsac 30-40L</li>
            </ul>
            
            <h4>Trasee recomandate pentru primăvară:</h4>
            <p>Munții Piatra Craiului, Munții Bucegi (pe cărări inferioare), Munții Poiana Ruscă - toate sunt potrivite pentru această perioadă.</p>
            
            <p>Primăvara în munți este o experiență magică pe care o recomanzi tuturor iubitorilor naturii!</p>
        `
    },
    {
        title: 'Fauna Carpaților: Cum să vezi ursul brun în habitat natural',
        image: "url('imagini/blog-fauna.svg')",
        content: `
            <p>Carpații sunt acasă pentru cea mai mare populație de urși bruni din Europa, cu peste 6.000 de indivizi.</p>
            
            <h4>Comportamentul ursului brun:</h4>
            <ul>
                <li><strong>Sunt ierbivori și carnivor:</strong> Se hrănesc cu mure, fructe, rădăcini și ocazional prădează</li>
                <li><strong>Iernează:</strong> Se retrag în peșteri din novembre până aprilie</li>
                <li><strong>Solitari:</strong> Cu excepția sezonului de reproducere</li>
                <li><strong>Nocturni:</strong> Activi în special seara și noaptea</li>
            </ul>
            
            <h4>Cum să observi ursii în siguranță:</h4>
            <ul>
                <li>Fă zgomot pe traseu pentru a-i avertiza</li>
                <li>Evita ursii cu pui</li>
                <li>Păstrează distanța (minim 100 m)</li>
                <li>Nu lăsa mâncare sau deșeuri în tabără</li>
                <li>În caz de întâlnire, nu fugi - fă trepte înapoi lent</li>
            </ul>
            
            <h4>Alte animale pe care le poți vedea:</h4>
            <p>Lup cenușiu, râs eurasiatic, cerb carpatin, căprioară, nevăstaiță, berbec carpatin - toți sunt parte a ecosistemului intact al Carpaților.</p>
            
            <p>Respectul pentru viața sălbatică este cheia la coexistență pașnică în munți.</p>
        `
    },
    {
        title: 'Fotografiere în Munți: Capturează Frumusețea Carpaților',
        image: "url('imagini/blog-fotografie.svg')",
        content: `
            <p>Carpații oferă scenarii de fotografie care te vor lăsa fără cuvinte - peisaje epice, lumini dramatice și natură nealterat.</p>
            
            <h4>Cel mai bun timp pentru fotografii:</h4>
            <ul>
                <li><strong>Golden hour:</strong> Prima și ultima oră a zilei</li>
                <li><strong>Zilele cu nori:</strong> Lumină difuzată perfectă</li>
                <li><strong>După ploaie:</strong> Lumini și nori spectaculoasi</li>
            </ul>
            
            <h4>Echipament recomandat:</h4>
            <ul>
                <li>Aparat foto DSLR sau mirrorless</li>
                <li>Obiective: larg unghi (14-24mm), standard (50mm), telefoto (70-200mm)</li>
                <li>Trepied stabil</li>
                <li>Filtru ND și polarizator</li>
                <li>Baterii de rezervă și carduri memorie</li>
            </ul>
            
            <h4>Locuri ideale pentru fotografie:</h4>
            <ul>
                <li>Vârful Omu - Munții Bucegi</li>
                <li>Transfăgărășanul - Munții Făgăraș</li>
                <li>Lacul Bâlea</li>
                <li>Cheile Bicazului</li>
            </ul>
            
            <p>Fotografia este o modalitate perfectă de a conserva și de a împărți frumusețea Carpaților cu lumea.</p>
        `
    },
    {
        title: 'Parcuri Naționale din Carpați: Protejarea Naturii',
        image: "url('imagini/blog-parcuri.svg')",
        content: `
            <p>Parcurile Naționale din Carpați sunt arii protejate dedicate conservării biodiversității și ecosistemelor unice.</p>
            
            <h4>Parcurile principale:</h4>
            <ul>
                <li><strong>Parcul Național Retezat:</strong> 38.000 hectare, 80 lacuri glaciare, 19 vârfuri peste 2000m</li>
                <li><strong>Parcul Național Piatra Craiului:</strong> 24.500 hectare, relief carstic spectaculos</li>
                <li><strong>Parcul Național Domogled - Valea Cernei:</strong> 24.000 hectare, biodiversitate bogată</li>
            </ul>
            
            <h4>Regulamente importante:</h4>
            <ul>
                <li>Rămâi pe trasee marcate</li>
                <li>Fara cules de plante protejate</li>
                <li>Nu lăsa deșeuri</li>
                <li>Fără focuri de tabără decât în locuri marcate</li>
                <li>Fără zgomot excesiv</li>
            </ul>
            
            <h4>De ce sunt importante parcurile?</h4>
            <p>Protejează habitatele critice, conservă speciile în pericol, mențin echilibrul ecologic și oferă educație despre natură.</p>
            
            <p>Fiecare turist responsabil contribuie la protecția acestor arii extraordinare.</p>
        `
    },
    {
        title: 'Vârful Moldoveanu: Adevărul din Spatele Celui mai Înalt Vârf',
        image: "url('imagini/blog-moldoveanu.svg')",
        content: `
            <p>Moldoveanu (2.544 m) este cel mai înalt vârf din România și simbolul alpinismului românesc.</p>
            
            <h4>Fapte interesante:</h4>
            <ul>
                <li>Situat în Munții Făgăraș</li>
                <li>Doar pe al doilea loc în munții Europei Centrale, după Grossglockner (3.798 m)</li>
                <li>Primii care au urcat: Grigore Șișoveanu și Iacob Negruzzi în 1837</li>
                <li>Vizibilitate până la 60 km în zile cu vreme bună</li>
            </ul>
            
            <h4>Rutele de ascensiune:</h4>
            <ul>
                <li><strong>Ruta standard:</strong> Cabanele Neagu Domnului - 6-8 ore</li>
                <li><strong>Ruta Urzicii:</strong> Mai ușoară, 7-9 ore</li>
                <li><strong>Ruta Dificilă:</strong> Pentru alpiniști experimentați</li>
            </ul>
            
            <h4>Dificultate și efort:</h4>
            <p>Dificultate: Medie-Înaltă. Se recomandă formă fizică bună, echipament adecvat și experiență montană.</p>
            
            <h4>Perioada optimă:</h4>
            <p>Iunie - septembrie. În afară acestor luni, riscuri meteorologice mari.</p>
            
            <p>Ajungerea pe Moldoveanu este o realizare ce-ți va rămâne mereu în inimă!</p>
        `
    }
];

function openBlogModal(index) {
    const modal = document.getElementById('blogModal');
    const title = document.getElementById('blogModalTitle');
    const image = document.getElementById('blogModalImage');
    const content = document.getElementById('blogModalContent');
    
    if (modal && title && image && content) {
        title.textContent = blogContent[index].title;
        image.style.background = blogContent[index].image;
        content.innerHTML = blogContent[index].content;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('blogModal');
    if (event.target === modal) {
        closeBlogModal();
    }
});

// ==============================================================
function saveTestScore(score, totalQuestions, userName = 'Anonymous') {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    
    leaderboard.push({
        name: userName,
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        date: new Date().toLocaleDateString('ro-RO'),
        time: new Date().toLocaleTimeString('ro-RO')
    });
    
    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 100
    leaderboard = leaderboard.slice(0, 100);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const leaderboardTable = document.querySelector('.leaderboard-table');
    
    if (!leaderboardTable) return;
    
    let html = '<thead><tr><th>Rank</th><th>Nume</th><th>Scor</th><th>Procent</th><th>Data</th></tr></thead><tbody>';
    
    leaderboard.forEach((entry, index) => {
        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';
        
        html += `<tr>
            <td class="leaderboard-rank ${rankClass}">${index + 1}${index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</td>
            <td>${entry.name}</td>
            <td>${entry.score}/${entry.totalQuestions}</td>
            <td>${entry.percentage}%</td>
            <td>${entry.date}</td>
        </tr>`;
    });
    
    html += '</tbody>';
    leaderboardTable.innerHTML = html;
}

// ==============================================================
// CERTIFICATE PDF DOWNLOAD (jsPDF)
// ==============================================================
function downloadCertificate(userName, score, totalQuestions) {
    // Check if jsPDF is available
    if (typeof jsPDF === 'undefined') {
        alert('Biblioteca PDF nu este încărcată. Descarcă certificatul manual din browser.');
        return;
    }
    
    const percentage = Math.round((score / totalQuestions) * 100);
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Add background color
    doc.setFillColor(39, 174, 96);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Add border
    doc.setDrawColor(230, 126, 34);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    
    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.text('CERTIFICAT DE FINALIZARE', 148.5, 50, { align: 'center' });
    
    // Add details
    doc.setFontSize(18);
    doc.text(`Acesta certifică că ${userName}`, 148.5, 80, { align: 'center' });
    doc.text(`a obținut ${score}/${totalQuestions} puncte (${percentage}%)`, 148.5, 95, { align: 'center' });
    doc.text('la testul despre Carpații României', 148.5, 110, { align: 'center' });
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, 148.5, 140, { align: 'center' });
    
    // Download
    doc.save(`Certificat_Carpati_${userName.replace(/\s/g, '_')}.pdf`);
}

// ==============================================================
// MULTI-LANGUAGE SUPPORT
// ==============================================================
const translations = {
    ro: {
        'home': 'Acasă',
        'mountains': 'Carpații',
        'test': 'Test',
        'nature': 'Natură',
        'contact': 'Contact',
        'info': 'Info & Sfaturi',
        'occidentali': 'Occidentali',
        'orientali': 'Orientali',
        'meridionali': 'Meridionali',
        'varfuri': 'Vârfuri',
        'hero-title': 'Carpații României',
        'hero-subtitle': 'Descoperă măreția și frumusețea munților noștri',
        'welcome': 'Bine ai venit în lumea Carpaților',
        'discover': 'Ce vei descoperi',
        'regions': 'Regiunile Carpaților',
        'three-groups': 'Trei Grupuri Majore',
        'biodiversity': 'Biodiversitate Bogată',
        'peaks': 'Vârfuri Spectaculoase',
        'test-card': 'Test Interactiv',
        'gallery': 'Galerii de Imagini',
        'details': 'Informații Detaliate',
        'western': 'Carpații Occidentali',
        'eastern': 'Carpații Orientali',
        'southern': 'Carpații Meridionali',
        'learn-more': 'Află mai mult',
        'sources': 'Surse informaționale',
        'contact-us': 'Contactează-ne',
        'send': 'Trimite',
        'name': 'Nume',
        'email': 'Email',
        'message': 'Mesaj',
        'altitude': 'Altitudinea maximă',
        'moldoveanu': 'Moldoveanu',
        'plants': 'Specii de plante vasculare',
        'birds': 'Specii de păsări',
        'percentage': 'Din Carpații Europei',
        'welcome-text': 'Carpații României sunt o parte integrantă a lanțului montan al Carpaților, extins pe o suprafață de aproximativ 7.600 km² pe teritoriul României. Aceștia munți reprezentează un ecosistem unic și plu de viață, cu o biodiversitate remarcabilă și resurse naturale variate.'
    },
    en: {
        'home': 'Home',
        'mountains': 'Carpathians',
        'test': 'Test',
        'nature': 'Nature',
        'contact': 'Contact',
        'info': 'Info & Tips',
        'occidentali': 'Western Carpathians',
        'orientali': 'Eastern Carpathians',
        'meridionali': 'Southern Carpathians',
        'varfuri': 'Peaks',
        'hero-title': 'Carpathians of Romania',
        'hero-subtitle': 'Discover the majesty and beauty of our mountains',
        'welcome': 'Welcome to the World of Carpathians',
        'discover': 'What You Will Discover',
        'regions': 'Carpathian Regions',
        'three-groups': 'Three Major Groups',
        'biodiversity': 'Rich Biodiversity',
        'peaks': 'Spectacular Peaks',
        'test-card': 'Interactive Test',
        'gallery': 'Image Galleries',
        'details': 'Detailed Information',
        'western': 'Western Carpathians',
        'eastern': 'Eastern Carpathians',
        'southern': 'Southern Carpathians',
        'learn-more': 'Learn more',
        'sources': 'Information Sources',
        'contact-us': 'Contact Us',
        'send': 'Send',
        'name': 'Name',
        'email': 'Email',
        'message': 'Message',
        'altitude': 'Maximum Altitude',
        'moldoveanu': 'Moldoveanu',
        'plants': 'Vascular Plant Species',
        'birds': 'Bird Species',
        'percentage': 'Of Carpathians in Europe',
        'welcome-text': 'The Carpathians of Romania are an integral part of the Carpathian mountain range, extended over an area of approximately 7,600 km² on Romanian territory. These mountains represent a unique and living ecosystem, with remarkable biodiversity and varied natural resources.'
    }
};

const dynamicElements = {
    'h1': { index: 0, key: 'hero-title' },
    '.hero-banner p': { index: 0, key: 'hero-subtitle' },
    'h2': [
        { textMatch: 'Bine ai venit', key: 'welcome' },
        { textMatch: 'Ce vei descoperi', key: 'discover' },
        { textMatch: 'Regiunile Carpaților', key: 'regions' }
    ],
    '.feature-card h3': [
        { index: 0, key: 'three-groups' },
        { index: 1, key: 'biodiversity' },
        { index: 2, key: 'peaks' },
        { index: 3, key: 'test-card' },
        { index: 4, key: 'gallery' },
        { index: 5, key: 'details' }
    ],
    '.region-card h3': [
        { index: 0, key: 'western' },
        { index: 1, key: 'eastern' },
        { index: 2, key: 'southern' }
    ],
    '.stat-label': [
        { index: 0, key: 'altitude' },
        { index: 1, key: 'plants' },
        { index: 2, key: 'birds' },
        { index: 3, key: 'percentage' }
    ]
};

function applyTranslations(lang) {
    if (!translations[lang]) return;

    // Apply standard mappings
    const standardMappings = [
        { selector: 'a[href="index.html"]', key: 'home' },
        { selector: '.dropbtn', key: 'mountains' },
        { selector: 'a[href="test.html"]', key: 'test' },
        { selector: 'a[href="natura.html"]', key: 'nature' },
        { selector: 'a[href="info.html"]', key: 'info' },
        { selector: 'a[href="contact.html"]', key: 'contact' },
        { selector: 'a[href="occidentali.html"]', key: 'occidentali' },
        { selector: 'a[href="orientali.html"]', key: 'orientali' },
        { selector: 'a[href="meridionali.html"]', key: 'meridionali' },
        { selector: 'a[href="varfuri.html"]', key: 'varfuri' }
    ];

    standardMappings.forEach(mapping => {
        document.querySelectorAll(mapping.selector).forEach(element => {
            element.textContent = translations[lang][mapping.key] || element.textContent;
        });
    });

    // Apply dynamic translations
    Object.keys(dynamicElements).forEach(selector => {
        const elements = document.querySelectorAll(selector);
        const config = dynamicElements[selector];

        if (Array.isArray(config)) {
            elements.forEach((element, idx) => {
                const cfg = config.find(c => c.index === idx || (c.textMatch && element.textContent.includes(c.textMatch)));
                if (cfg && translations[lang][cfg.key]) {
                    element.textContent = translations[lang][cfg.key];
                }
            });
        } else if (config.index !== undefined && elements[config.index]) {
            elements[config.index].textContent = translations[lang][config.key] || elements[config.index].textContent;
        }
    });

    document.documentElement.lang = lang;
}

function changeLanguage(lang) {
    localStorage.setItem('language', lang);

    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === lang.toLowerCase());
    });

    applyTranslations(lang);
}

function initLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'ro';
    const languageButtons = document.querySelectorAll('.language-btn');

    languageButtons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === savedLanguage);
    });

    applyTranslations(savedLanguage);
}

const i18nMappings = [
    { selector: 'a[href="index.html"]', key: 'home' },
    { selector: '.dropbtn', key: 'mountains' },
    { selector: 'a[href="test.html"]', key: 'test' },
    { selector: 'a[href="natura.html"]', key: 'nature' },
    { selector: 'a[href="info.html"]', key: 'info' },
    { selector: 'a[href="contact.html"]', key: 'contact' },
    { selector: 'a[href="occidentali.html"]', key: 'occidentali' },
    { selector: 'a[href="orientali.html"]', key: 'orientali' },
    { selector: 'a[href="meridionali.html"]', key: 'meridionali' },
    { selector: 'a[href="varfuri.html"]', key: 'varfuri' }
];

// ==============================================================
// INITIALIZE ALL
// ==============================================================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;
        
        if (!name || !email || !message) {
            alert('Vă rugăm completați toate câmpurile!');
            return;
        }
        
        // Create WhatsApp message
        const whatsappNumber = '40755293571';
        const whatsappMessage = encodeURIComponent(
            `Bună!\n\nNume: ${name}\nEmail: ${email}\n\nMesaj:\n${message}`
        );
        
        // Send to WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
        
        // Optional: Clear form and show confirmation
        this.reset();
        alert('Formular trimis! Vei fi redirecționat pe WhatsApp.');
    });
}

function init() {
    initDarkMode();
    initLanguage();
    setupStickyNav();
    setupBackToTop();
    setupImageModal();
    setupFactDetailsToggle();
    setupQuiz();
    setupContactForm();
    setupFAQ();
    initializeMap();
    displayLeaderboard();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
