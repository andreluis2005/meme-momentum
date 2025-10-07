import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import sdk from '@farcaster/frame-sdk'

// Initialize Farcaster SDK
sdk.actions.ready()

createRoot(document.getElementById("root")!).render(<App />);
