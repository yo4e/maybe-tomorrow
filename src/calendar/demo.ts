import { importIcsText } from "./importCore";
import type {
  CalendarImportResult,
  CalendarWindow,
  EventClassification,
} from "./types";

export const DEMO_CALENDAR_DATE = "2026-07-21";
export const DEMO_CALENDAR_FILE_NAME = "Yoshies-Overfull-Tuesday.ics";

export const DEMO_CALENDAR_ICS = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Maybe Tomorrow//Fictional Demo Calendar//EN\r
CALSCALE:GREGORIAN\r
X-WR-CALNAME:Yoshie's Overfull Tuesday\r
X-WR-TIMEZONE:Asia/Tokyo\r
BEGIN:VTIMEZONE\r
TZID:Asia/Tokyo\r
BEGIN:STANDARD\r
DTSTART:19700101T000000\r
TZOFFSETFROM:+0900\r
TZOFFSETTO:+0900\r
TZNAME:JST\r
END:STANDARD\r
END:VTIMEZONE\r
BEGIN:VEVENT\r
UID:demo-school-prep@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T073000\r
DTEND;TZID=Asia/Tokyo:20260721T081500\r
SUMMARY:Breakfast and school prep\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-client-draft@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T083000\r
DTEND;TZID=Asia/Tokyo:20260721T103000\r
SUMMARY:Send the promised client draft\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-admin@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T103000\r
DTEND;TZID=Asia/Tokyo:20260721T110000\r
SUMMARY:Admin messages\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-project-call@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T110000\r
DTEND;TZID=Asia/Tokyo:20260721T120000\r
SUMMARY:Project call\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-lunch@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T120000\r
DTEND;TZID=Asia/Tokyo:20260721T124500\r
SUMMARY:Lunch away from screens\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-festival@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T130000\r
DTEND;TZID=Asia/Tokyo:20260721T150000\r
SUMMARY:Festival planning\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-school-pickup@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T151500\r
DTEND;TZID=Asia/Tokyo:20260721T161500\r
SUMMARY:School pickup\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-gym@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T163000\r
DTEND;TZID=Asia/Tokyo:20260721T173000\r
SUMMARY:Go to the gym\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-family-dinner@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T180000\r
DTEND;TZID=Asia/Tokyo:20260721T200000\r
SUMMARY:Family dinner\r
STATUS:CONFIRMED\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:demo-quiet-time@maybe-tomorrow\r
DTSTAMP:20260718T000000Z\r
DTSTART;TZID=Asia/Tokyo:20260721T203000\r
DTEND;TZID=Asia/Tokyo:20260721T210000\r
SUMMARY:Quiet recovery\r
STATUS:CONFIRMED\r
END:VEVENT\r
END:VCALENDAR\r
`;

const neutral: EventClassification = {
  fixed: false,
  movable: false,
  reducible: false,
  highEnergy: false,
  recovery: false,
};

export const DEMO_CLASSIFICATIONS_BY_UID: Readonly<
  Record<string, EventClassification>
> = {
  "demo-school-prep@maybe-tomorrow": { ...neutral, fixed: true },
  "demo-client-draft@maybe-tomorrow": {
    ...neutral,
    fixed: true,
    highEnergy: true,
  },
  "demo-admin@maybe-tomorrow": { ...neutral, reducible: true },
  "demo-project-call@maybe-tomorrow": {
    ...neutral,
    fixed: true,
    highEnergy: true,
  },
  "demo-lunch@maybe-tomorrow": { ...neutral, recovery: true },
  "demo-festival@maybe-tomorrow": {
    ...neutral,
    movable: true,
    reducible: true,
    highEnergy: true,
  },
  "demo-school-pickup@maybe-tomorrow": { ...neutral, fixed: true },
  "demo-gym@maybe-tomorrow": {
    ...neutral,
    movable: true,
    reducible: true,
    highEnergy: true,
  },
  "demo-family-dinner@maybe-tomorrow": { ...neutral, fixed: true },
  "demo-quiet-time@maybe-tomorrow": { ...neutral, recovery: true },
};

export function importDemoCalendar(window: CalendarWindow): CalendarImportResult {
  return importIcsText(
    {
      text: DEMO_CALENDAR_ICS,
      fileName: DEMO_CALENDAR_FILE_NAME,
      sourceId: "demo-overfull-tuesday",
      kind: "demo",
    },
    { window },
  );
}
