type AnnounceQueueCallParams = {
  queueNumber: string;
  counterNumber?: string | null;
};

const DIGIT_WORDS: Record<string, string> = {
  "0": "nol",
  "1": "satu",
  "2": "dua",
  "3": "tiga",
  "4": "empat",
  "5": "lima",
  "6": "enam",
  "7": "tujuh",
  "8": "delapan",
  "9": "sembilan",
};

const COUNTER_WORDS = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
];

let audioUnlocked = false;
let audioContext: AudioContext | null = null;

function spellDigits(value: string) {
  return value
    .split("")
    .map((char) => DIGIT_WORDS[char] ?? char)
    .join(" ");
}

function formatQueueNumberForSpeech(queueNumber: string) {
  const [prefix, digits = ""] = queueNumber.split("-");
  const prefixPart = prefix ? `huruf ${prefix}` : "";
  const digitPart = spellDigits(digits);

  return [prefixPart, digitPart].filter(Boolean).join(", ");
}

function formatCounterForSpeech(counterNumber: string) {
  const parsed = Number.parseInt(counterNumber, 10);

  if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 10) {
    return COUNTER_WORDS[parsed];
  }

  return spellDigits(counterNumber);
}

function pickIndonesianVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "id-id") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("id")) ??
    voices.find((voice) =>
      /indonesia|bahasa|damayanti|gadis|siti/i.test(voice.name),
    ) ??
    null
  );
}

function playUnlockTone() {
  try {
    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
  } catch {
    // ignore — TTS may still work
  }
}

function speakIndonesian(text: string) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  let hasSpoken = false;

  const startSpeaking = () => {
    if (hasSpoken) {
      return;
    }

    hasSpoken = true;

    const synthesis = window.speechSynthesis;

    synthesis.cancel();

    window.setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voice = pickIndonesianVoice(synthesis.getVoices());

      if (voice) {
        utterance.voice = voice;
      }

      synthesis.speak(utterance);

      // Chrome bug: speech sometimes pauses immediately
      window.setTimeout(() => {
        if (synthesis.paused) {
          synthesis.resume();
        }
      }, 120);
    }, 80);
  };

  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    startSpeaking();
    return;
  }

  const onVoicesChanged = () => {
    window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
    startSpeaking();
  };

  window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
  window.setTimeout(startSpeaking, 400);
}

export function isQueueAudioUnlocked() {
  return audioUnlocked;
}

export function unlockQueueAudio() {
  audioUnlocked = true;
  playUnlockTone();

  window.speechSynthesis?.getVoices();
  speakIndonesian("Suara panggilan antrean aktif.");

  return true;
}

export function announceQueueCall({
  queueNumber,
  counterNumber,
}: AnnounceQueueCallParams) {
  if (!audioUnlocked) {
    return;
  }

  playUnlockTone();

  const spokenNumber = formatQueueNumberForSpeech(queueNumber);
  let text = `Perhatian. Panggilan nomor antrean ${spokenNumber}`;

  if (counterNumber) {
    text += `, silakan menuju loket ${formatCounterForSpeech(counterNumber)}`;
  }

  text += ".";

  speakIndonesian(text);
}

export function preloadIndonesianVoice() {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.getVoices();
}

// Backward-compatible exports
export const unlockSpeechSynthesis = unlockQueueAudio;
