import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

document.querySelector('#app').innerHTML = `
  <nav class="social-nav">
    <a href="#" class="social-button facebook">
      <i class="fab fa-facebook-f"></i>
      <span>Facebook</span>
    </a>
    <a href="#" class="social-button twitter">
      <i class="fab fa-twitter"></i>
      <span>Twitter</span>
    </a>
    <a href="#" class="social-button instagram">
      <i class="fab fa-instagram"></i>
      <span>Instagram</span>
    </a>
    <a href="#" class="social-button linkedin">
      <i class="fab fa-linkedin-in"></i>
      <span>LinkedIn</span>
    </a>
    <a href="#" class="social-button github">
      <i class="fab fa-github"></i>
      <span>GitHub</span>
    </a>
  </nav>
`
