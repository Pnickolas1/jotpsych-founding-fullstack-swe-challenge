import React from "react";
import { useState } from "react";
import AudioRecorder from "./components/AudioRecorder";
import { VersionManager } from "./components/VersionManager";

function TranscriptionText({
  transcription,
  loading,
  error,
}: {
  transcription: string;
  loading: boolean;
  error: boolean | null;
}) {
  if (loading) {
    return (
      <div className="w-full mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">Transcribing:</h2>
        <div className="w-full h-4 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="w-full h-4 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-100 rounded-lg">
        <h2 className="font-semibold mb-2 text-red-600">Error:</h2>
        <p className="text-red-600">
          {error || "There was an error, please try again"}
        </p>
      </div>
    );
  }
  return (
    <>
      {transcription ? (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      ) : null}
    </>
  );
}

function App() {
  const [transcription, setTranscription] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscriptionChange = (arg: boolean) => {
    setIsTranscribing(arg);
  };

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    setIsTranscribing(false);
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-8">Audio Transcription Demo</h1>
        <AudioRecorder
          onTranscriptionComplete={handleTranscriptionComplete}
          onTranscriptionChange={handleTranscriptionChange}
          isTranscribing={isTranscribing}
          setError={setError}
          error={error}
        />
        <TranscriptionText
          transcription={transcription}
          loading={isTranscribing}
          error={error}
        />
        <VersionManager />
      </div>
    </div>
  );
}

export default App;
