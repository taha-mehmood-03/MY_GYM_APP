// textToSpeech.js

export const speakText = (text) => {
    if (!window.speechSynthesis) {
      console.error("Speech Synthesis not supported in this browser.");
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set the language to English (US), you can change it as needed
    utterance.rate = 0.7; // Speed of the speech
    utterance.pitch = 1; // Pitch of the voice
    utterance.volume = 1; // Volume
  
    // Optional: You can add event listeners for `onstart`, `onend`, or `onerror` if needed
    utterance.onstart = () => console.log("Speech started");
    utterance.onend = () => console.log("Speech ended");
  
    window.speechSynthesis.speak(utterance);
  };
  