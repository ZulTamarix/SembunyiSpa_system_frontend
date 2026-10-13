import { useEffect, useMemo, useState } from "react";
import { buildColorMap, DEFAULT_COLOR } from "../utils/color";
import roomsData from "../JSON/room.json";
import activitiesData from "../JSON/room_activity.json";
import Grid from "../components/ui/Grid";

/*  room          { id, name }
 *  room_activity { id, room_id, date, time_start, time_end, activity, category? }
 *  Pass `rooms` / `activities` props (e.g. from an API) to override the JSON files. */

/* -------------------------------- helpers -------------------------------- */
const HOUR_WIDTH = 84; // px per hour
const LANE_HEIGHT = 64; // px per overlapping lane
const ROOM_COL_WIDTH = 160; // px

const pad = (n) => String(n).padStart(2, "0");

/** "08:30" | "08:30:00" -> 8.5 */
const toHours = (t) => {
  const [h, m = 0] = String(t).split(":").map(Number);
  return h + m / 60;
};

const fmtTime = (t) => String(t).slice(0, 5);

/** "YYYY-MM-DD" -> Date (local, no timezone shift) */
const parseDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toISO = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const addDays = (iso, n) => {
  const d = parseDate(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const prettyDate = (iso) => {
  const d = parseDate(iso);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "long" }),
    full: d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  };
};

/** Give each activity a lane so overlapping bookings stack instead of covering each other. */
function assignLanes(items) {
  const sorted = [...items].sort(
    (a, b) => toHours(a.time_start) - toHours(b.time_start) || toHours(a.time_end) - toHours(b.time_end)
  );
  const laneEnds = [];
  const placed = sorted.map((item) => {
    const start = toHours(item.time_start);
    let lane = laneEnds.findIndex((end) => end <= start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = toHours(item.time_end);
    return { ...item, lane };
  });
  return { placed, laneCount: Math.max(1, laneEnds.length) };
}

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

/* ------------------------------- component ------------------------------- */
const Schedule: React.FC = () => {
  const [date, setDate] = useState(
    activitiesData[0]?.date ?? toISO(new Date())
  );
  const [selected, setSelected] = useState(null);

  const startHour = 7;
  const endHour = 19;

  const hours = useMemo(
    () => Array.from(
      { length: endHour - startHour },
      (_, i) => startHour + i
    ),
    []
  );

  const timelineWidth = hours.length * HOUR_WIDTH;

  const goTo = (iso) => {
    if (!iso) return;
    setDate(iso);
    setSelected(null);
  };

  // Left / right arrow keys change the day
  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (e.key === "ArrowLeft") goTo(addDays(date, -1));
      if (e.key === "ArrowRight") goTo(addDays(date, 1));
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [date]);

  // category -> Tailwind colour classes
  const colorMap = useMemo(
    () => buildColorMap(activitiesData.map((a) => a.category)),
    []
  );

  // Group + lane the day's activities per room
  const rows = useMemo(() => {
    const dayItems = activitiesData.filter((a) => a.date === date);

    return roomsData.map((room) => {
      const { placed, laneCount } = assignLanes(
        dayItems.filter((a) => a.room_id === room.id)
      );

      return { room, placed, laneCount };
    });
  }, [date]);

  const total = rows.reduce((n, r) => n + r.placed.length, 0);

  // "Now" marker if viewing today
  const now = new Date();
  const isToday = toISO(now) === date;
  const nowHour = now.getHours() + now.getMinutes() / 60;
  const showNow =
    isToday && nowHour >= startHour && nowHour <= endHour;

  const { weekday, full } = prettyDate(date);
  const todayISO = toISO(now);

  const handleClick = (a) => {
    setSelected(a);
  };

    return (
        <Grid>
            <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-8">
            <div className="mx-auto max-w-[1400px]">
                {/* ------------------------------ toolbar ------------------------------ */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{weekday}</h1>
                    <p className="text-sm text-slate-500">
                    {full} &middot; {total} {total === 1 ? "booking" : "bookings"}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                    type="button"
                    onClick={() => goTo(addDays(date, -1))}
                    aria-label="Previous day"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                    <Chevron dir="left" />
                    </button>

                    <input
                    type="date"
                    value={date}
                    onChange={(e) => goTo(e.target.value)}
                    aria-label="Select date"
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    />

                    <button
                    type="button"
                    onClick={() => goTo(addDays(date, 1))}
                    aria-label="Next day"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                    <Chevron dir="right" />
                    </button>

                    <button
                    type="button"
                    onClick={() => goTo(todayISO)}
                    disabled={date === todayISO}
                    className="h-10 rounded-md bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600 disabled:cursor-default disabled:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    >
                    Today
                    </button>
                </div>
                </div>

                {/* ------------------------------ legend ------------------------------- */}
                {Object.keys(colorMap).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                    {Object.entries(colorMap).map(([name, classes]) => (
                    <div key={name} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className={`h-3 w-6 rounded-sm border border-black/10 ${classes}`} />
                        {name}
                    </div>
                    ))}
                </div>
                )}

                {/* ------------------------------ timeline ----------------------------- */}
                <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
                <div style={{ width: ROOM_COL_WIDTH + timelineWidth, minWidth: "100%" }}>
                    {/* hour header */}
                    <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-medium text-slate-600">
                    <div
                        className="sticky left-0 z-20 flex shrink-0 items-center border-r border-slate-200 bg-slate-100 px-3 py-2"
                        style={{ width: ROOM_COL_WIDTH }}
                    >
                        Room
                    </div>
                    <div className="relative flex" style={{ width: timelineWidth }}>
                        {hours.map((h) => (
                        <div
                            key={h}
                            className="shrink-0 border-l border-slate-200 px-1.5 py-2 first:border-l-0"
                            style={{ width: HOUR_WIDTH }}
                        >
                            {h}:00
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* rows */}
                    {rows.map(({ room, placed, laneCount }) => (
                    <div key={room.id} className="flex border-b border-slate-200 last:border-b-0">
                        <div
                        className="sticky left-0 z-10 flex shrink-0 items-center border-r border-slate-200 bg-sky-50/80 px-3 text-sm font-medium text-slate-600 backdrop-blur"
                        style={{ width: ROOM_COL_WIDTH }}
                        >
                        {room.name}
                        </div>

                        <div className="relative shrink-0" style={{ width: timelineWidth, height: laneCount * LANE_HEIGHT + 8 }}>
                        {/* hour grid lines */}
                        {hours.map((h, i) => (
                            <div
                            key={h}
                            className="absolute top-0 bottom-0 border-l border-slate-100"
                            style={{ left: i * HOUR_WIDTH }}
                            />
                        ))}

                        {/* current time */}
                        {showNow && (
                            <div
                            className="absolute top-0 bottom-0 z-10 w-px bg-red-500"
                            style={{ left: (nowHour - startHour) * HOUR_WIDTH }}
                            />
                        )}

                        {/* bookings */}
                        {placed.map((a) => {
                            const s = Math.max(toHours(a.time_start), startHour);
                            const e = Math.min(toHours(a.time_end), endHour);
                            if (e <= s) return null;
                            const color = colorMap[a.category] ?? DEFAULT_COLOR;
                            const isSel = selected?.id === a.id;
                            return (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => handleClick(a)}
                                title={`${fmtTime(a.time_start)} - ${fmtTime(a.time_end)}  ${a.activity}`}
                                className={`${color} absolute flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-sm border px-1.5 text-center text-xs leading-tight transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                                isSel ? "z-20 border-slate-700 shadow-md" : "border-white/70"
                                }`}
                                style={{
                                left: (s - startHour) * HOUR_WIDTH,
                                width: (e - s) * HOUR_WIDTH,
                                top: a.lane * LANE_HEIGHT + 4,
                                height: LANE_HEIGHT - 4,
                                }}
                            >
                                <span className="text-[11px] opacity-80">
                                {fmtTime(a.time_start)} - {fmtTime(a.time_end)}
                                </span>
                                <span className="line-clamp-2 font-semibold">{a.activity}</span>
                                <span className="opacity-70">
                                <EyeIcon />
                                </span>
                            </button>
                            );
                        })}
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {total === 0 && (
                <p className="mt-4 text-center text-sm text-slate-500">
                    No bookings on this date. Use the arrows or date picker to look at another day.
                </p>
                )}

                {/* ------------------------------ details ------------------------------ */}
                {selected && (
                <div className="mt-4 flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                    <div>
                    <p className="font-semibold">{selected.activity}</p>
                    <p className="text-sm text-slate-500">
                        {rooms.find((r) => r.id === selected.room_id)?.name} &middot; {fmtTime(selected.time_start)} -{" "}
                        {fmtTime(selected.time_end)}
                        {selected.category ? ` · ${selected.category}` : ""}
                    </p>
                    </div>
                    <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                    Close
                    </button>
                </div>
                )}
            </div>
            </div>
        </Grid>
    );
}

export default Schedule;