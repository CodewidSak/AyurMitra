import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Footer from './Footer'

export default function MainLayout({ children, breadcrumb = null }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar breadcrumb={breadcrumb} />
        
        <main className="flex-1 pt-20 p-12">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}
