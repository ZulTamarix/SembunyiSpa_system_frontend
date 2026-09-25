import Grid from "../../components/ui/Grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles, ClipboardList, Component, Plus } from "lucide-react";
import api from "../../api/axios";
import Tabs from "../../components/ui/Tab";
import { DAY_NAMES,  MONTH_NAMES, formatTime, getToday, toISODate, daysInMonth } from "../../utils/date";
import React from "react";
import Card from "../../components/ui/Card";

import rosterProp from "../../JSON/roster.json";
import roster_shiftProp from "../../JSON/roster_shift.json";
import roster_leaveProp from "../../JSON/roster_leave.json";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import type { User_type } from "../../interface/user";
import Table, { type Column } from "../../components/ui/Table";
import Field from "../../components/ui/Field";
import type { Roster_leave_type, Roster_shift_type } from "../../interface/roster";
import Label from "../../components/ui/Label";

const Therapist: React.FC = () => {

    //#region 0) --> main
    
        // set CRUD's State
        const [crud, setCrud] = useState<'create'|'edit'>('create')
        // loading
        const [isLoading, setIsLoading] = useState(false);

        // swap section
        const [active, setActive] = useState("therapist");
        const tabs = [
            { id: "therapist", label: "Staff Directory", icon: Sparkles },
            { id: "roster", label: "Duty Roster", icon: ClipboardList },
            { id: "legend", label: "Legend", icon: Component },
        ];
        useEffect(() => {
            switch(active) {
                case 'therapist': 
                break;
                case 'roster': 
                break;
                case 'legend': 
                    // fetchData_shift()
                break;
            }
        },[active])
    //#endregion


    //#region 1) --> therapist
        const [databaseTherapist, setDatabase_therapist] = useState<User_type[]>([])
        const fetchData_therapist = useCallback(() => {

            api.get('/user', {
                params: {
                    role: 'therapist'
                }
            })
            .then((response) => {
                setDatabase_therapist(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }, [])

        // fetch database
        useEffect(() => {
            fetchData_therapist()
        }, [])
    //#endregion


    //#region 2) --> roster

        // #region 1) --> useState
            // form
            const [form, setForm] = useState(false);
            // temporary
            const [tempRoster, setTemp_roster] = useState([])
            const [tempUser, setTemp_user] = useState([])
        //#endregion


        //#region 2) --> method
            const handle_plan = (roster: any, user: any) =>{
                // console.log('test = ',roster)
                console.log('roster = ',tempRoster)
                console.log('user = ',tempUser)

                setTemp_roster(roster)
                setTemp_user(user)
                setForm(true)
            }
            const handleEdit_roster = () => {
                console.log('siap')
                setForm(false)
            }
        //#endregion


        //#region 3) --> database
            
            const [databaseUser, setDatabase_user] = useState<User_type[]>([])

            // a) fetch 'user'
            const fetchData_user = useCallback(() => {

                api.get('/user', {
                    params: {
                        role: 'therapist',
                    }
                })
                .then((response) => {
                    // console.log('user = ',response.data)
                    setDatabase_user(response.data)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
            }, [])

            useEffect(() =>{
                fetchData_user()
            }, [])
        //#endregion


        //#region 0) --> code chatgpt

            // a) initialize
            const shiftMap = null;
            const { year: initialYear, monthIndex: initialMonthIndex } = getToday();
            const [year, setYear] = useState(initialYear);
            const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
            const totalDays = daysInMonth(year, monthIndex);

            // b) method
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
                return databaseUser.reduce((groups, therapist) => {
                    const role = therapist.specialty || "Other";

                    if (!groups[role]) {
                        groups[role] = [];
                    }

                    groups[role].push(therapist);

                    return groups;
                }, {});
            }, [databaseUser]);

            const getCell = (iso:any, therapistId: any) => {
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
                const label = shiftMap?.[entry.roster_shift_id] ?? String(entry.roster_shift_id);

                return {
                    label,
                    isOff: false,
                };
            };
        //#endregion

    //#endregion


    // #region 3) --> legend
    
        // #region a) --> shift
            // form
            const [form_shift, setForm_shift] = useState(false);
            // fieldname
            const [shift, setShift] = useState <Roster_shift_type> ({
                id: 0,
                icon: 0,
                time_start: '09:00',
                time_end: '17:00'
            })
            // database
            const [databaseShift, setDatabase_shift] = useState<Roster_shift_type[]>([])

            // tableTitle_shift
            const tableTitle_shift: Column<Roster_shift_type>[] = [
                {
                    key: "icon",
                    header: "Icon",
                    render: (row) => row.icon
                },
                {
                    key: "start",
                    header: "Time start",
                    render: (row) => row.time_start
                },
                {
                    key: "end",
                    header: "Time End",
                    render: (row) => row.time_end
                },
                {
                    key: "",
                    header: "Action",
                    render: () => (
                        <div className="flex gap-3">
                            <button className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                                Edit
                            </button>
                            
                            <button className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                                Delete
                            </button>
                        </div>
                    )
                },
            ];

            // remove fieldname everytime form closed
            useEffect(() => {
                if(!form_shift) {
                    setShift ({
                        id: 0,
                        icon: 0,
                        time_start: '09:00',
                        time_end: '17:00'
                    })
                }
            }, [form_shift])

            // fetch database
            const fetchData_shift = useCallback(() => {
                api.get('/roster', {
                    params: {
                        switch: 'shift'
                    }
                })
                .then((response) => {
                    setDatabase_shift(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching:', error);
                });
            }, []);
            useEffect(() => {
                fetchData_shift()
            }, [])

            // CREATE
            const handleCreate_shift = async() => {

                // loading
                setIsLoading(true)
                try {
                    await api.post(`/roster`, {
                        icon: shift.icon,
                        time_start: shift.time_start,
                        time_end: shift.time_end,

                        switch: 'shift'
                    });

                    fetchData_shift()
                    setForm_shift(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response status:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }
        //#endregion

        //#region b) --> leave
        
            // form
            const [form_leave, setForm_leave] = useState(false);
            // fieldname
            const [leave, setLeave] = useState <Roster_leave_type> ({
                id: 0,
                icon: '',
                description: ''
            })
            // database
            const [databaseLeave, setDatabase_leave] = useState<Roster_leave_type[]>([])

            // tableTitle_leave
            const tableTitle_leave: Column<Roster_leave_type>[] = [
                {
                    key: "icon",
                    header: "Icon",
                    render: (row) => row.icon
                },
                {
                    key: "description",
                    header: "Description",
                    render: (row) => row.description
                },
                {
                    key: "",
                    header: "Action",
                    render: () => (
                        <div className="flex gap-3">
                            <button className="border border-border p-1 px-2 text-black text-sm rounded-md cursor-pointer">
                                Edit
                            </button>
                            
                            <button className="border border-danger p-1 px-2 text-danger text-sm rounded-md cursor-pointer">
                                Delete
                            </button>
                        </div>
                    )
                },
            ];

            // remove fieldname everytime form closed
            useEffect(() => {
                if(!form_leave) {
                    setLeave ({
                        id: 0,
                        icon: '',
                        description: ''
                    })
                }
            }, [form_leave])

            // fetch database
            const fetchData_leave = useCallback(() => {
                api.get('/roster', {
                    params: {
                        switch: 'leave'
                    }
                })
                .then((response) => {
                    setDatabase_leave(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching:', error);
                });
            }, []);
            useEffect(() => {
                fetchData_leave()
            }, [])

            // CREATE
            const handleCreate_leave = async() => {

                // loading
                setIsLoading(true)
                try {
                    await api.post(`/roster`, {
                        icon: leave.icon,
                        description: leave.description,

                        switch: 'leave'
                    });

                    fetchData_leave()
                    setForm_leave(false)
                }
                catch(error) {
                    console.error('Error:', error); // use only to remove warning on vscode
                    // console.error('Response status:', error.response?.data);
                }
                finally {
                    setIsLoading(false)
                }
            }
        //#endregion
    //#endregion

    return (
        <>
            {/* #region 0) --> main */}
            <>
                <Grid className="md:grid-cols-5">
                    <Tabs className="col-span-3 grid grid-cols-3" tabs={tabs} active={active} setActive={setActive} />
                </Grid>
            </>

            {/* #region 1) --> therapist */}
            {active == 'therapist' && (
                <>
                    {/* Create */}
                    <Grid className="md:grid-cols-5 items-center">
                        <Label>{databaseTherapist.length} Therapist</Label>
                    </Grid>
                    
                    {/* table */}
                    <Grid className="lg:grid-cols-3">
                        {databaseTherapist.map((data) => (
                            <div key={data.id} className="w-full rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary">
                                            <span className="text-xl font-bold text-secondary">
                                                {data.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-stone-900">{data.name}</h2>
                                            <p className="text-sm text-title">{data.code}</p>
                                        </div>
                                    </div>

                                    <span className="whitespace-nowrap rounded-full bg-tertiary px-2 py-1 text-xs text-title font-semibold tracking-wide">
                                        {data.specialty}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="mt-5 space-y-2 text-[15px] ">
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Phone</span>
                                        <span className="font-medium text-title">{data.phoneNo}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Email</span>
                                        <span className="font-medium text-title">{data.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-title">Bookable</span>
                                        <span className="font-medium text-title">No</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Grid>
                </>
            )}

            {/* #region 2) --> roster */}
            {active == 'roster' && (
                <>
                    {/* Roster */}
                    <Grid>
                        <div className="my-auto">
                            {/* 1) Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-title">
                                        DUTY ROSTER — SEMBUNYI SPA
                                    </p>
                                    <h1 className="text-3xl sm:text-2xl font-serif font-bold text-primary mt-1">
                                        {MONTH_NAMES[monthIndex]} {year}
                                    </h1>
                                </div>
            
                                <div className="flex items-center gap-2">
                                    {/* left */}
                                    <button
                                        onClick={goToPrevMonth}
                                        aria-label="Previous month"
                                        className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                                    >
                                        <span className="-translate-y-px">‹</span>
            
                                    </button>
                                    {/* center */}
                                    <div className="px-4 py-2 rounded-xl border border-border bg-white/60 text-sm font-medium text-primary min-w-35 text-center">
                                        {MONTH_NAMES[monthIndex]} {year}
                                    </div>
                                    {/* right */}
                                    <button
                                        onClick={goToNextMonth}
                                        aria-label="Next month"
                                        className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition cursor-pointer"
                                    >
                                        <span className="-translate-y-px">›</span>
                                    </button>
                                </div>
                            </div>
            
                            {/* 2) Table */}
                            <div className="rounded-2xl overflow-hidden border border-border shadow-sm scrollbar-hide overflow-x-auto">
                                <div className="w-max min-w-full">
                                    {/* 2a) Header */}
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
            
                                    {/* 2b) Body */}
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
                                                        {/* data */}
                                                        {rows.map((row) => {
                                                            const cell = getCell(row.iso, t.id);
            
                                                            return (
                                                                <div key={row.iso} className="px-0.5 py-1 flex justify-center border-l border-border">
                                                                    {cell ? (
                                                                        <button
                                                                            onClick={() => handle_plan(row, t)}
                                                                            className={`w-full min-h-8 text-center text-xs font-bold px-1 py-1 rounded-md cursor-pointer hover:opacity-50 transition ${
                                                                                cell.isOff
                                                                                    ? "bg-blue-200/70 text-blue-900"
                                                                                    : "bg-[#F7DE8B] text-[#5b3f10]"
                                                                            }`}
                                                                        >
                                                                            {cell.label}
                                                                        </button>
                                                                    ) : (
                                                                        // <span className="text-xs text-title">—</span>
                                                                        <button  onClick={() => handle_plan(row, t)} className={`w-full min-h-8 text-center text-sm font-bold px-1 py-1 rounded-md cursor-pointer bg-[#e7e0d2] text-[#6b6355]" hover:opacity-50 transition`}>
                                                                            -
                                                                        </button>
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
                    
                    {/* Legend */}
                    <Grid className="md:grid-cols-2">

                        {/* shift */}
                        <Card>
                            {/* header */}
                            <h2 className="text-sm font-extrabold tracking-wide text-title mb-5">
                                LEGEND — SHIFT TYPE
                            </h2>
                            {/* body */}
                            <ul className="space-y-1">
                                {roster_shiftProp.map((shift) => (
                                <li key={shift.id} className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-md bg-amber-200/70 text-amber-900 font-bold text-sm">
                                        {shift.code}
                                    </span>
                                    <span className="text-slate-700 text-sm">
                                        {formatTime(shift.time_start)} — {formatTime(shift.time_end)}
                                    </span>
                                </li>
                                ))}
                            </ul>
                        </Card>

                        {/* leave */}
                        <Card>
                            {/* header */}
                            <h2 className="text-sm font-extrabold tracking-wide text-title mb-5">
                                LEGEND — LEAVE TYPE
                            </h2>
                            {/* body */}
                            <ul className="space-y-1">
                                {roster_leaveProp.map((leave) => (
                                <li key={leave.id} className="flex items-center gap-2">
                                    <span className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-md font-bold text-xs bg-blue-200/70 text-blue-900`}>
                                        {leave.code}
                                    </span>
                                    <span className="text-slate-700 text-sm">
                                        {leave.description}
                                    </span>
                                </li>
                                ))}
                            </ul>
                        </Card>

                    </Grid>

                    {/* Form */}
                    <Form title="Edit Roster" isOpen={form} onClose={() => setForm(false)} width="max-w-sm"
                        
                        footer={
                            <>
                                <Button
                                    label="Cancel"
                                    className="w-24"
                                    onClick={() => setForm(false)}
                                    disabled={isLoading}
                                />
                                <Button
                                    label="Save"
                                    className="w-24"
                                    onClick={handleEdit_roster}
                                    disabled={isLoading}
                                />

                            </>
                        }
                    >
                        <div className="flex flex-col gap-1">
                            {/* biodata */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-primary font-semibold">{tempUser.name}</span>
                                {/* <span className="text-title font-bold">·</span> */}
                                {/* <span className="text-title">{tempUser.code}</span> */}
                            </div>
                            {/* date iso */}
                            <span className="text-title">
                                {new Date(tempRoster.iso + "T00:00:00").toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>

                            {/* shift */}
                            <span className="text-title font-bold text-sm mt-3">SHIFT</span>
                            <div className="grid grid-cols-3 gap-1">
                                {roster_shiftProp.map((shift) => (
                                    <button key={shift.id} className="border border-border rounded-2xl bg-white py-2 cursor-pointer hover:bg-amber-200">
                                        <span className="text-title text-xl font-bold">{shift.code}</span>
                                            <br />
                                        <span className="text-title text-[10px]">{formatTime(shift.time_start)} <b>-</b> {formatTime(shift.time_end)}</span>
                                    </button>
                                ))}
                            </div>

                            {/* leave */}
                            <span className="text-title font-bold text-sm mt-3">LEAVE / STATUS</span>
                            <div className="grid grid-cols-3 gap-1">
                                {roster_leaveProp.map((leave) => (
                                    <button key={leave.id} className="border border-border rounded-2xl bg-white py-2 cursor-pointer hover:bg-amber-200">
                                        <span className="text-title text-md font-bold">{leave.code}</span>
                                            <br />
                                        <span className="text-title text-[10px]">{leave.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Form>
                </>
            )}

            {/* #region 3) --> legend */}
            {active == 'legend' && (
                <>
                    {/* a) shift */}
                    <>
                        {/* Create */}
                        <Grid className="md:grid-cols-5 items-center">
                            <Label>{databaseShift.length} Shift</Label>
                            <Button onClick={() => { setForm_shift(true); setCrud('create')}} icon={Plus} label='Add Shift' className="md:col-start-5"/>
                        </Grid>

                        {/* table */}
                        <Grid >
                            <Table fieldName={tableTitle_shift} data={databaseShift}  />
                        </Grid>

                        {/* form */}
                        <Form title={crud=='create'? 'Add Shift':'Edit Shift'} isOpen={form_shift} onClose={() => setForm_shift(false)} width="max-w-lg"
                            
                            footer={
                                <>
                                    <Button
                                        label="Cancel"
                                        className="w-24"
                                        onClick={() => setForm_shift(false)}
                                        disabled={isLoading}
                                    />

                                    {crud == 'create' ? (
                                        <Button
                                            label="Save"
                                            className="w-24"
                                            onClick={handleCreate_shift}
                                            disabled={isLoading}
                                        />
                                    ) : (

                                        <Button
                                            label="Update"
                                            className="w-24"
                                            onClick={handleCreate_shift}
                                            disabled={isLoading}
                                        />
                                    )}

                                </>
                            }
                        >
                            <div className="space-y-4">
                                {/* 1) */}
                                <Field
                                    label="Icon"
                                    placeholder="Set an icon"
                                    value={shift.icon}
                                    onChange={(e) => setShift({
                                        ...shift,
                                        icon: e.target.value === "" ? "" : Number(e.target.value)
                                    })}
                                    type="number"
                                />
                                {/* 2) */}
                                <Field
                                    label="Time start"
                                    placeholder="Set start time"
                                    value={shift.time_start}
                                    onChange={(e) => setShift({...shift, time_start: e.target.value})}
                                    type="time"
                                />
                                {/* 3) */}
                                <Field
                                    label="Time end"
                                    placeholder="Set end time"
                                    value={shift.time_end}
                                    onChange={(e) => setShift({...shift, time_end: e.target.value})}
                                    type="time"
                                />
                            </div>
                        </Form>
                    </>
                    
                    {/* b) leave */}
                    <>
                        {/* Create */}
                        <Grid className="md:grid-cols-5 items-center">
                            <Label>{databaseLeave.length} Leave</Label>
                            <Button onClick={() => { setForm_leave(true); setCrud('create')}} icon={Plus} label='Add Leave' className="md:col-start-5"/>
                        </Grid>

                        {/* table */}
                        <Grid>
                            <Table fieldName={tableTitle_leave} data={databaseLeave}  />
                        </Grid>

                        {/* form */}
                        <Form title={crud=='create'? 'Add Leave':'Edit Leave'} isOpen={form_leave} onClose={() => setForm_leave(false)} width="max-w-lg"
                            
                            footer={
                                <>
                                    <Button
                                        label="Cancel"
                                        className="w-24"
                                        onClick={() => setForm_leave(false)}
                                        disabled={isLoading}
                                    />

                                    {crud == 'create' ? (
                                        <Button
                                            label="Save"
                                            className="w-24"
                                            onClick={handleCreate_leave}
                                            disabled={isLoading}
                                        />
                                    ) : (

                                        <Button
                                            label="Update"
                                            className="w-24"
                                            onClick={handleCreate_leave}
                                            disabled={isLoading}
                                        />
                                    )}

                                </>
                            }
                        >
                            <div className="space-y-4">
                                {/* 1) */}
                                <Field
                                    label="Icon"
                                    placeholder="Set an icon"
                                    value={leave.icon}
                                    onChange={(e) => setLeave({...leave, icon: e.target.value})}
                                />
                                {/* 2) */}
                                <Field
                                    label="Description"
                                    placeholder="Set description"
                                    value={leave.description}
                                    onChange={(e) => setLeave({...leave, description: e.target.value})}
                                />
                            </div>
                        </Form>
                    </>
                </>

            )}


        </>
    )
}

export default Therapist;