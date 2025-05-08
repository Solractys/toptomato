# TopTomato - Pomodoro Timer

A simple yet effective Pomodoro timer application built with Next.js and React to help boost productivity using the Pomodoro Technique.

## What is the Pomodoro Technique?

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length (called "pomodoros"), separated by short breaks. Each interval is known as a pomodoro, from the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student.

## Features

- Work sessions (default: 25 minutes)
- Short breaks (default: 5 minutes)
- Long breaks (default: 15 minutes)
- Automatic session tracking
- Visual cues for different timer states
- Sound notifications when timer completes
- Customizable timer durations and intervals
- Responsive design

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Custom Notification Sound

The app comes with a placeholder for notification sounds. To use your own sound:

1. Find a short MP3/WAV file for notifications
2. Name it `notification.wav`
3. Place it in the `public` directory

## How to Use

1. **Start a session** - Click the Start button to begin a work session
2. **Pause/Resume** - Click the same button to pause or resume the current timer
3. **Reset** - Click Reset to start over from the beginning of the current session
4. **Skip** - Click Skip to move to the next session (work → break or break → work)
5. **Complete a work session** - After each work session, a break will automatically start
6. **Session counter** - The app tracks how many work sessions you've completed
7. **Customize settings** - Click the Settings button to adjust work time, break durations, and intervals
   - Change values using the number inputs
   - Click "Save Settings" to apply changes
   - Click "Reset to Default" to restore default values
   - Click "Cancel" or "Close Settings" to discard changes

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
