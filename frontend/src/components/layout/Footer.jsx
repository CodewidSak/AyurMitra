import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-8 bg-surface border-t border-primary/5">
      <p className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60">
        © 2024 AyurMitra Botanical Systems
      </p>
      
      <div className="flex space-x-8 mt-4 md:mt-0">
        <Link
          to="/privacy"
          className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/research"
          className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
        >
          Research Papers
        </Link>
        <Link
          to="/botanical-guide"
          className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
        >
          Botanical Guide
        </Link>
        <Link
          to="/terms"
          className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  )
}
