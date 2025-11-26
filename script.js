// ==========================================
// タッチデバイス判定
// ==========================================

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ==========================================
// Loading Screen
// ==========================================

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.remove();
        }, 600);
    }, 1500);
});

// ==========================================
// スクロール進捗バー
// ==========================================

const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
document.body.appendChild(scrollIndicator);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollIndicator.style.transform = `scaleX(${scrolled / 100})`;
    scrollIndicator.style.width = '100%';
});

// ==========================================
// Hero Stats カウントアップアニメーション
// ==========================================

const animateCountUp = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCount = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };
    
    updateCount();
};

// スクロールで Stats が見えたらカウントアップ開始
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.dataset.target);
            animateCountUp(entry.target, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ==========================================
// AOS (Animate On Scroll)
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// ==========================================
// Smooth scroll for anchor links
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// Header の表示/非表示
// ==========================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// 紙吹雪エフェクト
// ==========================================

function createConfetti(x, y) {
    const colors = ['#0066FF', '#00CCFF', '#FFE66D', '#FF6B9D'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 10000;
            border-radius: 50%;
        `;
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 150 + Math.random() * 150;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 200;
        
        let posX = x;
        let posY = y;
        let velocityY = vy;
        let opacity = 1;
        
        const animate = () => {
            velocityY += 600 / 60;
            posX += vx / 60;
            posY += velocityY / 60;
            opacity -= 0.02;
            
            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;
            
            if (posY < window.innerHeight && opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        animate();
    }
}

// ==========================================
// Apply Button クリック時のエフェクト
// ==========================================

const applyButton = document.querySelector('.apply-button-large');

if (applyButton) {
    applyButton.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            
            // 紙吹雪を出す
            const rect = this.getBoundingClientRect();
            createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            
            // ボタンアニメーション
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                alert('エントリーフォームは準備中です。まもなく公開されます！');
            }, 200);
        }
    });
}

// ==========================================
// Point Card クリック時にも紙吹雪
// ==========================================

document.querySelectorAll('.point-card-modern, .job-card-large').forEach(card => {
    card.addEventListener('click', (e) => {
        const rect = card.getBoundingClientRect();
        createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

// ==========================================
// Accordion 機能
// ==========================================

document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const arrow = item.querySelector('.accordion-arrow');
    
    // 初期状態で全て開いておく
    content.style.maxHeight = content.scrollHeight + 'px';
    
    header.addEventListener('click', () => {
        const isOpen = content.style.maxHeight !== '0px';
        
        if (isOpen) {
            content.style.maxHeight = '0px';
            arrow.textContent = '→';
            item.style.opacity = '0.6';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            arrow.textContent = '↓';
            item.style.opacity = '1';
        }
    });
});

// ==========================================
// パララックス効果（Hero）
// ==========================================

if (!isTouchDevice) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroLeft = document.querySelector('.hero-left');
        const heroRight = document.querySelector('.hero-right');
        
        if (heroLeft) {
            heroLeft.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (heroRight) {
            heroRight.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ==========================================
// マウスフォロー効果（デスクトップのみ）
// ==========================================

if (!isTouchDevice) {
    const cursorFollow = document.createElement('div');
    cursorFollow.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(0, 102, 255, 0.3);
        pointer-events: none;
        z-index: 10001;
        transition: transform 0.15s ease;
    `;
    document.body.appendChild(cursorFollow);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursorFollow.style.left = cursorX + 'px';
        cursorFollow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
    
    // ホバー時にカーソルを大きく
    document.querySelectorAll('a, button, .point-card-modern, .job-card-large, .voice-card-magazine, .accordion-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollow.style.transform = 'scale(2.5)';
            cursorFollow.style.background = 'rgba(0, 102, 255, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollow.style.transform = 'scale(1)';
            cursorFollow.style.background = 'rgba(0, 102, 255, 0.3)';
        });
    });
}

// ==========================================
// Timeline カードのインタラクション
// ==========================================

document.querySelectorAll('.timeline-event').forEach((event, index) => {
    event.style.opacity = '0';
    event.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
    event.style.transition = `all 0.6s ease ${index * 0.1}s`;
});

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-event').forEach(event => {
    timelineObserver.observe(event);
});

// ==========================================
// ランダムなアニメーション遅延
// ==========================================

document.querySelectorAll('.intro-text-block').forEach((block, index) => {
    block.style.animationDelay = `${index * 0.1}s`;
});

// ==========================================
// セクションに入るたびのアニメーション
// ==========================================

const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'sectionEnter 0.8s ease';
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => sectionObserver.observe(section));

const sectionEnterStyle = document.createElement('style');
sectionEnterStyle.textContent = `
    @keyframes sectionEnter {
        from {
            opacity: 0.7;
            transform: scale(0.98);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(sectionEnterStyle);

// ==========================================
// 背景に動くパーティクル（Hero セクション）
// ==========================================

if (!isTouchDevice) {
    const hero = document.querySelector('.hero-split');
    
    if (hero) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            hero.appendChild(particle);
        }
        
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(30px, -30px);
                }
                50% {
                    transform: translate(-20px, -60px);
                }
                75% {
                    transform: translate(-40px, -30px);
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }
}

// ==========================================
// Job Button のホバーエフェクト
// ==========================================

document.querySelectorAll('.job-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // リップルエフェクト
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        const rect = button.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(20);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    });
});

// ==========================================
// Logo クリック時の回転
// ==========================================

document.querySelector('.logo')?.addEventListener('click', (e) => {
    e.target.style.animation = 'logoSpin 1s ease';
    setTimeout(() => {
        e.target.style.animation = '';
    }, 1000);
    
    const logoSpinStyle = document.createElement('style');
    logoSpinStyle.textContent = `
        @keyframes logoSpin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(720deg);
            }
        }
    `;
    document.head.appendChild(logoSpinStyle);
});

// ==========================================
// Console メッセージ
// ==========================================

console.log('%c秋田基準寝具 インターンシップ 2025', 'color: #0066FF; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%c一緒に働ける日を楽しみにしています！✨', 'color: #666; font-size: 16px; font-weight: bold;');
console.log('%cこのサイトを気に入っていただけましたか？', 'color: #FF6B9D; font-size: 14px;');
