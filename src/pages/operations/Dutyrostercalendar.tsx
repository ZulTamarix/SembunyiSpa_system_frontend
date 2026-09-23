import React, { useMemo, useState } from "react";
import rosterProp from "../../JSON/roster.json";
import Grid from "../../components/ui/Grid";
import { DAY_NAMES,  MONTH_NAMES, getToday, toISODate, daysInMonth} from "../../utils/date";

export default function DutyRosterCalendar() {

    const therapists = [
        { id: 1, code: "C1763", name: "Callie Jong", position: "Spa Manager" },
        { id: 2, code: "C2221", name: "Anthony", position: "Spa Receptionist" },
        { id: 3, code: "C2140", name: "Michael", position: "Manager" },
        { id: 4, code: "C2151", name: "Calista Mirih", position: "Spa Manager" },
    ];

    const shiftMap = null;

    const { year: initialYear, monthIndex: initialMonthIndex } = getToday();

  const [year, setYear] = useState(initialYear);
  const [monthIndex, setMonthIndex] = useState(initialMonthIndex);

  const goToPrevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const goToNextMonth = () => { 
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  // Build a lookup: { "YYYY-MM-DD": { [therapist_id]: rosterEntry } }
  const rosterByDateAndTherapist = useMemo(() => {
    const map = {};
    for (const entry of rosterProp) {
      if (!map[entry.date]) map[entry.date] = {};
      map[entry.date][entry.user_therapist_id] = entry;
    }
    return map;
  }, [rosterProp]);

  const totalDays = daysInMonth(year, monthIndex);
  const rows = useMemo(() => {
    const list = [];
    for (let day = 1; day <= totalDays; day++) {
      const iso = toISODate(year, monthIndex, day);
      const dow = new Date(year, monthIndex, day).getDay(); // 0=Sun..6=Sat
      list.push({
        iso,
        day,
        dayName: DAY_NAMES[dow],
        isWeekend: dow === 0 || dow === 6,
      });
    }
    return list;
  }, [year, monthIndex, totalDays]);
  const therapistsByRole = useMemo(() => {
    return therapists.reduce((groups, therapist) => {
        const role = therapist.position || "Other";

        if (!groups[role]) {
            groups[role] = [];
        }

        groups[role].push(therapist);

        return groups;
    }, {});
}, [therapists]);

    const getCell = (iso, therapistId) => {
    const entry = rosterByDateAndTherapist[iso]?.[therapistId];
    if (!entry) return null;

    // If there is a leave, display roster_leave_id
    if (entry.roster_leave_id !== null) {
        return {
        label: String(entry.roster_leave_id),
        isOff: true,
        };
    }

    // Otherwise, display roster_shift_id
    const label =
        shiftMap?.[entry.roster_shift_id] ?? String(entry.roster_shift_id);

    return {
        label,
        isOff: false,
    };
    };

    const handle_plan = (test: any) =>{
        console.log('test = ',test)
    }

    return (
        <Grid>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-title">
                            DUTY ROSTER — SEMBUNYI SPA
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-serif text-primary mt-1">
                            {MONTH_NAMES[monthIndex]} {year}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPrevMonth}
                            aria-label="Previous month"
                            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                        >
                            <span className="-translate-y-px">‹</span>

                        </button>
                        <div className="px-4 py-2 rounded-xl border border-border bg-white/60 text-sm font-medium text-primary min-w-35 text-center">
                            {MONTH_NAMES[monthIndex]} {year}
                        </div>
                        <button
                            onClick={goToNextMonth}
                            aria-label="Next month"
                            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                        >
                            <span className="-translate-y-px">›</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm overflow-x-auto">
                    <div className="w-max min-w-full">
                        {/* Header */}
                        <div className="grid bg-primary" style={{gridTemplateColumns: `160px repeat(${rows.length}, minmax(52px, 1fr))`}}>
                            <div className="px-4 py-3 text-xs font-bold tracking-wider text-secondary flex items-center">
                                STAFF
                            </div>
                            {rows.map((row) => (
                                <div key={row.iso} className="px-1 py-3 text-center border-l border-white/10">
                                    <div className={`text-sm font-bold ${row.isWeekend ? "text-danger" : "text-slate-400"}`}>
                                        {row.day}
                                    </div>
                                    <div className={`text-[10px] font-semibold tracking-wide ${row.isWeekend ? "text-danger" : "text-slate-400"}`}>
                                        {row.dayName}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="bg-tertiary divide-y divide-border">
                            {Object.entries(therapistsByRole).map(([role, roleTherapists]) => (
                                <React.Fragment key={role}>
                                    {/* Role Header */}
                                    <div className="grid bg-[#F0E8D8]" style={{gridTemplateColumns: `160px repeat(${rows.length}, minmax(52px, 1fr))`}}>
                                        <div className="px-4 py-2 text-xs font-bold tracking-wider text-title">
                                            {role}
                                        </div>

                                        <div className="col-span-full" style={{gridColumn: `2 / span ${rows.length}`}}/>
                                    </div>

                                    {/* Therapists in this role */}
                                    {roleTherapists.map((t) => (
                                        <div key={t.id} className="grid items-center" style={{gridTemplateColumns: `50px 110px repeat(${rows.length}, minmax(52px, 1fr))`}}>
                                            {/* Code */}
                                            <div className="px-1 py-2.5 text-xs font-medium text-title whitespace-nowrap text-center border-r border-border">
                                                {t.code}
                                            </div>
                                            {/* Name */}
                                            <div className="px-4 py-2.5 text-sm font-semibold text-primary whitespace-nowrap">
                                                {t.name}
                                            </div>
                                            {rows.map((row) => {
                                                const cell = getCell(row.iso, t.id);

                                                return (
                                                    <div key={row.iso} className="px-0.5 py-1 flex justify-center border-l border-border">
                                                        {cell ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handle_plan(cell.entry)}
                                                                className={`w-full min-h-8 text-center text-[11px] font-bold px-1 py-1 rounded-md cursor-pointer hover:opacity-80 transition ${
                                                                    cell.isOff
                                                                        ? "bg-[#e7e0d2] text-[#6b6355]"
                                                                        : "bg-[#F7DE8B] text-[#5b3f10]"
                                                                }`}
                                                            >
                                                                {cell.label}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-title">—</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </Grid>
    );
}