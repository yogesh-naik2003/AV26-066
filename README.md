# AV26-066

MediVision AI is a React and Vite prototype for an AI-assisted medical imaging workflow. It includes role-based workspaces for radiologists, doctors, administrators, technicians, and patients.

## Pre-login Credentials

Use these credentials on the sign-in modal:

- Email: `demo@medivision.ai`
- Password: `demo123`

## Features

- Role selection for Radiologist, Doctor, Admin, Technician, and Patient workspaces
- Scan upload form for medical imaging files
- Scan viewer interface with CT, MRI, and X-Ray tabs
- AI analysis and report panels with empty states ready for real data
- Settings, notifications, patient history, and reports pages
- Responsive landing page and authenticated dashboard shell

## Tech Stack

- React
- Vite
- Three.js via `@react-three/fiber` and `@react-three/drei`
- Framer Motion
- Recharts
- Lucide React icons

## Run Locally

```powershell
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

## Build

```powershell
npm run build
```

The production build is written to `dist/`.

## Project Structure

```text
src/main.jsx       Main React application
src/styles.css     Application styles
public/            Static assets
scripts/           Utility scripts
dist/              Production build output
```
