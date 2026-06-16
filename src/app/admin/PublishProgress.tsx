"use client";

import { motion, AnimatePresence } from "framer-motion";

export type PublishPhase = "idle" | "running" | "done" | "error";

export const PUBLISH_STEPS = [
  "Optimizing your images",
  "Saving your changes",
  "Publishing to your website",
  "Starting the deployment",
];

function Spinner() {
  return (
    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-[#e07b39]/30 border-t-[#e07b39]" />
  );
}

function RunningState({ stepIndex }: { stepIndex: number }) {
  const total = PUBLISH_STEPS.length;
  const progress = Math.min(100, ((stepIndex + 0.5) / total) * 100);
  return (
    <div>
      <h2 className="text-xl font-bold text-[#2d1810]">Publishing your changes</h2>
      <p className="mt-1 text-sm text-[#8a7a6a]">Please keep this page open for a moment…</p>

      <div className="mt-6 space-y-1">
        {PUBLISH_STEPS.map((label, i) => {
          const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "todo";
          return (
            <motion.div
              key={label}
              className="flex items-center gap-3 py-2"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center">
                {state === "done" ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="grid h-6 w-6 place-items-center rounded-full bg-[#e07b39] text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.span>
                ) : state === "active" ? (
                  <Spinner />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e0d3c4]" />
                )}
              </span>
              <motion.span
                animate={state === "active" ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                transition={state === "active" ? { repeat: Infinity, duration: 1.4 } : {}}
                className={`text-sm ${state === "todo" ? "text-[#b9ab9b]" : "font-medium text-[#2d1810]"}`}
              >
                {label}
                {state === "active" ? "…" : ""}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[#f0e6da]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#e07b39] to-[#d4a853]"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.6 }}
        />
      </div>
    </div>
  );
}

function DoneState({ commitUrl, onClose }: { commitUrl?: string; onClose: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f5e9] text-green-600"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-9 w-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />
        </svg>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-xl font-bold text-[#2d1810]"
      >
        Published successfully! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32 }}
        className="mt-2 text-sm text-[#6a5a4a]"
      >
        Your changes are saved. The live website will update in about 2–3 minutes.
      </motion.p>
      <div className="mt-6 flex items-center justify-center gap-4">
        {commitUrl && (
          <a href={commitUrl} target="_blank" rel="noreferrer" className="text-sm text-[#e07b39] underline">
            view commit
          </a>
        )}
        <button onClick={onClose} className="rounded-full bg-[#e07b39] px-6 py-2.5 text-sm font-semibold text-white">
          Done
        </button>
      </div>
    </div>
  );
}

function ErrorState({ error, onClose }: { error?: string; onClose: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
        <svg
          viewBox="0 0 24 24"
          className="h-9 w-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-[#2d1810]">Publishing failed</h2>
      <p className="mt-2 break-words text-sm text-[#6a5a4a]">
        {error || "Something went wrong. Please try again."}
      </p>
      <button onClick={onClose} className="mt-6 rounded-full bg-[#e07b39] px-6 py-2.5 text-sm font-semibold text-white">
        Close
      </button>
    </div>
  );
}

export default function PublishProgress({
  phase,
  stepIndex,
  commitUrl,
  error,
  onClose,
}: {
  phase: PublishPhase;
  stepIndex: number;
  commitUrl?: string;
  error?: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="publish-overlay"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            initial={{ scale: 0.92, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {phase === "error" ? (
              <ErrorState error={error} onClose={onClose} />
            ) : phase === "done" ? (
              <DoneState commitUrl={commitUrl} onClose={onClose} />
            ) : (
              <RunningState stepIndex={stepIndex} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
