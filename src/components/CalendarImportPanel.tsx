import { useId, useState, type DragEvent, type FormEvent } from "react";
import { formatLocalDate } from "../calendar/day";

export type CalendarImportPanelProps = {
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onLoadDemo: () => void;
  onImport: (files: File[], startDate: string) => Promise<void>;
};

export function CalendarImportPanel({
  busy,
  error,
  onBack,
  onLoadDemo,
  onImport,
}: CalendarImportPanelProps) {
  const inputId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [startDate, setStartDate] = useState(() => formatLocalDate(new Date()));
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const chooseFiles = (nextFiles: File[]) => {
    const supported = nextFiles.filter((file) => /\.(ics|zip)$/i.test(file.name));
    if (supported.length !== nextFiles.length) {
      setLocalError("Choose .ics or .zip calendar files.");
    } else if (supported.length > 10) {
      setLocalError("Choose no more than 10 calendar files at once.");
    } else {
      setLocalError(null);
    }
    setFiles(supported.slice(0, 10));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) {
      setLocalError("Choose a calendar file first.");
      return;
    }
    await onImport(files, startDate);
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    chooseFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <section className="import-panel panel" aria-labelledby="import-heading">
      <button className="back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back
      </button>
      <div className="eyebrow">OPTIONAL DAY CONTEXT</div>
      <h1 id="import-heading" data-stage-focus tabIndex={-1}>
        Add calendar context
      </h1>
      <p className="lede">
        Choose one or more <code>.ics</code> files, or a ZIP containing <code>.ics</code>
        files—including a Google Calendar export. You can use the downloaded ZIP
        as-is. There is no need to unpack it yourself.
      </p>

      <p id={`${inputId}-privacy`}>
        The file is read in this browser. It is not uploaded, synchronized, or
        written back to your calendar. To update the calendar context, export a
        fresh file and import it again.
      </p>

      <form onSubmit={submit} noValidate>
        <label className="input-label" htmlFor={`${inputId}-date`}>
          Start date
        </label>
        <p id={`${inputId}-date-help`}>
          Choose the first day. Maybe Tomorrow. will inspect a seven-day window
          starting there.
        </p>
        <input
          className="date-input"
          id={`${inputId}-date`}
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          aria-describedby={`${inputId}-date-help`}
          required
        />

        <div
          className={`file-drop ${dragging ? "is-dragging" : ""}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
        >
          <label className="file-label" htmlFor={inputId}>
            <strong>Choose .ics or .zip calendar files</strong>
            <span>
              or drop them here · up to 10 files · 5 MB total
            </span>
          </label>
          <input
            className="visually-hidden"
            id={inputId}
            type="file"
            accept=".ics,.zip,text/calendar,application/zip"
            aria-describedby={`${inputId}-privacy`}
            multiple
            onChange={(event) => chooseFiles(Array.from(event.target.files ?? []))}
          />
        </div>

        {files.length > 0 ? (
          <ul className="selected-files" aria-label="Selected files">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`}>
                <span>{file.name}</span>
                <span>{Math.max(1, Math.round(file.size / 1024))} KB</span>
              </li>
            ))}
          </ul>
        ) : null}

        {localError || error ? (
          <p className="form-error" role="alert">{localError ?? error}</p>
        ) : null}
        {busy ? <p className="import-status" role="status">Reading the calendar file in this browser…</p> : null}

        <button
          className="button button-primary"
          type="submit"
          disabled={busy || files.length === 0}
        >
          {busy ? "Reading…" : "Use my calendar file"}
        </button>
      </form>

      <details className="calendar-guide">
        <summary>How to export from Google Calendar</summary>
        <ol>
          <li>On a computer, open Google Calendar.</li>
          <li>Open Settings, then choose Settings.</li>
          <li>Choose Import &amp; export on the left.</li>
          <li>Under Export, choose Export. Google downloads a ZIP file.</li>
          <li>Return here and choose that ZIP as downloaded. Do not unpack it first.</li>
        </ol>
        <p>
          Calendar export is not available in the Google Calendar mobile app. A
          work or school administrator may also restrict calendar exports.
        </p>
        <p>
          <strong>Not supported:</strong> screenshots, PDFs, CSV files, calendar
          links, encrypted ZIPs, and other archive formats.
        </p>
      </details>

      <div className="or-divider"><span>or try it without personal data</span></div>

      <div className="demo-invitation">
        <div>
          <span className="demo-label">NO PERSONAL FILE NEEDED</span>
          <h2>Try a fictional sample day</h2>
          <p>A fictional Tuesday is already labeled and ready to explore.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={onLoadDemo}>
          Try the sample day <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
