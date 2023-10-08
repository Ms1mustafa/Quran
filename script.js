// ********************** زر الذهاب الى اعلى الصفحة ***************
let goTop = document.getElementById("goTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goTop.style.display = "block";
  } else {
    goTop.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
goTop?.addEventListener("click", function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

const currentSorah = document.querySelector("#currentSorah");
const soraDiv = document.querySelectorAll("div");
const aya = document.querySelectorAll(".AYANUM");
const currentSoraAya = document.querySelectorAll("div .AYANUM");

for (let i = 0; i < currentSoraAya.length; i++) {
  const ayaId = aya[i].getAttribute("id");
  // console.log(ayaId);
}

const currentSorahInput = document.querySelector("#currentSorahInput");
currentSorah.addEventListener("click", () => {
  const currentSorahDiv = document.querySelectorAll(
    `#${currentSorahInput.value} span`
  );
  for (let i = 0; i < currentSorahDiv.length; i++) {
    currentSorahDiv[i].setAttribute(
      "id",
      `${currentSorahInput.value}_${i + 1}`
    );
  }
});

currentSorahInput.addEventListener("change", () => {
  const currentAyaInput = document.querySelector("#currentAyaInput");
  currentAyaInput.setAttribute('max', currentAyaInput.dataset.ayas);
  console.log(currentAyaInput.dataset.ayas);
});

currentSorah.addEventListener("click", () => {
  const currentAyaInput = document.querySelector("#currentAyaInput").value;
  if (currentAyaInput) {
    currentSorah.href = `#${currentSorahInput.value}_${currentAyaInput}`;
  } else {
    currentSorah.href = `#${currentSorahInput.value}`;
  }
});

// Store the object in local storage

// Retrieve the object from local storage

const save = document.querySelector("#save");
save.addEventListener("click", () => {
  const currentSorahInput2 = document.querySelector("#currentSorahInput");
  const currentAyaInput2 = document.querySelector("#currentAyaInput");
  if (currentSorahInput2.value && currentAyaInput2.value) {
    let saveAya = {
      currentSorah: currentSorahInput2.value,
      currentAya: currentAyaInput2.value,
    };

    localStorage.setItem("saveAya", JSON.stringify(saveAya));

    let storedSaveAya = JSON.parse(localStorage.getItem("saveAya"));
    console.log(storedSaveAya.currentSorah); // Output: John
    toastr["success"]("تم الحفظ");
    toastr.options = {
      closeButton: true,
      progressBar: true,
      timeOut: "3000",
    };
  }
});

let storedSaveAya = JSON.parse(localStorage.getItem("saveAya"));
document.querySelector("#currentSorahInput").value = storedSaveAya.currentSorah;
document.querySelector("#currentAyaInput").value = storedSaveAya.currentAya;
