const dragon = document.getElementById('dragon')
const fireEls = document.querySelectorAll('#fire ellipse')
const bubble = document.getElementById('bubble')

const phrases = [
  '완료! ✨',
  '다 했어요~ 🔥',
  '뿌우웅! 🐲',
  '훌륭해요! 💜',
  '완성! ⚡',
  '냠냠~ ✅',
  '뿅! 🌟',
]

let animating = false

function randomPhrase() {
  return phrases[Math.floor(Math.random() * phrases.length)]
}

function showFire() {
  fireEls.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.03}s`
    el.style.animation = `fire-flicker ${0.1 + Math.random() * 0.1}s ease-in-out infinite alternate`
    el.style.opacity = '1'
  })
}

function hideFire() {
  fireEls.forEach(el => {
    el.style.animation = ''
    el.style.opacity = '0'
  })
}

function appear(cwd) {
  if (animating) return
  animating = true

  bubble.textContent = cwd ? `📁 ${cwd}` : randomPhrase()
  bubble.style.animation = 'none'
  bubble.style.opacity = '0'
  hideFire()

  // Reset to off-screen
  dragon.style.animation = 'none'
  dragon.style.transform = 'translateX(360px) rotate(15deg)'
  dragon.style.opacity = '0'
  void dragon.offsetWidth // force reflow

  // 1. Fly in (750ms)
  dragon.style.animation = 'fly-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards'

  setTimeout(() => {
    // 2. Hover
    dragon.style.animation = ''
    dragon.style.transform = 'translateX(0) rotate(0deg)'
    dragon.style.opacity = '1'
    void dragon.offsetWidth
    dragon.style.animation = 'hover 2.2s ease-in-out infinite'

    // 3. Show bubble (300ms after hover starts)
    setTimeout(() => {
      bubble.style.animation = 'bubble-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      bubble.style.opacity = '1'
    }, 300)

    // 4. Breathe fire (900ms)
    setTimeout(() => showFire(), 900)
    setTimeout(() => hideFire(), 2800)

    // 5. Hide bubble (4000ms)
    setTimeout(() => {
      bubble.style.animation = 'bubble-fade 0.25s ease-out forwards'
    }, 4000)

    // 6. Fly out (4500ms)
    setTimeout(() => {
      dragon.style.animation = 'fly-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) forwards'

      setTimeout(() => {
        dragon.style.animation = 'none'
        dragon.style.transform = 'translateX(360px)'
        dragon.style.opacity = '0'
        bubble.style.animation = 'none'
        bubble.style.opacity = '0'
        animating = false
      }, 650)
    }, 4500)
  }, 760)
}

window.dragonAPI.onAppear(appear)
