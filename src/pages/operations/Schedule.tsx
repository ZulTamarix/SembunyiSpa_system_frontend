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

    interface CalendarProps {
        type: "therapist" | "room";
        loading?: boolean;          // new
        skeletonRows?: number;      // new
        emptyText?: string;         // new
        fullDate: string;
        dayName: string;
        date: string;
        timelineWidth: number;
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
    function GridLines({ hours }: { hours: number[] }) {
        return (
            <>
            {hours.map((h, i) => (
                <div key={h}>
                <div
                    className="absolute top-0 bottom-0 border-l border-slate-300"
                    style={{ left: i * HOUR_WIDTH }}
                />
                <div
                    className="absolute top-0 bottom-0 border-l border-dashed border-slate-200"
                    style={{ left: i * HOUR_WIDTH + HOUR_WIDTH / 2 }}
                />
                </div>
            ))}
            </>
        );
    }
    function Calendar({ type, fullDate, dayName, date, timelineWidth, hours, startHour, endHour, showNow, nowHour, goTo, totalData, databaseRow, colorMap, loading = false, skeletonRows = 4, emptyText = "No bookings for this day", }: CalendarProps) {

        const title = type === "therapist" ? "Therapist" : "Room";

        return (
            <Grid>
                <div className="min-h-screen rounded-2xl border border-border bg-slate-100 p-2 text-slate-800 sm:p-6">
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

                                        {/* <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                                            {totalData} {totalData === 1 ? "booking" : "bookings"}
                                        </span> */}
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
                        <div className="relative overflow-x-auto rounded-xl border border-border bg-white scrollbar-hide shadow-md" aria-busy={loading}>
                            {loading && (
                                <div className="absolute top-0 left-0 right-0 z-30 h-0.5 overflow-hidden bg-border">
                                    <div className="h-full w-1/3 animate-[slide_1.1s_ease-in-out_infinite] bg-secondary" />
                                </div>
                            )}

                            <div style={{ width: COL_WIDTH + timelineWidth, minWidth: "100%" }}>
                                {/* hour header: unchanged, stays visible while loading */}
                                <div className="flex bg-primary text-xs font-bold text-white">

                                    <div className="sticky left-0 z-20 flex shrink-0 items-center border-r border-slate-700 bg-primary px-4 py-3" style={{ width: COL_WIDTH }}>
                                        {title}
                                    </div>

                                    <div className="relative flex" style={{ width: timelineWidth }}>
                                        {hours.map((h) => (
                                            <div
                                                key={h}
                                                className="shrink-0 border-l border-slate-700 px-2 py-3 tabular-nums first:border-l-0"
                                                style={{ width: HOUR_WIDTH }}
                                            >
                                                {String(h).padStart(2, "0")}:00
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* rows */}
                                {loading ? (
                                    Array.from({ length: skeletonRows }).map((_, rowIdx) => {
                                        // fake booking blocks, varied per row so it looks natural
                                        const blocks = [
                                            { start: 1 + (rowIdx % 3), len: 2 + (rowIdx % 2) },
                                            { start: 5 + ((rowIdx * 2) % 3), len: 2 },
                                        ].filter((b) => (b.start + b.len) <= hours.length);

                                        return (
                                            <div key={`sk-${rowIdx}`} className={`flex border-b border-slate-300 last:border-b-0 ${rowIdx % 2 ? "bg-slate-50" : "bg-white"}`} style={{ minHeight: LANE_HEIGHT + 28 }}>
                                                {/* sidebar skeleton */}
                                                <div className="sticky left-0 z-10 flex shrink-0 flex-col justify-center gap-2 border-r border-slate-300 bg-tertiary px-4" style={{ width: COL_WIDTH }}>
                                                    <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-slate-300" />
                                                    <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-300" />
                                                </div>

                                                {/* timeline skeleton */}
                                                <div className="relative shrink-0" style={{ width: timelineWidth }}>
                                                    <GridLines hours={hours} />
                                                    {blocks.map((b, i) => (
                                                        <div
                                                            key={i}
                                                            className="absolute animate-pulse rounded-md bg-slate-300"
                                                            style={{
                                                                left: b.start * HOUR_WIDTH + 1,
                                                                width: b.len * HOUR_WIDTH - 2,
                                                                top: 4,
                                                                height: LANE_HEIGHT + 8,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : databaseRow.length === 0 ? (
                                <div className="sticky left-0 px-6 py-12 text-center text-sm text-slate-400" style={{ width: "100%" }}>
                                    {emptyText}
                                </div>
                                ) : (
                                    databaseRow.map((row, rowIdx) => {

                                        const data =
                                            type === "therapist"
                                                ? row.therapist
                                                : row.room;

                                        const rowMinHeight = row.laneCount * LANE_HEIGHT + 20;

                                        return (
                                            <div
                                                key={data.user?.id ?? data.id}
                                                className={`flex min-h-20 border-b border-slate-300 last:border-b-0 ${
                                                    rowIdx % 2 ? "bg-slate-50" : "bg-white"
                                                }`}
                                                style={{ minHeight: rowMinHeight }}
                                            >

                                                {/* sidebar */}
                                                <div className="sticky left-0 z-10 flex shrink-0 items-center border-r border-slate-300 bg-tertiary px-4 text-sm font-bold text-sky-950" style={{width: COL_WIDTH, minHeight: rowMinHeight}}>
                                                    {type === "therapist" ? (
                                                        <div>
                                                            {data.user.name}

                                                            <br />

                                                            <span className="text-xs font-normal">
                                                                ({data.user.specialty})
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            ({data.room.name})

                                                            <br />

                                                            <span className="text-xs font-normal">
                                                                ({data.room.description})
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* timeline */}
                                                <div className="relative shrink-0" style={{width: timelineWidth, minHeight: rowMinHeight}}>

                                                    {/* grid lines */}
                                                    {hours.map((h, i) => (
                                                        <div key={h}>
                                                            <div className="absolute top-0 bottom-0 border-l border-slate-300" style={{left: i * HOUR_WIDTH}}/>

                                                            <div
                                                                className="absolute top-0 bottom-0 border-l border-dashed border-slate-200"
                                                                style={{
                                                                    left: i * HOUR_WIDTH + HOUR_WIDTH / 2,
                                                                }}
                                                            />
                                                        </div>
                                                    ))}

                                                    {/* current time */}
                                                    {showNow && (
                                                        <div className="absolute top-0 bottom-0 z-5 w-0.5 bg-red-500" style={{left: (nowHour - startHour) * HOUR_WIDTH}}>
                                                            <span className="absolute -top-0.5 -left-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                                                        </div>
                                                    )}

                                                    {/* bookings */}
                                                    {row.placed.map((booking:any) => {

                                                        const s = Math.max(
                                                            toHours(booking.booking.time_start),
                                                            startHour
                                                        );

                                                        const e = Math.min(
                                                            toHours(booking.booking.time_end),
                                                            endHour
                                                        );

                                                        if (e <= s) return null;

                                                        return (
                                                            <button
                                                                key={booking.id}
                                                                title={`${fmtTime(booking.time_start)} - ${fmtTime(booking.time_end)}`}
                                                                className={`${colorMap[booking.package?.title] ?? DEFAULT_COLOR} absolute flex cursor-pointer flex-col items-start justify-center gap-1 overflow-hidden rounded-md px-2 text-left text-xs leading-tight shadow-md ring-1 ring-black/10 transition hover:-translate-y-px hover:shadow-lg`}
                                                                style={{
                                                                    left: (s - startHour) * HOUR_WIDTH + 1,
                                                                    width: (e - s) * HOUR_WIDTH - 2,
                                                                    top: booking.lane * LANE_HEIGHT + 4,
                                                                    minHeight: LANE_HEIGHT + 8,
                                                                }}
                                                            >
                                                                <span className="rounded bg-white/80 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums">
                                                                    {fmtTime(booking.time_start)} - {fmtTime(booking.time_end)}
                                                                </span>

                                                                <span className="text-[13px] font-bold">
                                                                    - {booking.package?.title}
                                                                </span>
                                                                <div></div>
                                                                <span className="text-[12px] font-semibold">
                                                                    - {booking.booking?.user?.name}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                
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

            const handleClick = (a:any) => {
                console.log('a = ',a)        
            };
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