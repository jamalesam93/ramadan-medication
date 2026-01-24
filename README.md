# 🌙 Ramadan Medication Web App

A web application to help Muslims manage their medication schedules during Ramadan by intelligently adjusting dose times to the non-fasting window (Iftar to Suhoor).

## Features

- **Prayer Time Integration**: Automatically fetches accurate prayer times based on your location using the Aladhan API
- **Smart Dose Scheduling**: Automatically adjusts medication schedules to fit within the non-fasting window
- **Multiple Calculation Methods**: Support for various Islamic calculation methods (MWL, ISNA, Umm Al-Qura, etc.)
- **Medication Management**: Add, edit, and delete medications with visual pill identification
- **Calendar View**: Track your medication adherence history
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Data is stored locally in your browser

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **API**: Aladhan Prayer Times API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ramadan-medication-app.git
cd ramadan-medication-app/web-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
web-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home/Dashboard
│   │   ├── medications/     # Medications page
│   │   ├── calendar/        # Calendar page
│   │   └── settings/        # Settings page
│   ├── components/          # React components
│   │   ├── PrayerTimeBar.tsx
│   │   ├── DoseCard.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── MedicationForm.tsx
│   │   ├── Navigation.tsx
│   │   └── Modal.tsx
│   ├── lib/                 # Utility functions and services
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── prayerTimes.ts
│   │   ├── doseMapper.ts
│   │   └── storage.ts
│   ├── stores/              # Zustand state stores
│   │   ├── medicationStore.ts
│   │   └── settingsStore.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
```

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd web-app
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Deploy via GitHub

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set the **Root Directory** to `web-app`
6. Click "Deploy"

### Important: Root Directory Setting

When deploying to Vercel, make sure to set the **Root Directory** to `web-app` since this is a monorepo with both mobile and web apps.

## Usage

### First Time Setup

1. **Set Location**: Go to Settings and click "Detect My Location" or enter coordinates manually
2. **Choose Calculation Method**: Select the prayer time calculation method appropriate for your region
3. **Add Medications**: Go to Medications and add your prescriptions with frequency and preferences

### Daily Use

1. **Dashboard**: View today's schedule, prayer times, and countdown to next dose
2. **Mark Doses**: Tap "Mark Taken" when you take your medication
3. **Calendar**: Track your adherence history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
