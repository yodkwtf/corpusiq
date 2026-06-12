import { createContext, useContext, useEffect, useMemo, useReducer, useSyncExternalStore } from "react";
import { computeProjection } from "../utils/calculations";
import { DEFAULT_STATE } from "./plannerState";

// Re-export for convenience so consumers import everything from one place.
// eslint-disable-next-line react-refresh/only-export-components
export { validateProfile, hasAnyInvestment } from "./plannerState";

const STORAGE_KEY = "corpus-iq-state-v1";

function plannerReducer(state, action) {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case "SET_INVESTMENT":
      return {
        ...state,
        investments: {
          ...state.investments,
          [action.instrument]: {
            ...state.investments[action.instrument],
            ...action.payload,
          },
        },
      };
    case "SET_ASSUMPTIONS":
      return { ...state, assumptions: { ...state.assumptions, ...action.payload } };
    case "SET_RETURN":
      return {
        ...state,
        assumptions: {
          ...state.assumptions,
          returns: { ...state.assumptions.returns, [action.instrument]: action.value },
        },
      };
    case "SET_STEP":
      return { ...state, ui: { ...state.ui, inputStep: action.step } };
    case "MARK_RESULTS":
      return { ...state, ui: { ...state.ui, hasResults: true } };
    case "SET_DARK":
      // An explicit choice; stop following the device preference.
      return { ...state, ui: { ...state.ui, darkMode: action.value, themeChosen: true } };
    case "RESET":
      return {
        ...DEFAULT_STATE,
        ui: {
          ...DEFAULT_STATE.ui,
          darkMode: state.ui.darkMode,
          themeChosen: state.ui.themeChosen,
        },
      };
    default:
      return state;
  }
}

/** Deep-merge persisted state over defaults so new fields added in future
 *  versions never come back undefined from old localStorage payloads. */
function mergeWithDefaults(saved) {
  if (!saved || typeof saved !== "object") return DEFAULT_STATE;
  return {
    profile: { ...DEFAULT_STATE.profile, ...saved.profile },
    investments: {
      nps: { ...DEFAULT_STATE.investments.nps, ...saved.investments?.nps },
      pf: { ...DEFAULT_STATE.investments.pf, ...saved.investments?.pf },
      mf: { ...DEFAULT_STATE.investments.mf, ...saved.investments?.mf },
    },
    assumptions: {
      ...DEFAULT_STATE.assumptions,
      ...saved.assumptions,
      returns: { ...DEFAULT_STATE.assumptions.returns, ...saved.assumptions?.returns },
    },
    ui: {
      ...DEFAULT_STATE.ui,
      ...saved.ui,
      // Payloads saved before device-based theming existed have a boolean
      // darkMode the user never actually chose; revert those to "follow device".
      darkMode: saved.ui?.themeChosen ? saved.ui.darkMode : null,
    },
  };
}

const darkQuery = "(prefers-color-scheme: dark)";

function subscribeToSystemTheme(callback) {
  const mq = window.matchMedia(darkQuery);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSystemDark() {
  return window.matchMedia(darkQuery).matches;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeWithDefaults(JSON.parse(raw));
  } catch {
    // corrupted storage - fall through to defaults
  }
  return DEFAULT_STATE;
}

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [state, dispatch] = useReducer(plannerReducer, undefined, loadInitialState);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full / private mode - non-fatal
    }
  }, [state]);

  // Theme: explicit user choice wins, otherwise follow the device.
  const systemDark = useSyncExternalStore(subscribeToSystemTheme, getSystemDark);
  const isDark = state.ui.darkMode ?? systemDark;

  // Dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const projection = useMemo(() => {
    try {
      return computeProjection(state);
    } catch {
      return null; // ErrorBoundary-friendly: dashboard shows fallback
    }
  }, [state]);

  const value = useMemo(
    () => ({ state, dispatch, projection, isDark }),
    [state, projection, isDark]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
