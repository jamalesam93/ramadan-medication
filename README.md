# 🌙 Ramadan Medication Web App

A modern web application that helps Muslims manage their medication schedules during Ramadan. The app intelligently adjusts dose times to fit within the non-fasting window (Iftar to Suhoor) and supports both Ramadan and standard scheduling modes. Built with Next.js, TypeScript, and Tailwind CSS.

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
git clone https://github.com/jamalesam93/ramadan-medication.git
cd ramadan-medication
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
ramadan-medication/
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
│   │   ├── drugDatabase.ts
│   │   └── storage.ts
│   ├── stores/              # Zustand state stores
│   │   ├── medicationStore.ts
│   │   └── settingsStore.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
```

## Deployment

### Deploy to Netlify

This app is configured for static export and can be deployed to Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build settings are already configured in `netlify.toml`
4. Deploy automatically on push

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

Or connect your GitHub repository directly on [vercel.com](https://vercel.com)

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

This project is open source and available under the [MIT License](LICENSE).

## Important Notice

⚠️ **Medical Disclaimer**: This app is for reminder purposes only. Always consult your doctor or pharmacist before adjusting your medication schedule during Ramadan. Some medications may not be safe to adjust and require special consideration during fasting.

## Acknowledgments

- [Aladhan API](https://aladhan.com/prayer-times-api) for prayer time calculations
- [Next.js](https://nextjs.org/) for the amazing React framework
- The Muslim community for the inspiration to build this tool
