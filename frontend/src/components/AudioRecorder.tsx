import React, { useState, useEffect, useRef } from "react";
import APIService from "../services/APIService";

const AudioRecorder = ({
  onTranscriptionComplete,
  onTranscriptionChange,
  isTranscribing,
  setError,
  error,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [finalRecordingTime, setFinalRecordingTime] = useState(0);
  const MAX_RECORDING_TIME = 10;

  const recordingTimeRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    recordingTimeRef.current = recordingTime;
    mediaRecorderRef.current = mediaRecorder;
    isRecordingRef.current = isRecording;
  }, [recordingTime, mediaRecorder, isRecording]);

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setFinalRecordingTime(recordingTimeRef.current);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    let interval: null | number = null;

    if (isRecording) {
      interval = setInterval(() => {
        const newTime = recordingTimeRef.current + 1;
        setRecordingTime(newTime);

        if (newTime >= MAX_RECORDING_TIME) {
          stopRecording();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setRecordingTime(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);
        onTranscriptionChange(true);
        try {
          // TODO: Use APIService for api requests
          const response = await APIService.transcribeAudio(audioBlob);

          // const response = await fetch("http://localhost:8000/transcribe", {
          //   method: "POST",
          //   body: formData,
          // });
          // const data = await response.json();
          if (response.requiresRefresh) {
            setError(
              "Application needs to be refreshed. Please reload the page."
            );
            return;
          }

          if (response.error) {
            setError(`Transcription failed: ${response.error}`);
            onTranscriptionChange();
            return;
          }
          if (response.data) {
            onTranscriptionComplete(response.data.transcription);
          }
        } catch (error) {
          console.error("Error sending audio:", error);
          onTranscriptionChange(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {finalRecordingTime > 0 && (
        <p className="text-sm text-gray-600">
          Final recording time: {finalRecordingTime}s
        </p>
      )}
      {isTranscribing ? (
        <p className="text-lg text-gray-600 animate-pulse p-4 bg-gray-100 rounded-lg">
          Transcribing
        </p>
      ) : (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-3 rounded-lg font-semibold ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRecording
            ? `Stop Recording (${MAX_RECORDING_TIME - recordingTime}s)`
            : "Start Recording"}
        </button>
      )}
      {isRecording && (
        <p className="text-sm text-gray-600">
          Recording in progress (Current time: {recordingTime}s)
        </p>
      )}
    </div>
  );
};

export default AudioRecorder;
