import { useCallback, useEffect, useMemo, useState } from "react";
import Grid from "../../components/ui/Grid";
import { CircleChevronLeft, CircleChevronRight, DoorOpen, Sparkles } from "lucide-react";
import Tabs from "../../components/ui/Tab";
import api from "../../api/axios";
import type { Schedule_therapist_json } from "../../interface/user";
import { buildColorMap, DEFAULT_COLOR } from "../../utils/color";

// #region 0) a) --> logic (chatGPT)
    const HOUR_WIDTH = 84; // px per hour
    // const LANE_HEIGHT = 64; // px per overlapping lane
    const LANE_HEIGHT = 80; // px per overlapping lane
    const COL_WIDTH = 160; // px

    const pad = (n:any) => String(n).padStart(2, "0");

    /** "08:30" | "08:30:00" -> 8.5 */
    const toHours = (t:any) => {
        const [h, m = 0] = String(t).split(":").map(Number);
        return h + m / 60;
    };

    const fmtTime = (t:any) => String(t).slice(0, 5);

    /** "YYYY-MM-DD" -> Date (local, no timezone shift) */
    const parseDate = (s:any) => {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d);
    };
    const toISO = (date:any) =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        const addDays = (iso:any, n:any) => {
        const d = parseDate(iso);
        d.setDate(d.getDate() + n);
        return toISO(d);
    };
    const prettyDate = (iso:any) => {
        const d = parseDate(iso);
        return {
            weekday: d.toLocaleDateString("en-GB", { weekday: "long" }),
            full: d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
        };
    };

    /** Give each activity a lane so overlapping bookings stack instead of covering each other. */
    function assignLanes(items:any) {
        const sorted = [...items].sort(
            (a, b) => toHours(a.time_start) - toHours(b.time_start) || toHours(a.time_end) - toHours(b.time_end)
        );
        const laneEnds:any = [];
        const placed = sorted.map((item) => {
            const start = toHours(item.time_start);
            let lane = laneEnds.findIndex((end:any) => end <= start);
            if (lane === -1) 
                lane = laneEnds.length;
            laneEnds[lane] = toHours(item.time_end);
            return { ...item, lane };
        });

        return { placed, laneCount: Math.max(1, laneEnds.length) };
    }
//#endregion


// #region 0) b) --> Calendar component

    const HOUR_HEIGHT = 96;      // height of one hour on the vertical axis
    const TIME_COL_WIDTH = 72;   // sticky hour-label column on the left
    const MIN_COL_WIDTH = 200;   // minimum width of one therapist / room column
    const LANE_MIN_WIDTH = 170;  // minimum width of one lane (overlapping bookings sit side by side)
    
    interface CalendarProps {
        type: "therapist" | "room";
        loading?: boolean;
        skeletonRows?: number;      // now = number of skeleton columns
        emptyText?: string;
        fullDate: string;
        dayName: string;
        date: string;
        hours: number[];
        startHour: number;
        endHour: number;
        showNow: boolean;
        nowHour: number;
        totalData: number;
        databaseRow: any[];
        colorMap: Record<string, string>;
        goTo: (date: string) => void;
    }
 
    /* horizontal grid lines for one column */
    function GridLines({ hours }: { hours: number[] }) {
        return (
            <>
                {hours.map((h, i) => (
                    <div key={h}>
                        <div
                            className="absolute left-0 right-0 border-t border-slate-300"
                            style={{ top: i * HOUR_HEIGHT }}
                        />
                        <div
                            className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                            style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                        />
                    </div>
                ))}
            </>
        );
    }
 
    function Calendar({ type, fullDate, dayName, date, hours, startHour, endHour, showNow, nowHour, goTo, totalData, databaseRow, colorMap, loading = false, skeletonRows = 4, emptyText = "No bookings for this day"}: CalendarProps) {
        const bodyHeight = hours.length * HOUR_HEIGHT;
    
        return (
            <Grid>
                <div className="min-h-screen rounded-2xl border border-border bg-slate-100 p-2 text-slate-800 sm:p-5">
                    <div className="mx-auto max-w-350">
    
                        {/* toolbar */}
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
    
                            {/* left */}
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-1.5 rounded-full bg-secondary" />
    
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                        {dayName}
                                    </h1>
    
                                    <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-600">
                                        {fullDate}
    
                                        {loading ? (
                                            <span className="h-5 w-20 animate-pulse rounded-full bg-slate-300" />
                                        ) : (
                                            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                                                {totalData} {totalData === 1 ? "booking" : "bookings"}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
    
                            {/* right */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goTo(addDays(date, -1))}
                                    aria-label="Previous day"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary text-white transition-all hover:-translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                                >
                                    <CircleChevronLeft />
                                </button>
    
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => goTo(e.target.value)}
                                    aria-label="Select date"
                                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                                />
    
                                <button
                                    onClick={() => goTo(addDays(date, 1))}
                                    aria-label="Next day"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary text-white transition-all hover:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                                >
                                    <CircleChevronRight />
                                </button>
                            </div>

                        </div>
    
                        {/* timeline */}
                        <div aria-busy={loading} className="relative max-h-[75vh] overflow-auto rounded-xl border border-border bg-white shadow-md scrollbar-hide">
                            
                            {/* loading state */}
                            {loading && (
                                <div className="sticky top-0 z-40 -mb-0.5 h-0.5 overflow-hidden bg-border">
                                    <div className="h-full w-1/3 animate-[slide_1.1s_ease-in-out_infinite] bg-secondary" />
                                </div>
                            )}
    
                            <div style={{ minWidth: "100%", width: "max-content" }}>
    
                                {/* ---------- header row ---------- */}
                                <div className="sticky top-0 z-30 flex bg-secondary text-xs font-bold text-black">

                                    {/* corner */}
                                    <div style={{ width: TIME_COL_WIDTH }} className="sticky left-0 z-40 flex shrink-0 items-center border-r border-slate-700 bg-tertiary px-3 py-3">
                                        Therapist
                                    </div>
    
                                    {loading
                                        ? Array.from({ length: skeletonRows }).map((_, i) => (
                                            <div
                                                key={`skh-${i}`}
                                                className="flex flex-col justify-center gap-2 border-l border-slate-700 px-4 py-3 first:border-l-0"
                                                style={{ flex: `1 0 ${MIN_COL_WIDTH}px`, minWidth: MIN_COL_WIDTH }}
                                            >
                                                <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-white/30" />
                                                <div className="h-3 w-1/2 animate-pulse rounded-md bg-white/30" />
                                            </div>
                                        ))
                                        : databaseRow.map((row) => {
                                            const data = type === "therapist" ? row.therapist : row.room;
                                            const colMinWidth = Math.max(MIN_COL_WIDTH, row.laneCount * LANE_MIN_WIDTH);
    
                                            return (
                                                <div
                                                    key={data.user?.id ?? data.id}
                                                    className="flex flex-col justify-center border-l border-slate-700 px-4 py-3 first:border-l-0"
                                                    style={{ flex: `1 0 ${colMinWidth}px`, minWidth: colMinWidth }}
                                                >
                                                    {type === "therapist" ? (
                                                        <>
                                                            <span className="text-sm">{data.user.name}</span>
                                                            <span className="text-xs font-normal">({data.user.specialty})</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm">({data.room.name})</span>
                                                            <span className="text-xs font-normal">({data.room.description})</span>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
    
                                {/* ---------- body ---------- */}
                                <div className="relative flex" style={{ height: bodyHeight }}>
    
                                    {/* hour labels (sticky left) */}
                                    <div style={{ width: TIME_COL_WIDTH }} className="sticky left-0 z-20 shrink-0 border-r border-slate-300 bg-tertiary text-sm font-bold text-sky-950">
                                        {hours.map((h, i) => (
                                            <div
                                                key={h}
                                                className="absolute left-0 right-0 px-3 pt-1 text-xs tabular-nums"
                                                style={{ top: i * HOUR_HEIGHT }}
                                            >
                                                {String(h).padStart(2, "0")}:00
                                            </div>
                                        ))}
                                    </div>
    
                                    {/* columns */}
                                    {loading ? (
                                        Array.from({ length: skeletonRows }).map((_, colIdx) => {
                                            // fake booking blocks, varied per column
                                            const blocks = [
                                                { start: 1 + (colIdx % 3), len: 2 + (colIdx % 2) },
                                                { start: 5 + ((colIdx * 2) % 3), len: 2 },
                                            ].filter((b) => b.start + b.len <= hours.length);
    
                                            return (
                                                <div
                                                    key={`sk-${colIdx}`}
                                                    className={`relative border-l border-slate-300 first:border-l-0 ${colIdx % 2 ? "bg-slate-50" : "bg-white"}`}
                                                    style={{ flex: `1 0 ${MIN_COL_WIDTH}px`, minWidth: MIN_COL_WIDTH }}
                                                >
                                                    <GridLines hours={hours} />
                                                    {blocks.map((b, i) => (
                                                        <div
                                                            key={i}
                                                            className="absolute animate-pulse rounded-md bg-slate-300"
                                                            style={{
                                                                top: b.start * HOUR_HEIGHT + 1,
                                                                height: b.len * HOUR_HEIGHT - 2,
                                                                left: 4,
                                                                right: 4,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            );
                                        })
                                    ) : databaseRow.length === 0 ? (
                                        <div className="relative flex flex-1 items-center justify-center text-sm text-slate-400">
                                            <div className="sticky left-1/2">{emptyText}</div>
                                        </div>
                                    ) : (
                                        databaseRow.map((row, colIdx) => {
                                            const data = type === "therapist" ? row.therapist : row.room;
                                            const laneCount = Math.max(row.laneCount, 1);
                                            const colMinWidth = Math.max(MIN_COL_WIDTH, row.laneCount * LANE_MIN_WIDTH);
    
                                            return (
                                                <div
                                                    key={data.user?.id ?? data.id}
                                                    className={`relative border-l border-slate-300 first:border-l-0 ${colIdx % 2 ? "bg-slate-50" : "bg-white"}`}
                                                    style={{ flex: `1 0 ${colMinWidth}px`, minWidth: colMinWidth }}
                                                >
                                                    <GridLines hours={hours} />
    
                                                    {/* bookings */}
                                                    {row.placed.map((booking: any) => {
                                                        const s = Math.max(toHours(booking.booking.time_start), startHour);
                                                        const e = Math.min(toHours(booking.booking.time_end), endHour);
    
                                                        if (e <= s) return null;
    
                                                        return (
                                                            <button
                                                                key={booking.id}
                                                                title={`${fmtTime(booking.time_start)} - ${fmtTime(booking.time_end)}`}
                                                                className={`${colorMap[booking.package?.title] ?? DEFAULT_COLOR} absolute flex cursor-pointer flex-col items-start justify-start gap-1 overflow-hidden rounded-md px-2 py-1.5 text-left text-xs leading-tight shadow-md ring-1 ring-black/10 transition hover:-translate-y-px hover:shadow-lg`}
                                                                style={{
                                                                    top: (s - startHour) * HOUR_HEIGHT + 1,
                                                                    height: (e - s) * HOUR_HEIGHT - 2,
                                                                    // lanes sit side by side, sharing the column width
                                                                    left: `calc(${(booking.lane / laneCount) * 100}% + 2px)`,
                                                                    width: `calc(${100 / laneCount}% - 4px)`,
                                                                }}
                                                            >
                                                                <span className="rounded bg-white/80 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
                                                                    {fmtTime(booking.time_start)} - {fmtTime(booking.time_end)}
                                                                </span>
    
                                                                <span className="text-[13px] font-bold">
                                                                    - {booking.package?.title}
                                                                </span>
    
                                                                <span className="text-[12px] font-semibold">
                                                                    - {booking.booking?.user?.name}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })
                                    )}
    
                                    {/* current time: one horizontal line across every column */}
                                    {showNow && (
                                        <div
                                            className="pointer-events-none absolute right-0 z-10 h-0.5 bg-red-500"
                                            style={{
                                                left: TIME_COL_WIDTH,
                                                top: (nowHour - startHour) * HOUR_HEIGHT,
                                            }}
                                        >
                                            <span className="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </Grid>
        );
    }

//#endregion


const Schedule: React.FC = () => {


    //#region 1) --> navbar
    
        // set CRUD's State
        // const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        // const [isLoading, setIsLoading] = useState(false);
        // date
        const [date, setDate] = useState(toISO(new Date()));
        // loading state
        const [spinner, setSpinner] = useState(false)
        // swap section
        const [active, setActive] = useState("therapist");
        const tabs = [
            { id: "therapist", label: "Therapist", icon: Sparkles },
            { id: "room", label: "Room", icon: DoorOpen },
        ];

        
        // fetch database on load

    //#endregion


    //#region 2) --> database
        
        // a) fetch 'therapist'
            const [databaseTherapist, setDatabase_therapist] = useState<Schedule_therapist_json[]>([])
            const fetchData_therapist = useCallback(() => {
                
                // loading
                setSpinner(true)

                api.get(`/booking`, {
                    params: {
                        date: date,
                        switch: 'therapist',
                    }
                })
                .then((response) => {
                    // console.log('data = ',response.data)
                    setDatabase_therapist(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error.data);
                })
                .finally(() => {
                    setSpinner(false)
                })
            }, [date]);
            useEffect(() => {
                fetchData_therapist();
            }, [fetchData_therapist]);

        // b) fetch 'troom'
            const [databaseRoom, setDatabase_room] = useState<any []>([])
            const fetchData_room = useCallback(() => {
            
                // loading
                setSpinner(true)

                api.get(`/booking`, {
                    params: {
                        date: date,
                        switch: 'room',
                    }
                })
                .then((response) => {
                    console.log('data = ',response.data)
                    setDatabase_room(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error.data);
                })
                .finally(() => {
                    setSpinner(false)
                })
            }, [date]);

            useEffect(() => {
                fetchData_room()
            }, [fetchData_room])

    //#endregion


    //#region 3) --> calendar logic

        // #region 0) --> chatgpt
            const startHour = 7;
            const endHour = 20;

            const hours = useMemo(
                () => Array.from(
                    { length: endHour - startHour },
                    (_, i) => startHour + i
                ),
                []
            );

            const timelineWidth = hours.length * HOUR_WIDTH;

            const goTo = (iso:any) => {
                if (!iso) return;
                setDate(iso);
            };

            // Left / right arrow keys change the day
            useEffect(() => {
                const onKey = (e:any) => {
                    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

                    if (e.key === "ArrowLeft") goTo(addDays(date, -1));
                    if (e.key === "ArrowRight") goTo(addDays(date, 1));
                };

                window.addEventListener("keydown", onKey);

                return () => window.removeEventListener("keydown", onKey);
            }, [date]);


            // "Now" marker if viewing today
            const now = new Date();
            const isToday = toISO(now) === date;
            const nowHour = now.getHours() + now.getMinutes() / 60;
            const showNow =
                isToday && nowHour >= startHour && nowHour <= endHour;

            const { weekday, full } = prettyDate(date);
            // const todayISO = toISO(now);

            // const handleClick = (a:any) => {
            //     console.log('a = ',a)        
            // };
        //#endregion


        // #region 1) --> therapist
            // a)
            const therapistRows = useMemo(() => {
                return databaseTherapist.map((therapist) => {
                    const dayItems = therapist.booking_selected
                        .filter((item) => item.booking?.date_start === date)
                        .map((item) => ({
                            ...item,
                            ...item.booking,
                        }));

                    const { placed, laneCount } = assignLanes(dayItems);

                    return {
                        therapist,
                        placed,
                        laneCount,
                    };
                });
            }, [databaseTherapist, date]);
            // b)
            const therapistTotal = therapistRows.reduce(
                (total, row) => total + row.placed.length,
                0
            );
            // c)
            const colorMap_therapist = useMemo(
                () =>
                    buildColorMap(
                        therapistRows.flatMap((row) =>
                            row.placed.map((booking) => booking.package?.title)
                        )
                    ),
                [therapistRows]
            );
        //#endregion


        // #region 2) --> room
            // a)
            const roomRows = useMemo(() => {
                return databaseRoom.map((room) => {
                    const dayItems = room.booking_selected
                        .filter((item:any) => item.booking?.date_start === date)
                        .map((item:any) => ({
                            ...item,
                            ...item.booking,
                        }));

                    const { placed, laneCount } = assignLanes(dayItems);

                    return {
                        room,
                        placed,
                        laneCount,
                    };
                });
            }, [databaseRoom, date]);
            // b)
            const roomTotal = roomRows.reduce(
                (total, row) => total + row.placed.length,
                0
            );
            // c)
            const colorMap_room = useMemo(
                () =>
                    buildColorMap(
                        roomRows.flatMap((row) =>
                            row.placed.map((booking) => booking.package?.title)
                        )
                    ),
                [roomRows]
            );
        //#endregion

    //#endregion


    return (
        <>

            {/* #region 0 --> main */}
            <>
                <Grid className="md:grid-cols-5">
                    <Tabs className="col-span-2 grid grid-cols-2" tabs={tabs} active={active} setActive={setActive} />
                </Grid>
            </>

            {active === "therapist" && (
                <Calendar
                    type="therapist"
                    loading={spinner}
                    fullDate={full}
                    dayName={weekday}
                    date={date}
                    timelineWidth={timelineWidth}
                    hours={hours}
                    startHour={startHour}
                    endHour={endHour}
                    showNow={showNow}
                    nowHour={nowHour}
                    goTo={goTo}

                    totalData={therapistTotal}
                    databaseRow={therapistRows}
                    colorMap={colorMap_therapist}
                />
            )}

            {active === "room" && (
                <Calendar
                    type="room"
                    loading={spinner}
                    fullDate={full}
                    dayName={weekday}
                    date={date}
                    timelineWidth={timelineWidth}
                    hours={hours}
                    startHour={startHour}
                    endHour={endHour}
                    showNow={showNow}
                    nowHour={nowHour}
                    goTo={goTo}
                    
                    totalData={roomTotal}
                    databaseRow={roomRows}
                    colorMap={colorMap_room}
                />
            )}
        </>
    );
}

export default Schedule;