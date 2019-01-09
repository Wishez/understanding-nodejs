
console.log('😍')
window.addEventListener('load', onInit)

function onInit() {
  console.log('🤩')

  const speechForm =$('#speechForm')
  const speechInput =$('#speechText')

  $('#placeholderSpeech').addEventListener('click', () => {
    const placeholderText = speechInput.getAttribute('placeholder')
    listenText(placeholderText)
  })
  
  speechForm.addEventListener('submit', (event) => {
    event.preventDefault()
    listenText(speechInput.value)
  })
}

function listenText(text, lang = 'ru-RU') {
  const speach = new SpeechSynthesisUtterance(text)
  speach.lang = lang

  try {
    speechSynthesis.speak(speach)
  } catch(ex) {
    cosnole.log('The browser doesn\'t support speach functionality!')
  }
}

function $(selector) {
  return document.querySelector(selector)
}