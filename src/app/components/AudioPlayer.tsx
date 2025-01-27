import { useState } from 'react';
import { Play, Square, Volume2, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = async () => {
    try {
      if (isPlaying && audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        return;
      }

      setError(null);
      setIsLoading(true);
      setIsPlaying(true);
      
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to generate speech');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      
      newAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      newAudio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Error playing audio');
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      setAudio(newAudio);
      await newAudio.play();
    } catch (error: any) {
      console.error('Error playing audio:', error);
      setError(error.message || 'Failed to generate speech');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={playAudio}
        disabled={isLoading}
        className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${
          error ? 'text-red-500 hover:bg-red-50' : ''
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={error || (isPlaying ? 'Stop' : 'Play message')}
      >
        {error ? (
          <AlertCircle className="w-4 h-4" />
        ) : isPlaying ? (
          <Square className="w-4 h-4 text-gray-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {error && (
        <div className="absolute left-full ml-2 bg-red-50 text-red-500 text-xs py-1 px-2 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
} 