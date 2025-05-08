import { useState, useEffect, useRef, ChangeEvent } from "react";

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

type TimerMode = "work" | "shortBreak" | "longBreak";

export default function Pomodoro() {
  // Default timer settings (in minutes)
  const defaultSettings: TimerSettings = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  };

  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [tempSettings, setTempSettings] = useState<TimerSettings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio when component mounts
  useEffect(() => {
    audioRef.current = new Audio("/notification.wav");
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playNotification();

      // Session completed
      if (mode === "work") {
        const newSessions = sessions + 1;
        setSessions(newSessions);

        // Determine which break type to use
        if (newSessions % settings.longBreakInterval === 0) {
          setMode("longBreak");
          setTimeLeft(settings.longBreak * 60);
        } else {
          setMode("shortBreak");
          setTimeLeft(settings.shortBreak * 60);
        }
      } else {
        // Break completed, back to work
        setMode("work");
        setTimeLeft(settings.work * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, sessions, settings]);

  // Update timer when settings change
  useEffect(() => {
    if (!isActive) {
      if (mode === "work") {
        setTimeLeft(settings.work * 60);
      } else if (mode === "shortBreak") {
        setTimeLeft(settings.shortBreak * 60);
      } else {
        setTimeLeft(settings.longBreak * 60);
      }
    }
  }, [settings, mode, isActive]);

  // Play notification sound
  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  // Control functions
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(settings.work * 60);
    setSessions(0);
  };

  const skipToNext = () => {
    setIsActive(false);
    if (mode === "work") {
      const newSessions = sessions + 1;
      setSessions(newSessions);

      if (newSessions % settings.longBreakInterval === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setMode("work");
      setTimeLeft(settings.work * 60);
    }
  };

  // Settings handlers
  const toggleSettings = () => {
    if (showSettings) {
      // When closing the settings panel without saving, reset temp settings
      setTempSettings({ ...settings });
    }
    setShowSettings(!showSettings);
    setSettingsError(null);
  };

  const handleSettingChange = (
    setting: keyof TimerSettings,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10) || 1;
    setTempSettings({
      ...tempSettings,
      [setting]: value,
    });
  };

  const saveSettings = () => {
    // Validate settings
    if (
      tempSettings.work < 1 ||
      tempSettings.shortBreak < 1 ||
      tempSettings.longBreak < 1 ||
      tempSettings.longBreakInterval < 1
    ) {
      setSettingsError("All values must be at least 1");
      return;
    }

    setSettings(tempSettings);
    setShowSettings(false);
    setSettingsError(null);

    // Update current timer if needed
    if (!isActive) {
      if (mode === "work") {
        setTimeLeft(tempSettings.work * 60);
      } else if (mode === "shortBreak") {
        setTimeLeft(tempSettings.shortBreak * 60);
      } else {
        setTimeLeft(tempSettings.longBreak * 60);
      }
    }
  };

  const resetDefaultSettings = () => {
    setTempSettings(defaultSettings);
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get the current mode's label
  const getModeLabel = (): string => {
    switch (mode) {
      case "work":
        return "Work";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  // Background color based on current mode
  const getBackgroundColor = (): string => {
    switch (mode) {
      case "work":
        return "bg-red-500";
      case "shortBreak":
        return "bg-green-500";
      case "longBreak":
        return "bg-blue-500";
    }
  };

  return (
    <div className="flex mt-20 flex-col items-center justify-center min-h-[80vh] text-center">
      <div
        className={`rounded-xl shadow-lg p-8 w-full max-w-md transition-colors ${getBackgroundColor()}`}
      >
        <h1 className="text-4xl font-bold text-white mb-2">TopTomato</h1>

        <div className="mb-6">
          <span className="text-xl text-white font-semibold">
            {getModeLabel()}
          </span>
          <div className="text-7xl font-bold text-white my-6">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            className="bg-slate-100 text-black font-semibold px-6 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {isActive ? "Pause" : "Start"}
          </button>

          <button
            onClick={resetTimer}
            className="bg-slate-100 text-black font-semibold px-6 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>

          <button
            onClick={skipToNext}
            className="bg-slate-100 text-black font-semibold px-6 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Skip
          </button>
        </div>

        <div className="text-white text-opacity-90">
          <p>Sessions completed: {sessions}</p>
        </div>

        <button
          onClick={toggleSettings}
          className="mt-4 bg-slate-100 text-black py-1 px-4 rounded-full text-sm hover:bg-slate-200 transition-colors"
        >
          ⚙️ {showSettings ? "Close Settings" : "Settings"}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="inset-0 z-10 overflow-y-auto h-full w-full flex items-center justify-center backdrop-blur-md"></div>
          <div className="z-20 mt-6 bg-white rounded-xl text-black shadow-lg p-6 w-full max-w-md absolute">
            <h2 className="text-xl font-bold mb-4">Timer Settings</h2>

            {settingsError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                {settingsError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="work"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Work (minutes)
                </label>
                <input
                  type="number"
                  id="work"
                  min="1"
                  max="120"
                  value={tempSettings.work}
                  onChange={(e) => handleSettingChange("work", e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="shortBreak"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  id="shortBreak"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreak}
                  onChange={(e) => handleSettingChange("shortBreak", e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  htmlFor="longBreak"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  id="longBreak"
                  min="1"
                  max="60"
                  value={tempSettings.longBreak}
                  onChange={(e) => handleSettingChange("longBreak", e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="longBreakInterval"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sessions before Long Break
                </label>
                <input
                  type="number"
                  id="longBreakInterval"
                  min="1"
                  max="10"
                  value={tempSettings.longBreakInterval}
                  onChange={(e) => handleSettingChange("longBreakInterval", e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={resetDefaultSettings}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Reset to Default
              </button>

              <div className="space-x-2">
                <button
                  onClick={toggleSettings}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showSettings && (
        <div className="mt-10 text-sm text-gray-500">
          <p>
            Work: {settings.work} min • Short Break: {settings.shortBreak} min •
            Long Break: {settings.longBreak} min
          </p>
          <p>Long break after {settings.longBreakInterval} sessions</p>
        </div>
      )}
    </div>
  );
}