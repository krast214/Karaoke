import React, { useState, useEffect, useRef } from 'react';
import { Play, Users, Trophy, Timer, Shuffle, Music, Star, Award, Volume2, VolumeX } from 'lucide-react';

const KaraokeGameShow = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [teams, setTeams] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [gameData, setGameData] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContext = useRef(null);
  const currentAudio = useRef(null);
  
  // Move game state to parent level to prevent reset on team updates
  const [gameState, setGameState] = useState({
    currentRound: 0,
    showAnswer: false,
    gameKey: Date.now()
  });

  const updateGameState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Sound effect functions
  const playSound = (frequency, duration = 200, type = 'sine') => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration / 1000);
  };

  const playCorrectSound = () => {
    playSound(523.25, 100); // C5
    setTimeout(() => playSound(659.25, 100), 100); // E5
    setTimeout(() => playSound(783.99, 200), 200); // G5
  };

  const playWrongSound = () => {
    playSound(196, 400, 'sawtooth'); // G3 with harsh tone
  };

  const playButtonSound = () => {
    playSound(440, 100); // A4
  };

  const playTimerSound = () => {
    playSound(880, 100); // A5
    setTimeout(() => playSound(880, 100), 100);
    setTimeout(() => playSound(880, 100), 200);
  };

  const playGameStartSound = () => {
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, index) => {
      setTimeout(() => playSound(note, 150), index * 100);
    });
  };

  const playSongClip = (audioUrl) => {
    if (!audioUrl) {
      alert("No audio file added for this song yet! Replace the empty audioUrl with your song file URL.");
      return;
    }
    
    // Stop any currently playing audio
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }
    
    // Create new audio element
    currentAudio.current = new Audio(audioUrl);
    currentAudio.current.play();
    
    // Stop after 15 seconds
    setTimeout(() => {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }
    }, 15000);
  };

  // Sample data for games
  const emojiSongs = [
    { emoji: "🌈💔", answer: "Somewhere Over The Rainbow", artist: "Judy Garland" },
    { emoji: "🔥💍", answer: "Ring of Fire", artist: "Johnny Cash" },
    { emoji: "🌙🚶‍♂️", answer: "Blue Moon", artist: "Frank Sinatra" },
    { emoji: "⚡👦", answer: "Thunderstruck", artist: "AC/DC" },
    { emoji: "💃🕺", answer: "Dancing Queen", artist: "ABBA" },
    { emoji: "🌟👁️", answer: "Starry Starry Night", artist: "Don McLean" },
    { emoji: "🚗🛣️", answer: "Life is a Highway", artist: "Tom Cochrane" },
    { emoji: "🌊🏄‍♂️", answer: "Surfin' USA", artist: "Beach Boys" },
    { emoji: "❄️👸", answer: "Let It Go", artist: "Frozen Soundtrack" },
    { emoji: "🕺💫", answer: "Stayin' Alive", artist: "Bee Gees" },
    { emoji: "🌹💕", answer: "Every Rose Has Its Thorn", artist: "Poison" },
    { emoji: "🎸🔥", answer: "We Will Rock You", artist: "Queen" }
  ];

  const nameThatTuneSongs = [
    { 
      title: "Bohemian Rhapsody", 
      artist: "Queen", 
      hint: "Rock opera masterpiece",
      audioUrl: "https://www.soundjay.com/misc/sounds/beep-07a.wav" // Placeholder - replace with actual song clips
    },
    { 
      title: "Sweet Caroline", 
      artist: "Neil Diamond", 
      hint: "Crowd favorite sing-along",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Don't Stop Believin'", 
      artist: "Journey", 
      hint: "Small town girl...",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "I Will Survive", 
      artist: "Gloria Gaynor", 
      hint: "Disco anthem of empowerment",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Livin' on a Prayer", 
      artist: "Bon Jovi", 
      hint: "Tommy and Gina's story",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Mr. Brightside", 
      artist: "The Killers", 
      hint: "2000s indie rock hit",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Wonderwall", 
      artist: "Oasis", 
      hint: "Britpop classic",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Love Story", 
      artist: "Taylor Swift", 
      hint: "Romeo and Juliet inspired",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Shake It Off", 
      artist: "Taylor Swift", 
      hint: "Haters gonna hate...",
      audioUrl: "" // Add your song URL here
    },
    { 
      title: "Uptown Funk", 
      artist: "Mark Ronson ft. Bruno Mars", 
      hint: "Saturday night fever",
      audioUrl: "" // Add your song URL here
    }
  ];

  const genres = ['Country', 'Opera', 'Rap/Hip-Hop', 'Heavy Metal', 'Jazz', 'Reggae', 'Folk', 'Electronic'];
  
  const crossGenreSongs = [
    { title: "Baby One More Time", originalGenre: "Pop" },
    { title: "Bohemian Rhapsody", originalGenre: "Rock" },
    { title: "Sweet Caroline", originalGenre: "Pop Rock" },
    { title: "I Will Survive", originalGenre: "Disco" },
    { title: "Don't Stop Believin'", originalGenre: "Rock" },
    { title: "My Girl", originalGenre: "Soul" },
    { title: "Wonderwall", originalGenre: "Britpop" },
    { title: "Love Story", originalGenre: "Country Pop" }
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const addTeam = (teamName) => {
    if (teamName && !teams.find(t => t.name === teamName)) {
      setTeams([...teams, { name: teamName, score: 0, id: Date.now() }]);
    }
  };

  const updateScore = (teamId, points) => {
    setTeams(prevTeams => prevTeams.map(team => 
      team.id === teamId ? { ...team, score: team.score + points } : team
    ));
    if (points > 0) {
      playCorrectSound();
    } else if (points < 0) {
      playWrongSound();
    } else {
      playButtonSound();
    }
  };

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsTimerRunning(true);
    playTimerSound();
  };

  const generateRandomTeams = () => {
    const shuffled = [...teams].sort(() => 0.5 - Math.random());
    const teamCount = Math.min(shuffled.length, 4);
    setSelectedTeams(shuffled.slice(0, teamCount));
  };

  const TeamRegistration = () => {
    const [teamName, setTeamName] = useState('');

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                🎤 KARAOKE GAME SHOW 🎤
              </h1>
              <p className="text-xl text-white/90">Register your teams and get ready to rock!</p>
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="mt-4 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all"
              >
                {soundEnabled ? <Volume2 className="inline mr-2" /> : <VolumeX className="inline mr-2" />}
                Sound {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-6">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Team Registration</h2>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && teamName && (addTeam(teamName), setTeamName(''))}
                />
                <button
                  onClick={() => teamName && (addTeam(teamName), setTeamName(''), playButtonSound())}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  Add Team
                </button>
              </div>
              {/* Add any additional TeamRegistration content here */}
            </div>
            {teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-4 rounded-xl flex justify-between items-center">
                    <span className="font-bold text-lg">{team.name}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Score: {team.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/30 p-6 rounded-2xl">
                <h3 className="text-3xl font-bold mb-2">"{currentSongNTT.title}"</h3>
                <p className="text-xl text-white/90">by {currentSongNTT.artist}</p>
              </div>
            )}
          </div>
        </div>
      </>
    );

        default:
          return <div>Game not found</div>;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Timer Display */}
          {timer > 0 && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold z-10">
              <Timer className="inline mr-2" />
              {timer}s
            </div>
          )}

          <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            {renderGame()}

            {/* Scoring Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full text-2xl font-bold text-center text-gray-800 mb-4">Award Points:</h3>
              {teams.map(team => (
                <div key={team.id} className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white p-4 rounded-xl flex justify-between items-center">
                  <span className="font-bold">{team.name} ({team.score})</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateScore(team.id, 1)}
                      className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateScore(team.id, 5)}
                      className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateScore(team.id, 10)}
                      className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-all"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => updateScore(team.id, -1)}
                      className="bg-red-500/50 px-3 py-1 rounded hover:bg-red-500/70 transition-all"
                    >
                      -1
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation - hide Next Round button for emojiSongs since it has its own */}
            <div className="flex justify-center gap-4 mt-8">
              {currentGame !== 'emojiSongs' && (
                <button
                  onClick={() => {
                    updateGameState({
                      currentRound: gameState.currentRound + 1,
                      showAnswer: false,
                      gameKey: Date.now()
                    });
                    playButtonSound();
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all font-bold"
                >
                  Next Round
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentScreen('gameSelect');
                  updateGameState({ currentRound: 0, showAnswer: false, gameKey: Date.now() }); // Reset game state when leaving
                  playButtonSound();
                }}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-bold"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  let ScreenComponent;
  switch(currentScreen) {
    case 'teams':
      ScreenComponent = <TeamRegistration />;
      break;
    case 'gameSelect':
      ScreenComponent = <GameSelection />;
      break;
    case 'leaderboard':
      ScreenComponent = <Leaderboard />;
      break;
    case 'game':
      ScreenComponent = <GameScreen />;
      break;
    default:
      ScreenComponent = <TeamRegistration />;
  }
  return ScreenComponent;
// ...existing code...

export default KaraokeGameShow;