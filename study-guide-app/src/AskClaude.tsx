/**
 * AskClaude.tsx
 *
 * Lightweight "Ask Claude" integration that uses claude.ai's `?q=` URL
 * parameter to launch a new conversation pre-filled with study-guide context.
 * No API key, no backend — opens in a new tab against the user's existing
 * Claude Pro session.
 *
 * Three entry points:
 *   1. Highlight any text on the page → a floating "Ask Claude about this"
 *      button appears near the selection.
 *   2. Per-Card / per-section <AskClaudeButton/> — sends that section's
 *      content as context.
 *   3. A persistent FAB at the bottom-right for free-form questions about
 *      the currently visible section.
 *
 * All three open the same modal where the user can refine their question
 * before launching claude.ai.
 */

import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------

const STUDY_GUIDE_PREAMBLE =
  "I'm studying for my CHEM 105B General Chemistry II Lab final at USC " +
  "(Dr. Skibo's class). The exam is 60 minutes, 40 points, covering " +
  "Experiments 1-11 plus cross-cutting reference material.";

export type AskOptions = {
  /** Short label like "Experiment 3 — Calorimetry / Background theory". */
  subject?: string;
  /** The chunk of study-guide text the user is asking about. */
  context?: string;
  /** The user's specific question (added in the modal). */
  question?: string;
};

// claude.ai accepts long URLs, but keep the prompt under ~7 kB so we
// don't hit any browser URL-length cliff.
const MAX_CONTEXT_LEN = 6000;

export function buildClaudePrompt(opts: AskOptions): string {
  const parts: string[] = [STUDY_GUIDE_PREAMBLE];

  if (opts.subject) {
    parts.push(`I'm looking at: **${opts.subject}**`);
  }

  if (opts.context && opts.context.trim()) {
    let ctx = opts.context.trim();
    if (ctx.length > MAX_CONTEXT_LEN) {
      ctx = ctx.slice(0, MAX_CONTEXT_LEN) + "\n\n[…content truncated]";
    }
    parts.push(
      `Here's the relevant content from my study guide:\n\n"""\n${ctx}\n"""`
    );
  }

  if (opts.question && opts.question.trim()) {
    parts.push(`My question: ${opts.question.trim()}`);
  } else {
    parts.push(
      "Please explain it clearly so I build real intuition — point out " +
      "anything subtle, easy to mix up, or commonly tested. Use plain " +
      "language but don't dumb it down."
    );
  }

  return parts.join("\n\n");
}

export function openInClaude(opts: AskOptions): void {
  const prompt = buildClaudePrompt(opts);
  const url = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// ---------------------------------------------------------------------------
// Context: tracks the current section label so any AskClaudeButton can
// default to it.
// ---------------------------------------------------------------------------

type AskClaudeCtx = {
  currentSectionLabel: string;
  setCurrentSectionLabel: (label: string) => void;
  openModal: (initial: AskOptions) => void;
};

const AskClaudeContext = createContext<AskClaudeCtx | null>(null);

/** Returns the AskClaude context, or null if no provider is mounted. */
export function useAskClaude(): AskClaudeCtx | null {
  return useContext(AskClaudeContext);
}

/**
 * Imperatively set the "current section" label for the AskClaude flow.
 * Call from each top-level pane's view so the FAB and selection button
 * include the right subject in their prompt.
 */
export function useAskClaudeSectionLabel(label: string): void {
  const ctx = useContext(AskClaudeContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setCurrentSectionLabel(label);
  }, [ctx, label]);
}

// ---------------------------------------------------------------------------
// Provider + global floating UI
// ---------------------------------------------------------------------------

export function AskClaudeProvider({ children }: { children: ReactNode }) {
  const [currentSectionLabel, setCurrentSectionLabel] = useState(
    "CHEM 105B Lab Final"
  );
  const [modal, setModal] = useState<AskOptions | null>(null);

  const openModal = useCallback((initial: AskOptions) => {
    setModal(initial);
  }, []);

  const value = useMemo<AskClaudeCtx>(
    () => ({ currentSectionLabel, setCurrentSectionLabel, openModal }),
    [currentSectionLabel, openModal]
  );

  return (
    <AskClaudeContext.Provider value={value}>
      {children}
      <AskClaudeFloatingUI
        modal={modal}
        setModal={setModal}
        currentSectionLabel={currentSectionLabel}
      />
    </AskClaudeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Floating UI: selection button + FAB + modal
// ---------------------------------------------------------------------------

type Selection = { text: string; rect: DOMRect };

function AskClaudeFloatingUI({
  modal,
  setModal,
  currentSectionLabel,
}: {
  modal: AskOptions | null;
  setModal: (m: AskOptions | null) => void;
  currentSectionLabel: string;
}) {
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      if (text.length < 6) {
        setSelection(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const el = node instanceof Element ? node : node.parentElement;
      if (!el) {
        setSelection(null);
        return;
      }
      // Don't trigger on selections inside our own UI.
      if (el.closest("[data-ask-claude-ui]")) {
        setSelection(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setSelection(null);
        return;
      }
      setSelection({ text, rect });
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const openWithSelection = useCallback(() => {
    if (!selection) return;
    setModal({
      subject: currentSectionLabel,
      context: selection.text,
    });
    if (typeof window !== "undefined") {
      window.getSelection()?.removeAllRanges();
    }
    setSelection(null);
  }, [selection, currentSectionLabel, setModal]);

  // Position the selection button above-left-of the selection, clamped to
  // the viewport.
  const selectionBtnStyle = useMemo<CSSProperties | null>(() => {
    if (!selection || typeof window === "undefined") return null;
    const r = selection.rect;
    const btnWidth = 200;
    const btnHeight = 36;
    const margin = 8;
    let top = r.top - btnHeight - 6;
    if (top < margin) top = r.bottom + 6;
    let left = r.left + r.width / 2 - btnWidth / 2;
    if (left < margin) left = margin;
    if (left + btnWidth > window.innerWidth - margin) {
      left = window.innerWidth - btnWidth - margin;
    }
    return { position: "fixed", top, left, zIndex: 9000 };
  }, [selection]);

  return (
    <>
      {selection && selectionBtnStyle && !modal && (
        <button
          type="button"
          data-ask-claude-ui
          onMouseDown={(e: MouseEvent) => {
            // Prevent losing the selection before our click handler runs.
            e.preventDefault();
          }}
          onClick={openWithSelection}
          className="ask-claude-selection-btn"
          style={selectionBtnStyle}
        >
          ✨ Ask Claude about this
        </button>
      )}

      <button
        type="button"
        data-ask-claude-ui
        onClick={() => setModal({ subject: currentSectionLabel })}
        className="ask-claude-fab"
        title="Ask Claude about this section"
        aria-label="Ask Claude about this section"
      >
        ✨ Ask Claude
      </button>

      {modal && (
        <AskClaudeModal initial={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function AskClaudeModal({
  initial,
  onClose,
}: {
  initial: AskOptions;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const submit = useCallback(() => {
    openInClaude({ ...initial, question });
    onClose();
  }, [initial, question, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submit();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [submit, onClose]);

  const hasContext = !!(initial.context && initial.context.trim());
  const truncatedContext =
    initial.context && initial.context.length > 600
      ? initial.context.slice(0, 600) + "…"
      : initial.context;

  return (
    <div
      data-ask-claude-ui
      className="ask-claude-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ask-claude-modal" role="dialog" aria-label="Ask Claude">
        <div className="ask-claude-modal-header">
          <span className="ask-claude-modal-title">✨ Ask Claude</span>
          <button
            type="button"
            className="ask-claude-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {initial.subject && (
          <div className="ask-claude-modal-subject">
            <span className="ask-claude-modal-meta-label">Topic:</span>{" "}
            {initial.subject}
          </div>
        )}

        {hasContext && (
          <div className="ask-claude-modal-context">
            <div className="ask-claude-modal-meta-label">
              Context Claude will see:
            </div>
            <blockquote>{truncatedContext}</blockquote>
          </div>
        )}

        <label
          className="ask-claude-modal-meta-label"
          htmlFor="ask-claude-question"
        >
          Your question (optional)
        </label>
        <textarea
          id="ask-claude-question"
          ref={textareaRef}
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            hasContext
              ? "e.g., why does this work? give me a worked example."
              : "e.g., walk me through the rate-law derivation step by step."
          }
          className="ask-claude-modal-input"
        />

        <div className="ask-claude-modal-footer">
          <span className="ask-claude-modal-hint">
            Opens claude.ai in a new tab using your existing Claude account.
            ⌘/Ctrl + Enter to send.
          </span>
          <button
            type="button"
            className="ask-claude-modal-submit"
            onClick={submit}
          >
            Open in Claude →
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline button — drop into any CardHeader trailing slot or anywhere else.
// ---------------------------------------------------------------------------

export function AskClaudeButton({
  subject,
  context,
  label,
  style,
}: {
  subject?: string;
  context?: string;
  label?: string;
  style?: CSSProperties;
}) {
  const ctx = useContext(AskClaudeContext);

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const initial: AskOptions = {
        subject: subject ?? ctx?.currentSectionLabel,
        context,
      };
      if (ctx) {
        ctx.openModal(initial);
      } else {
        // Fallback when no provider is mounted: open Claude immediately.
        openInClaude(initial);
      }
    },
    [ctx, subject, context]
  );

  return (
    <button
      type="button"
      data-ask-claude-ui
      className="ask-claude-inline"
      onClick={onClick}
      title="Ask Claude about this"
    >
      <span aria-hidden="true">✨</span> {label ?? "Ask Claude"}
    </button>
  );
}
