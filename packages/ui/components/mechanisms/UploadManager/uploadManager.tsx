import { createContext, useContext, useId, useMemo, useRef, useState, type ChangeEvent, type PropsWithChildren } from "react";
import { create } from "zustand";
import { Button } from "../../atoms/Button/button";
import { Text } from "../../atoms/Text/text";
import { UploadInput } from "../../atoms/UploadInput/uploadInput";
import styles from "./uploadManager.module.scss";

export interface UploadSource {
  page: string;
  section: string;
}

export interface ManagedUpload {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  createdAt: string;
  source: UploadSource;
}

type UploadManagerMode = "internal" | "controlled" | "zustand";

interface OpenUploadPickerOptions {
  source: UploadSource;
  multiple?: boolean;
  accept?: string;
}

interface UploadManagerContextValue {
  uploads: ManagedUpload[];
  openUploadPicker: (options: OpenUploadPickerOptions) => void;
  addUploads: (files: File[], source: UploadSource) => void;
  removeUpload: (uploadId: string) => void;
  clearUploads: () => void;
}

interface UploadManagerProviderProps extends PropsWithChildren {
  mode?: UploadManagerMode;
  uploads?: ManagedUpload[];
  onUploadsChange?: (uploads: ManagedUpload[]) => void;
}

interface PendingSelection {
  multiple?: boolean;
  accept?: string;
  source: UploadSource;
}

interface UploadState {
  uploads: ManagedUpload[];
  setUploads: (uploads: ManagedUpload[]) => void;
}

const useUploadManagerStore = create<UploadState>((set: (partial: Partial<UploadState>) => void) => ({
  uploads: [],
  setUploads: (uploads: ManagedUpload[]) => set({ uploads }),
}));

const UploadManagerContext = createContext<UploadManagerContextValue | undefined>(undefined);

const createManagedUploads = (files: File[], source: UploadSource): ManagedUpload[] =>
  files.map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    createdAt: new Date().toISOString(),
    source,
  }));

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export function UploadManagerProvider({
  children,
  mode = "internal",
  uploads: controlledUploads,
  onUploadsChange,
}: UploadManagerProviderProps) {
  const [internalUploads, setInternalUploads] = useState<ManagedUpload[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputId = useId();
  const pendingSelectionRef = useRef<PendingSelection | null>(null);
  const zustandUploads = useUploadManagerStore((state: UploadState) => state.uploads);
  const setZustandUploads = useUploadManagerStore((state: UploadState) => state.setUploads);
  const [inputConfig, setInputConfig] = useState<{ multiple: boolean; accept?: string }>({
    multiple: true,
    accept: undefined,
  });

  const uploads =
    mode === "controlled" ? controlledUploads ?? [] : mode === "zustand" ? zustandUploads : internalUploads;

  const setUploads = (nextUploads: ManagedUpload[]) => {
    if (mode === "controlled") {
      onUploadsChange?.(nextUploads);
      return;
    }

    if (mode === "zustand") {
      setZustandUploads(nextUploads);
      return;
    }

    setInternalUploads(nextUploads);
  };

  const openUploadPicker = (options: OpenUploadPickerOptions) => {
    pendingSelectionRef.current = {
      accept: options.accept,
      multiple: options.multiple ?? true,
      source: options.source,
    };
    setInputConfig({
      accept: options.accept,
      multiple: options.multiple ?? true,
    });
    inputRef.current?.click();
  };

  const handleSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const selection = pendingSelectionRef.current;

    if (files.length > 0 && selection) {
      setUploads([...uploads, ...createManagedUploads(files, selection.source)]);
    }

    event.target.value = "";
  };

  const value = useMemo<UploadManagerContextValue>(
    () => ({
      uploads,
      openUploadPicker,
      addUploads: (files: File[], source: UploadSource) =>
        setUploads([...uploads, ...createManagedUploads(files, source)]),
      removeUpload: (uploadId: string) =>
        setUploads(uploads.filter((upload: ManagedUpload) => upload.id !== uploadId)),
      clearUploads: () => setUploads([]),
    }),
    [uploads],
  );

  return (
    <UploadManagerContext.Provider value={value}>
      {children}
      <UploadInput
        accept={inputConfig.accept}
        className={styles.hiddenInput}
        helperText=""
        id={inputId}
        label=""
        multiple={inputConfig.multiple}
        onChange={handleSelection}
        ref={inputRef}
        tabIndex={-1}
      />
    </UploadManagerContext.Provider>
  );
}

export function useUploadManager() {
  const context = useContext(UploadManagerContext);

  if (!context) {
    throw new Error("useUploadManager must be used within an UploadManagerProvider");
  }

  return context;
}

export function UploadManagerPanel() {
  const [open, setOpen] = useState(true);
  const { uploads, removeUpload, clearUploads } = useUploadManager();

  return (
    <aside className={`${styles.panel} ${open ? styles.expanded : styles.collapsed}`}>
      <div className={styles.panelHeader}>
        <div>
          <strong className={styles.panelTitle}>Upload Manager</strong>
          <Text tone="muted">{uploads.length} file{uploads.length === 1 ? "" : "s"} tracked</Text>
        </div>
        <div className={styles.panelActions}>
          {uploads.length > 0 ? (
            <button className={styles.linkAction} onClick={() => clearUploads()} type="button">
              Clear
            </button>
          ) : null}
          <button className={styles.toggle} onClick={() => setOpen((current) => !current)} type="button">
            {open ? "-" : "+"}
          </button>
        </div>
      </div>

      {open ? (
        <div className={styles.uploadList}>
          {uploads.length === 0 ? (
            <div className={styles.emptyState}>
              <Text tone="muted">No uploads yet. Trigger one from any page and it will appear here.</Text>
            </div>
          ) : (
            uploads.map((upload) => (
              <div className={styles.uploadCard} key={upload.id}>
                <div className={styles.uploadMeta}>
                  <strong className={styles.fileName}>{upload.name}</strong>
                  <span className={styles.fileInfo}>
                    {formatFileSize(upload.size)} | {upload.type || "unknown"}
                  </span>
                </div>
                <div className={styles.badges}>
                  <span className={styles.badge}>{upload.source.page}</span>
                  <span className={styles.badge}>{upload.source.section}</span>
                </div>
                <div className={styles.uploadActions}>
                  <Text tone="muted">{new Date(upload.createdAt).toLocaleString()}</Text>
                  <Button className={styles.removeButton} onClick={() => removeUpload(upload.id)} type="button">
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </aside>
  );
}
