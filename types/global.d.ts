declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify: {
      Player: any; // Replace 'any' with the actual type if known
    };
  }
  namespace Spotify {
    interface SpotifyPlayer {
      _options: {
        getOAuthToken: (callback: (token: string) => void) => void;
        id: string;
      };
      connect: () => Promise<boolean>;
      addListener: (
        event: string,
        cb: (state: Spotify.PlaybackState) => void
      ) => void;
      pause: () => Promise<void>;
      resume: () => Promise<void>;
      togglePlay: () => Promise<void>;
      getCurrentState: () => Promise<Spotify.PlaybackState | null>;
      setName: (name: string) => Promise<void>;
      getVolume: () => Promise<number>;
      setVolume: (volume: number) => Promise<void>;
      previousTrack: () => Promise<void>;
      nextTrack: () => Promise<void>;
      seek: (positionMs: number) => Promise<void>;
      getCurrentState: () => Promise<Spotify.PlaybackState | null>;
    }
  }
}

export {}