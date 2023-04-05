// ********************** زر الذهاب الى اعلى الصفحة ***************
let goTop = document.getElementById("goTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goTop.style.display = "block";
  } else {
    goTop.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
goTop?.addEventListener('click', function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})

const currentSorah = document.querySelector('#currentSorah');
const soraDiv = document.querySelectorAll('div');
const aya = document.querySelectorAll('.AYANUM');
const currentSoraAya = document.querySelectorAll('div .AYANUM');

for (let i = 0; i < currentSoraAya.length; i++){
    const ayaId = aya[i].getAttribute('id');
    // console.log(ayaId);
}

const currentSorahInput = document.querySelector('#currentSorahInput')
currentSorahInput.addEventListener('change', () => { 
    const currentSorahDiv = document.querySelectorAll(`#${currentSorahInput.value} span`);
    for (let i = 0; i < currentSorahDiv.length; i++) {            
            currentSorahDiv[i].setAttribute('id',`${currentSorahInput.value}_${i+1}`)
    }
})
currentSorah.addEventListener('click', () => {
                const currentAyaInput = document.querySelector('#currentAyaInput').value;
    if (currentAyaInput) {
        currentSorah.href = `#${currentSorahInput.value}_${currentAyaInput}`;
    } else {  
        currentSorah.href = `#${currentSorahInput.value}`;
    }
             });