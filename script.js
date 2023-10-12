const goTop = document.getElementById("goTop");

window.onscroll = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goTop.style.display = "block";
  } else {
    goTop.style.display = "none";
  }
};

goTop?.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

const currentSorah = document.querySelector("#currentSorah");
const currentSorahInput = document.querySelector("#currentSorahInput");
const currentAyaInput = document.querySelector("#currentAyaInput");
const aya = document.querySelectorAll(".AYANUM");

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
  currentAyaInput.setAttribute("max", currentAyaInput.dataset.ayas);
  const currentAyaInputValue = currentAyaInput.value;
  currentSorah.href = `#${currentSorahInput.value}${
    currentAyaInputValue ? `_${currentAyaInputValue}` : ""
  }`;
});

function getValues() {
  const storedSaveAya = JSON.parse(localStorage.getItem("saveAya"));
  if (storedSaveAya) {
    currentSorahInput.value = storedSaveAya?.currentSorah;
    currentAyaInput.value = storedSaveAya?.currentAya;
  }
}

function showNoti(aya = null, sorah = null) {
  if (aya && sorah) {
    toastr["success"](`تم حفظ الاية ${aya} من ${sorah}`);
  } else {
    toastr["success"](`تم الحفظ`);
  }
  toastr.options = { closeButton: true, progressBar: true, timeOut: "3000" };
}

aya.forEach((ay) => {
  ay.addEventListener("dblclick", () => {
    const sorah = ay.closest("div").id;
    const sorahName = ay.closest("div").querySelector(".sorah").textContent;
    const ayaNum = +ay.textContent.slice(1, -1);
    const saveAya = {
      currentSorah: sorah,
      currentAya: ayaNum,
    };
    localStorage.setItem("saveAya", JSON.stringify(saveAya));
    showNoti(ayaNum, sorahName);
    getValues();
  });
});

const save = document.querySelector("#save");
save.addEventListener("click", () => {
  const currentSorahInputValue = currentSorahInput.value;
  const currentAyaInputValue = currentAyaInput.value;
  if (currentSorahInputValue && currentAyaInputValue) {
    const saveAya = {
      currentSorah: currentSorahInputValue,
      currentAya: currentAyaInputValue,
    };
    localStorage.setItem("saveAya", JSON.stringify(saveAya));
    showNoti();
  }
});

getValues();

function setMaxValue() {
  var selectedIndex = currentSorahInput.selectedIndex;
  var selectedOption = currentSorahInput.options[selectedIndex];
  var selectedText = +selectedOption.title;
  currentAyaInput.max = selectedText;
}

setMaxValue();

currentSorahInput.addEventListener("change", () => {
  setMaxValue();
});

function highlightWord(selector, word) {
  const h3Elements = document.querySelectorAll(selector);

  h3Elements.forEach((h3Element) => {
    const originalText = h3Element.innerHTML;
    const newText = originalText.replace(
      new RegExp(word, "g"),
      `<span class='red'>${word}</span>`
    );
    h3Element.innerHTML = newText;
  });
}

// highlightWord("h3", "ٱللَّهِ");
// highlightWord("h3", "ٱللَّهَ");
// highlightWord("h3", "لِلَّهِ");
// highlightWord("h3", "لِّلَّهِ");
// highlightWord("h3", "ٱللَّهُ");
// highlightWord("h2", "ٱللَّهِ");
