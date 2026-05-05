import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import EventPage from './pages/EventPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import { EVENT, INITIAL_BOOKINGS } from './data/eventData.js';

const INITIAL_SOLD = INITIAL_BOOKINGS
  .filter(b=>b.status==='confirmed')
  .reduce((s,b)=>s+b.qty,0);

function AppInner() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [availableTickets, setAvailableTickets] = useState(EVENT.totalTickets - INITIAL_SOLD);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  function handleNewBooking(booking) {
    setBookings(prev=>[...prev, booking]);
  }

  // Guard used only for Navbar / in-app navigation (currentUser is already set)
  function handleSetActiveTab(tab) {
    if (tab==='booking' && (!currentUser || currentUser.role==='admin')) {
      setActiveTab('login'); return;
    }
    if (tab==='admin' && (!currentUser || currentUser.role!=='admin')) {
      setActiveTab('login'); return;
    }
    if (tab==='dashboard' && !currentUser) {
      setActiveTab('login'); return;
    }
    setActiveTab(tab);
  }

  function renderPage() {
    // LoginPage and RegisterPage get raw setActiveTab so that the post-login
    // redirect (setActiveTab('home') / setActiveTab('admin')) is never intercepted
    // by the guard above — which would see a stale null currentUser and loop back.
    if (activeTab==='login') return (
      <LoginPage
        setActiveTab={setActiveTab}
        onSwitchToRegister={()=>setActiveTab('register')}
      />
    );
    if (activeTab==='register') return (
      <RegisterPage
        setActiveTab={setActiveTab}
        onSwitchToLogin={()=>setActiveTab('login')}
      />
    );

    if (activeTab==='booking') {
      if (!currentUser || currentUser.role==='admin') return (
        <LoginPage setActiveTab={setActiveTab} onSwitchToRegister={()=>setActiveTab('register')}/>
      );
      return <BookingPage availableTickets={availableTickets} setAvailableTickets={setAvailableTickets} onNewBooking={handleNewBooking}/>;
    }
    if (activeTab==='admin') {
      if (!currentUser || currentUser.role!=='admin') return (
        <LoginPage setActiveTab={setActiveTab} onSwitchToRegister={()=>setActiveTab('register')}/>
      );
      return <AdminPage bookings={bookings} setBookings={setBookings} availableTickets={availableTickets}/>;
    }
    if (activeTab==='dashboard') {
      if (!currentUser) return (
        <LoginPage setActiveTab={setActiveTab} onSwitchToRegister={()=>setActiveTab('register')}/>
      );
      return <UserDashboard bookings={bookings} setActiveTab={handleSetActiveTab}/>;
    }
    if (activeTab==='event') return <EventPage availableTickets={availableTickets} setActiveTab={handleSetActiveTab}/>;
    return <HomePage setActiveTab={handleSetActiveTab} availableTickets={availableTickets}/>;
  }

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={handleSetActiveTab} bookingCount={bookings.length}/>
      {renderPage()}
    </>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}