let quranData = null; // Cache for Quran data

async function getQuranAudioInfo() {
  if (quranData) {
    // If the data is already cached, return it immediately
    return quranData;
  }

  try {
    const response = await fetch(
      "https://api.alquran.cloud/v1/quran/ar.alafasy"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const data = await response.json();
    quranData = data; // Cache the data
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function getSurahs(value, ayahsNum, title) {
  const currentSorahInput = document.querySelector("#currentSorahInput");
  currentSorahInput.insertAdjacentHTML(
    "beforeend",
    `<option value="${value}" data-ayas="${ayahsNum}" title="${ayahsNum}">${title}</option>`
  );
}

function formatSurah(surah, surahEn) {
  const div = document.createElement("div");
  div.id = `${surahEn}`;
  const open =
    surahEn === "Al-Faatiha"
      ? ""
      : "<h2 class='surahOpen'>بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</h2>";
  div.innerHTML = `
    <h1 class="sorah">${surah}</h1>
    ${open}
    <h3 class="${surahEn}Ayahs"></h3>
  `;
  document.querySelector(".main").appendChild(div);
}

let currentlyPlayingAudio = null;

function appendAyah(surahEn, ayah, num, audio) {
  const h3 = document.querySelector(`[class="${surahEn}Ayahs"]`);
  const ayahHTML = `<span class="${num}" ondblclick="playAudio('${audio}')">${ayah}</span> <span class="AYANUM" id='${surahEn}_${num}'>(${num})</span>`;
  h3.insertAdjacentHTML("beforeend", ayahHTML);
}

function playAudio(audioURL) {
  if (currentlyPlayingAudio) {
    currentlyPlayingAudio.pause();
    currentlyPlayingAudio.currentTime = 0;
  }

  const audio = new Audio(audioURL);
  audio.play();
  currentlyPlayingAudio = audio;
}

async function getQuran() {
  const loadingElement = document.getElementById("loading");
  try {
    if (!quranData) {
      // If data is not in cache, show the loading element
      loadingElement.style.display = "auto";
      quranData = await getQuranAudioInfo();
      loadingElement.style.display = "none"; // Hide the loading element after data is fetched
    }
    const quran = await getQuranAudioInfo();
    quran.data.surahs.forEach((surah) => {
      getSurahs(
        surah.englishName.replace(/'/g, ""),
        surah.ayahs.length,
        surah.name
      );
      formatSurah(surah.name, surah.englishName.replace(/'/g, ""));
      surah.ayahs.forEach((ayah, i) => {
        const formattedAyah1 = `${ayah.text}`;
        const formattedAyah =
          surah.englishName.replace(/'/g, "") != "Al-Faatiha"
            ? formattedAyah1.replace(
                /بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/,
                ""
              )
            : formattedAyah1;
        appendAyah(
          surah.englishName.replace(/'/g, ""),
          formattedAyah,
          i + 1,
          ayah.audio
        );
      });
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }

  const currentSorah = document.querySelector("#currentSorah");
  const currentSorahInput = document.querySelector("#currentSorahInput");
  const currentAyaInput = document.querySelector("#currentAyaInput");
  const aya = document.querySelectorAll(".AYANUM");

  currentSorah.addEventListener("click", () => {
    const currentSorahDiv = document.querySelectorAll(
      `#${currentSorahInput.value} span`
    );

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

  const sorah = document.querySelectorAll(".sorah");
  sorah.forEach((so) => {
    so.addEventListener("dblclick", () => {
      const sorahName = so.closest("div").id;
      const saveAya = {
        currentSorah: sorahName,
        currentAya: null,
      };
      localStorage.setItem("saveAya", JSON.stringify(saveAya));
      showNoti(sorahName);
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
}

getQuran();

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
