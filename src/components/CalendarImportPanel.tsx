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
      setLocalError("Choose .ics files or one .zip calendar export.");
    } else if (supported.length > 10) {
      setLocalError("Choose no more than 10 files at once.");
    } else {
      setLocalError(null);
    }
    setFiles(supported.slice(0, 10));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) {
      setLocalError("Choose a calendar snapshot first.");
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
      <div className="eyebrow">CALENDAR SNAPSHOT</div>
      <h1 id="import-heading" data-stage-focus tabIndex={-1}>
        Bring the day here. Only here.
      </h1>
      <p className="lede">
        Export an iCalendar file from your calendar service, then choose it
        below. Maybe Tomorrow. reads it locally and makes no network request.
      </p>

      <div className="demo-invitation">
        <div>
          <span className="demo-label">NO FILE? START HERE</span>
          <h2>Yoshie’s fictional overfull Tuesday</h2>
          <p>Pre-labelled, private, and ready for the complete demo.</p>
        </div>
        <button className="button button-primary" type="button" onClick={onLoadDemo}>
          Load demo day <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="or-divider"><span>or use your snapshot</span></div>

      <form onSubmit={submit} noValidate>
        <label className="input-label" htmlFor={`${inputId}-date`}>
          First day to inspect
        </label>
        <input
          className="date-input"
          id={`${inputId}-date`}
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
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
            <strong>Choose .ics or .zip files</strong>
            <span>or drop them here · up to 5 MB total compressed</span>
          </label>
          <input
            className="visually-hidden"
            id={inputId}
            type="file"
            accept=".ics,.zip,text/calendar,application/zip"
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
        {busy ? <p className="import-status" role="status">Reading the snapshot in this tab…</p> : null}

        <button
          className="button button-primary"
          type="submit"
          disabled={busy || files.length === 0}
        >
          {busy ? "Reading…" : "Inspect this snapshot"}
        </button>
      </form>

      <details className="privacy-details">
        <summary>What stays private?</summary>
        <p>
          Event titles and times remain in this browser. The original file is
          never saved to the journal. Imported events start unlabelled because
          the app does not guess their meaning.
        </p>
      </details>
    </section>
  );
}
