import { useState, useEffect } from 'react';
import Header from '../components/Header';
import API from '../utils/api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Package, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMonthBatches();
  }, [currentDate]);

  const fetchMonthBatches = async () => {
    setLoading(true);
    try {
      // Fetch all batches for the current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const { data } = await API.get('/batches', {
        params: { 
          limit: 100,
          from: startOfMonth.toISOString(),
          to: endOfMonth.toISOString()
        }
      });
      setBatches(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const renderDays = () => {
    const totalDays = daysInMonth(year, currentDate.getMonth());
    const startDay = firstDayOfMonth(year, currentDate.getMonth());
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBatches = batches.filter(b => b.productionDate.startsWith(dateStr) || b.createdAt.startsWith(dateStr));
      const isToday = new Date().toDateString() === new Date(year, currentDate.getMonth(), d).toDateString();

      days.push(
        <div key={d} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <div className="day-number">{d}</div>
          <div className="day-content">
            {dayBatches.map(b => (
              <div 
                key={b._id} 
                className={`calendar-event ${b.status}`}
                onClick={() => navigate(`/batches/${b._id}`)}
                title={`Batch ${b.batchNumber} - ${b.status}`}
              >
                <div className="event-dot"></div>
                <span className="event-text">{b.batchNumber}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <>
      <Header title="Production Calendar" />

      <div className="page-header">
        <div>
          <h1>Production Timeline</h1>
          <p className="page-header-sub">View and manage scheduled production batches</p>
        </div>
        <div className="calendar-controls">
          <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={18} /></button>
          <div className="current-month">{monthName} {year}</div>
          <button className="btn-icon" onClick={nextMonth}><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="glass-panel animate-in">
        <div className="calendar-grid">
          <div className="calendar-header">Sun</div>
          <div className="calendar-header">Mon</div>
          <div className="calendar-header">Tue</div>
          <div className="calendar-header">Wed</div>
          <div className="calendar-header">Thu</div>
          <div className="calendar-header">Fri</div>
          <div className="calendar-header">Sat</div>
          {renderDays()}
        </div>
      </div>

      <div className="legend-panel animate-in">
        <div className="legend-item"><div className="event-dot in-production"></div> In Production</div>
        <div className="legend-item"><div className="event-dot inspection"></div> Inspection</div>
        <div className="legend-item"><div className="event-dot completed"></div> Completed</div>
        <div className="legend-item"><div className="event-dot rejected"></div> Rejected</div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg-glass);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
        }
        .current-month {
          font-weight: 700;
          font-size: 16px;
          min-width: 140px;
          text-align: center;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: var(--border-primary);
          gap: 1px;
        }
        .calendar-header {
          padding: 12px;
          text-align: center;
          background: var(--bg-secondary);
          font-size: 12px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }
        .calendar-day {
          background: var(--bg-card);
          min-height: 120px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: background var(--transition-fast);
        }
        .calendar-day:hover:not(.empty) {
          background: var(--bg-glass-hover);
        }
        .calendar-day.empty {
          background: rgba(0,0,0,0.1);
        }
        .calendar-day.today {
          background: rgba(34,211,238,0.05);
        }
        .calendar-day.today .day-number {
          background: var(--gradient-primary);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .day-number {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .day-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .calendar-event {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          background: var(--bg-glass);
          border: 1px solid var(--border-primary);
          border-radius: 4px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .calendar-event:hover {
          border-color: var(--accent-cyan);
          transform: translateX(2px);
        }
        .event-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .event-text {
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .event-dot.in-production { background: var(--color-info); }
        .event-dot.inspection { background: var(--color-warning); }
        .event-dot.completed { background: var(--color-success); }
        .event-dot.rejected { background: var(--color-danger); }
        
        .legend-panel {
          margin-top: 20px;
          display: flex;
          gap: 24px;
          padding: 16px;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-primary);
          justify-content: center;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }
      `}} />
    </>
  );
};

export default CalendarPage;
