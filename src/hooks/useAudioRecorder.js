// Hook será implementado

export const useAudioRecorder = () => {
  // A implementar
  return {
    startRecording: () => console.log("useAudioRecorder: start"),
    stopRecording: () => console.log("useAudioRecorder: stop"),
    audioBlob: null,
    isRecording: false,
    error: null,
  };
};
