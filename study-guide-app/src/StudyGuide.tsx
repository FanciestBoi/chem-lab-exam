import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
  Math,
  MathBlock,
  MixedText,
} from "./canvas-shim";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ============================================================
// CHEM 105B Lab Final Study Guide
// USC General Chemistry II Lab — Dr. Skibo
// Covers Experiments 1-11 plus cross-cutting reference sections.
// All content drawn from the CHEM 105B Lab Manual + prior pre-lab quizzes.
// ============================================================

type Subsection = {
  heading: string;
  body?: string;
  bullets?: string[];
  equations?: string[];
};

type QA = { q: string; a: string };
type Practice = { q: string; solution: string };

type ErrorRow = {
  source: string;
  effect: string;
  direction?: "high" | "low" | "either" | "neutral";
};

type Experiment = {
  id: string;
  num: number;
  title: string;
  short: string;
  oneLiner: string;
  learningObjectives: string[];
  experimentalObjectives: string[];
  theory: Subsection[];
  procedure: string[];
  procedureWhy: { step: string; why: string }[];
  dataAnalysis: Subsection[];
  errors: ErrorRow[];
  whyQA: QA[];
  practice: Practice[];
};

// ------------------------------------------------------------
// EXPERIMENTS
// ------------------------------------------------------------

const experiments: Experiment[] = [
  {
    id: "exp1",
    num: 1,
    title: "Kinetics I — Initial Rate Method",
    short: "Kinetics I",
    oneLiner:
      "Determine the rate law and rate constant for the iodide-catalyzed decomposition of H₂O₂ by measuring O₂ gas evolved.",
    learningObjectives: [
      "Define rate of reaction and rate constant; distinguish a rate law from a balanced equation.",
      "Use the method of initial rates to extract orders m and n with respect to two reactants.",
      "Understand what a catalyst does (lowers Ea, not consumed) versus a reactant.",
      "Recognize that rate depends on concentration AND temperature; k changes with T (Arrhenius).",
      "Interpret the linear plot of moles O₂ vs. time as a measure of rate when [reactants] is essentially constant in the early stage.",
    ],
    experimentalObjectives: [
      "Measure the volume of O₂ gas produced over time as H₂O₂ decomposes in the presence of KI.",
      "Use the ideal-gas law to convert volume of O₂ to moles of O₂.",
      "Plot moles O₂ vs. time; the slope (early-time, linear region) = initial rate.",
      "Vary [H₂O₂] (with [I⁻] fixed) and [I⁻] (with [H₂O₂] fixed) to obtain m and n.",
      "Calculate the rate constant k from rate, [H₂O₂], and [I⁻].",
    ],
    theory: [
      {
        heading: "Rate of reaction",
        body:
          "For 2H₂O₂(aq) → 2H₂O(l) + O₂(g), the reaction rate is defined so it is positive and identical regardless of which species you track:",
        equations: [
          "rate = -½ d[H₂O₂]/dt = +d[O₂]/dt",
        ],
      },
      {
        heading: "Rate law",
        body:
          "The rate law is determined experimentally and need NOT match the stoichiometric coefficients:",
        equations: ["rate = k [H₂O₂]^m [I⁻]^n"],
      },
      {
        heading: "Method of initial rates",
        body:
          "Run two trials in which only one concentration changes between them. Then m and n are extracted from ratios:",
        equations: [
          "rate₂ / rate₁ = ([H₂O₂]₂ / [H₂O₂]₁)^m   (with [I⁻] fixed)",
          "rate₃ / rate₁ = ([I⁻]₃ / [I⁻]₁)^n     (with [H₂O₂] fixed)",
        ],
      },
      {
        heading: "Connecting V(O₂) to moles and rate",
        body:
          "Using the ideal-gas law at room T and atmospheric P, n_O₂ = PV/RT. A plot of n_O₂ vs. time has slope = d(n_O₂)/dt, which equals the rate of O₂ formation in moles/s. Divide by the reaction-vessel volume to get rate in M/s.",
        equations: [
          "PV = nRT",
          "rate = (1/V_solution) · d(n_O₂)/dt",
        ],
      },
      {
        heading: "Catalyst vs. reactant",
        body:
          "I⁻ is a catalyst — it appears in the rate law but is regenerated and not consumed. KI lowers Ea by providing an alternative two-step mechanism (H₂O₂ + I⁻ → H₂O + IO⁻; IO⁻ + H₂O₂ → H₂O + O₂ + I⁻).",
      },
    ],
    procedure: [
      "Set up a closed reaction flask connected to an inverted, water-filled gas-collection tube/burette (water-displacement method).",
      "Add a known volume of H₂O₂ to the flask, then quickly add a known volume of KI solution and seal.",
      "Record the volume of O₂ collected at regular time intervals (every 15-30 s) for the first few minutes.",
      "Repeat with one concentration changed: e.g. doubled [H₂O₂] (same [I⁻]); then doubled [I⁻] (same [H₂O₂]).",
      "Record room temperature and barometric pressure to convert V(O₂) → n(O₂).",
    ],
    procedureWhy: [
      {
        step: "Why use a closed apparatus with water displacement?",
        why:
          "O₂ is a gas; you can only quantify it by trapping all of it. A closed system with the inverted, water-filled column lets you read V directly as O₂ pushes water down.",
      },
      {
        step: "Why is only the EARLY (linear) portion of the curve used?",
        why:
          "The method of INITIAL rates assumes [reactants] are still essentially their initial values. Late in the run, [H₂O₂] has dropped and the slope no longer reflects the true initial rate.",
      },
      {
        step: "Why double exactly one concentration at a time?",
        why:
          "If you change two variables, you cannot isolate either order. Holding one fixed is what lets you take the ratio rate₂/rate₁ and read off m or n directly.",
      },
      {
        step: "Why does I⁻ concentration appear in the rate law if it is a catalyst?",
        why:
          "Catalysts participate in the mechanism — the slow step here involves I⁻. They are not consumed overall, but their concentration controls how often the slow step occurs.",
      },
      {
        step: "Why record T and P?",
        why:
          "You need PV = nRT to convert your measured V into moles of O₂. T must be in K, P in atm (or use R = 8.314 J/mol·K with SI units).",
      },
    ],
    dataAnalysis: [
      {
        heading: "Step 1 — Convert V(O₂) → n(O₂)",
        equations: ["n_O₂ = P · V / (R · T)"],
        body: "Use the SAME P and T for every trial.",
      },
      {
        heading: "Step 2 — Plot n(O₂) vs. t and fit the linear region",
        body:
          "Use LINEST (or trendline) on the linear portion only. The slope is d(n_O₂)/dt in mol/s. Divide by the total reaction-mixture volume to get rate in M/s.",
      },
      {
        heading: "Step 3 — Solve for m, n, k",
        equations: [
          "m = log(rate₂/rate₁) / log([H₂O₂]₂/[H₂O₂]₁)",
          "n = log(rate₃/rate₁) / log([I⁻]₃/[I⁻]₁)",
          "k = rate / ([H₂O₂]^m [I⁻]^n)",
        ],
        body:
          "If doubling [H₂O₂] doubles the rate, m = 1; if doubling it quadruples the rate, m = 2; if rate is unchanged, m = 0.",
      },
      {
        heading: "Worked example",
        body:
          "Trial 1: [H₂O₂]=0.30 M, [I⁻]=0.10 M, rate = 1.2×10⁻⁴ M/s. Trial 2: [H₂O₂]=0.60 M, [I⁻]=0.10 M, rate = 2.4×10⁻⁴ M/s. → ratio 2/2 = 2, m = 1. Trial 3: [H₂O₂]=0.30 M, [I⁻]=0.20 M, rate = 2.4×10⁻⁴ M/s. → ratio 2/2 = 2, n = 1. k = (1.2×10⁻⁴) / (0.30·0.10) = 4.0×10⁻³ M⁻¹·s⁻¹.",
      },
    ],
    errors: [
      {
        source: "Leaks in the gas-collection apparatus",
        effect: "Some O₂ escapes — measured V too low → measured rate and k too LOW.",
        direction: "low",
      },
      {
        source: "Reading the gas-burette meniscus from the wrong angle",
        effect: "Random; usually parallax → either direction.",
        direction: "either",
      },
      {
        source: "Ignoring vapor pressure of water above the displaced water column",
        effect: "P_O₂ = P_atm − P_H₂O. If you use P_atm directly, n is over-estimated → rate too HIGH.",
        direction: "high",
      },
      {
        source: "Including non-linear (late) data in the slope",
        effect:
          "Slope underestimates initial rate (rate falls as H₂O₂ depletes) → rate, k both LOW.",
        direction: "low",
      },
      {
        source: "Temperature drift between trials",
        effect: "k is T-dependent (Arrhenius). Higher T → larger k; biases comparison between trials.",
        direction: "either",
      },
      {
        source: "Mixing error / late stopwatch start",
        effect: "Misses the fastest part of the curve → rate appears LOW.",
        direction: "low",
      },
    ],
    whyQA: [
      {
        q: "Was it necessary to use exactly the suggested volume of H₂O₂?",
        a: "No — only the CONCENTRATION matters for the rate law. As long as you know the actual concentration in the reaction flask, the volume can vary. What you can NOT change between two trials being compared is the variable you are holding constant.",
      },
      {
        q: "Why does adding more KI make the reaction faster even though KI is a catalyst?",
        a: "Catalysts appear in the rate law because they are part of the rate-determining step. Increasing [I⁻] increases collision frequency in the slow step, but I⁻ is regenerated — it is not consumed in the net reaction.",
      },
      {
        q: "Could you do this experiment without a catalyst?",
        a: "In principle yes, but uncatalyzed H₂O₂ decomposition is far too slow at room T to measure on a 5-minute timescale, so KI is needed for usable kinetic data.",
      },
      {
        q: "Why must you use the same temperature for all trials?",
        a: "k depends on T (Arrhenius: k = A·exp(−Ea/RT)). If T differs between trials, the rate ratio you compute reflects both concentration and temperature changes, and m, n become unreliable.",
      },
      {
        q: "If you forgot to subtract the vapor pressure of water, how does k change?",
        a: "P_O₂ would be overestimated → n_O₂ overestimated → rate too high → k too HIGH.",
      },
      {
        q: "What happens to the rate constant k if the reaction is half-completed but [I⁻] is still at its initial value?",
        a: "k is a constant at fixed T regardless of how far the reaction has progressed; what changes is the RATE because [H₂O₂] has dropped. That is why the slope flattens with time.",
      },
      {
        q: "Why does the moles-vs-time plot eventually curve?",
        a: "[H₂O₂] is being depleted; the rate falls as r = k[H₂O₂]^m[I⁻]^n decreases. Only the early, linear portion measures the initial rate.",
      },
    ],
    practice: [
      {
        q: "Three initial-rate trials are run at 25 °C:\nTrial 1: [H₂O₂]=0.10 M, [I⁻]=0.10 M, rate = 2.0×10⁻⁵ M/s\nTrial 2: [H₂O₂]=0.20 M, [I⁻]=0.10 M, rate = 4.1×10⁻⁵ M/s\nTrial 3: [H₂O₂]=0.10 M, [I⁻]=0.30 M, rate = 6.0×10⁻⁵ M/s\nDetermine m, n, the rate law, and k.",
        solution:
          "1→2: doubling [H₂O₂] doubles rate → m = 1.\n1→3: tripling [I⁻] triples rate → n = 1.\nRate law: rate = k[H₂O₂][I⁻].\nk = (2.0×10⁻⁵)/((0.10)(0.10)) = 2.0×10⁻³ M⁻¹·s⁻¹.",
      },
      {
        q: "If your gas-burette had a slow leak, would your reported value of k be too high or too low? Explain.",
        solution:
          "Too LOW. Leaks lose O₂, so the measured V (and therefore d(n_O₂)/dt = the rate) is smaller than reality. Since k = rate/[H₂O₂]^m[I⁻]^n, a smaller rate gives a smaller k.",
      },
      {
        q: "You measure 5.30 mL of O₂ over the first 30 s at 22 °C and 0.985 atm. The reaction-mixture volume is 25.0 mL. What is the rate of O₂ production in M/s?",
        solution:
          "n_O₂ = PV/RT = (0.985)(0.00530)/(0.0821·295) = 2.16×10⁻⁴ mol over 30 s.\nd(n_O₂)/dt = 7.2×10⁻⁶ mol/s.\nrate = (7.2×10⁻⁶)/(0.0250 L) = 2.9×10⁻⁴ M/s.",
      },
    ],
  },
  {
    id: "exp2",
    num: 2,
    title: "Kinetics II — Spectrophotometric, FD&C Blue #1 + Bleach",
    short: "Kinetics II",
    oneLiner:
      "Use Beer's Law and absorbance vs. time to extract the order in dye, the rate constant, and how rate depends on bleach concentration.",
    learningObjectives: [
      "State and apply Beer's Law: A = ε·b·c.",
      "Recognize that, when [bleach] >> [dye], the reaction is pseudo-nth order in dye.",
      "Distinguish 0th, 1st, and 2nd order kinetics by which plot of [A]-data is LINEAR vs. time.",
      "Extract k_obs from the integrated rate-law plot's slope; relate k_obs to the true rate constant.",
      "Understand that a spectrophotometer measures the dye, not the bleach — so we follow the species that absorbs.",
    ],
    experimentalObjectives: [
      "Calibrate the spectrometer with a reference cuvette (DI water) at the dye's λ_max.",
      "Mix dilute FD&C Blue #1 with NaOCl bleach and record absorbance every few seconds.",
      "Plot A, ln(A), and 1/A vs. t to identify the order in dye.",
      "From the slope of the linear plot, get k_obs (units depend on order).",
      "Repeat at a different [bleach] to confirm pseudo-order behavior and find order in bleach.",
    ],
    theory: [
      {
        heading: "Beer's Law",
        equations: ["A = ε · b · c"],
        body:
          "Absorbance A is directly proportional to dye concentration c when ε (molar absorptivity) and b (path length, ~1 cm) are constant. So A ∝ [dye]: you can substitute A everywhere [dye] would appear in the rate law.",
      },
      {
        heading: "Pseudo-nth order via large excess",
        body:
          "If [bleach]₀ >> [dye]₀, [bleach] is essentially constant. Then rate = k[dye]^m[bleach]^n collapses to rate = k_obs · [dye]^m, where k_obs = k · [bleach]^n.",
      },
      {
        heading: "Integrated rate laws (test plots)",
        equations: [
          "0th order: [A] = [A]₀ − k_obs·t        (A vs. t is linear)",
          "1st order: ln[A] = ln[A]₀ − k_obs·t   (ln A vs. t is linear)",
          "2nd order: 1/[A] = 1/[A]₀ + k_obs·t   (1/A vs. t is linear)",
        ],
        body:
          "Whichever plot is straight identifies the order in dye. The slope = ±k_obs (sign depends on which plot).",
      },
      {
        heading: "Order in bleach from k_obs",
        body:
          "Run the same experiment at two [bleach]: ratio k_obs,2 / k_obs,1 = ([bleach]₂/[bleach]₁)^n. Solve for n by taking logs.",
      },
      {
        heading: "Half-life (1st order)",
        equations: ["t₁/₂ = ln 2 / k_obs ≈ 0.693 / k_obs"],
        body:
          "For 1st order, t₁/₂ is independent of [A]₀ — a useful fingerprint of 1st-order behavior.",
      },
    ],
    procedure: [
      "Warm up the Vernier spectrometer for ~10 min and calibrate against a DI-water reference cuvette.",
      "Set wavelength to λ_max of the dye (~630 nm for FD&C Blue #1).",
      "Add a known volume of dye solution to the cuvette, blank or zero, then quickly add bleach, mix, place in spectrometer, and start data collection.",
      "Collect A(t) until A is small/constant.",
      "Repeat at a second [bleach] (e.g., half the original) to extract n.",
    ],
    procedureWhy: [
      {
        step: "Why blank with DI water (or solvent), not air?",
        why:
          "Beer's Law assumes you measure the absorbance of the SOLUTE only. The blank corrects for solvent absorbance and reflections at cuvette walls.",
      },
      {
        step: "Why use a HUGE excess of bleach?",
        why:
          "It pins [bleach] ≈ constant, collapsing the rate law to an effective single-variable problem (pseudo-mth-order in dye). Without excess, [bleach] would drop measurably and A vs. t would not match a clean integrated-law shape.",
      },
      {
        step: "Why is exact volume of dye not critical?",
        why:
          "Beer's Law gives you [dye] directly through A; absolute volumes only matter for keeping [bleach] in large excess. The kinetic order is in concentrations, not in absolute amounts.",
      },
      {
        step: "Why select λ_max?",
        why:
          "Maximum sensitivity (largest ε) → smallest fractional error in A. Also flat near the peak so small wavelength drift has minimal effect.",
      },
      {
        step: "Why wipe the cuvette and orient it correctly?",
        why:
          "Fingerprints/scratches scatter light; wrong orientation changes b. Both shift A non-uniformly and ruin the linearity expected by Beer's Law.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Identify order by which plot is linear",
        body:
          "Plot A vs. t, ln A vs. t, and 1/A vs. t. The plot with the highest R² (visually straight line) identifies the order in dye.",
      },
      {
        heading: "Extract k_obs from the slope",
        body:
          "1st order (most common with these dyes): slope of ln A vs. t = −k_obs (so k_obs is positive). Units of k_obs: 1/s for 1st order, M/s for 0th, M⁻¹·s⁻¹ for 2nd.",
      },
      {
        heading: "Find order n in bleach",
        equations: ["n = log(k_obs,2 / k_obs,1) / log([bleach]₂ / [bleach]₁)"],
      },
      {
        heading: "True k from k_obs",
        equations: ["k_true = k_obs / [bleach]^n"],
      },
      {
        heading: "Worked example",
        body:
          "ln A vs. t is linear with slope −0.0185 s⁻¹ at [bleach]₀ = 0.10 M. Repeat at [bleach]₀ = 0.20 M gives slope −0.037 s⁻¹. Then k_obs ratio = 2.0 = (2.0)^n → n = 1. So m = 1 (assumed by the linear ln A plot), n = 1, rate = k[dye][bleach], and k = 0.0185/0.10 = 0.185 M⁻¹·s⁻¹.",
      },
    ],
    errors: [
      {
        source: "Failing to blank the spectrometer",
        effect: "Adds a constant offset to A → ln A shifts but its slope is unchanged for 1st order; still 0th and 2nd plots become biased.",
        direction: "neutral",
      },
      {
        source: "Cuvette fingerprints / scratched window",
        effect: "Stray scatter inflates A at all times → 1/A and ln A baselines shift; slope error.",
        direction: "either",
      },
      {
        source: "Including data after the dye is nearly gone",
        effect: "Noise dominates A; ln A and 1/A blow up, distorting slope.",
        direction: "either",
      },
      {
        source: "[Bleach] not in large enough excess",
        effect: "Pseudo-order assumption fails; ln A vs. t is no longer linear → wrong order assigned.",
        direction: "either",
      },
      {
        source: "Slow mixing / late start of data collection",
        effect: "Misses the highest-concentration portion → estimated k_obs too LOW.",
        direction: "low",
      },
      {
        source: "Drift in lamp intensity / temperature change of solution",
        effect: "Apparent A drift; small effect on 1st order slope but corrupts comparison runs.",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Why can we use absorbance in place of [dye] in the rate law?",
        a: "Beer's Law gives A = ε·b·c, so A ∝ c. Any rate-law expression in c can be written in A by dividing each term by ε·b — the constant cancels in slope-based analysis.",
      },
      {
        q: "Why is the experiment set up to be pseudo-mth order in dye?",
        a: "Following the dye is easy (it absorbs at a sharp λ_max); following bleach is not. Putting bleach in huge excess keeps it nearly constant, so the dye's disappearance follows a clean integrated rate law.",
      },
      {
        q: "Was it necessary to know the EXACT initial concentration of dye?",
        a: "For finding the order m and k_obs from the slope of ln A vs. t — no. For extracting the true k from k_obs and translating to absolute concentrations — yes (you need ε to translate A → c).",
      },
      {
        q: "Could we run this experiment at λ that is NOT λ_max?",
        a: "Yes, but ε is smaller off-peak, meaning less sensitivity and worse signal-to-noise. The order and k_obs would still be the same — Beer's Law still holds — just noisier.",
      },
      {
        q: "If you forgot to blank, would your reported order in dye be wrong?",
        a: "For 1st order specifically, no — d(ln A)/dt is unaffected by an additive offset on A only if the offset is small relative to A. For 0th- or 2nd-order plots, an unblanked offset distorts the slope.",
      },
      {
        q: "Why does t₁/₂ being constant prove 1st order?",
        a: "Only 1st-order half-life is independent of [A]₀: t₁/₂ = 0.693/k_obs. 0th-order t₁/₂ ∝ [A]₀; 2nd-order t₁/₂ ∝ 1/[A]₀.",
      },
      {
        q: "What does k_obs change with — temperature, [dye], [bleach], or volume?",
        a: "Temperature (Arrhenius) and [bleach]: k_obs = k·[bleach]^n. Not [dye] (its order is in the integrated law) and not the absolute volume.",
      },
    ],
    practice: [
      {
        q: "ln(A) vs. t is linear with slope −0.012 s⁻¹ at [bleach] = 0.50 M. At [bleach] = 1.00 M the slope is −0.048 s⁻¹. Find m, n, the rate law, and k.",
        solution:
          "Linear ln A → m = 1.\nk_obs ratio = 0.048/0.012 = 4.0 = (1.00/0.50)^n = 2^n → n = 2.\nrate = k[dye][bleach]².\nk = k_obs/[bleach]² = 0.012/(0.50)² = 0.048 M⁻²·s⁻¹.",
      },
      {
        q: "Why is it WRONG to plot 1/A vs. t for the 1st-order case and expect a straight line?",
        solution:
          "1/[A] vs. t is the integrated form of 2nd order. For 1st order, [A] decays exponentially, so 1/[A] grows exponentially — concave-up, not linear.",
      },
      {
        q: "If t₁/₂ for the dye is 60 s at [bleach]=0.10 M, what is k_obs and what is the rate when A = 0.40?",
        solution:
          "k_obs = ln 2 / t₁/₂ = 0.693/60 = 0.0116 s⁻¹.\nrate (in absorbance units) = k_obs · A = 0.0116 · 0.40 = 4.6×10⁻³ A/s (i.e. d|ΔA|/dt at A = 0.40).",
      },
    ],
  },
  {
    id: "exp3",
    num: 3,
    title: "Equilibrium I — Le Chatelier's Principle",
    short: "Equilibrium (LCP)",
    oneLiner:
      "Qualitatively perturb several equilibria (concentration, temperature, common-ion) and predict which way the system shifts.",
    learningObjectives: [
      "State Le Chatelier's principle: a system at equilibrium responds to a stress by shifting to partly counteract it.",
      "Predict the direction of shift for changes in [reactant], [product], T, P (gas), and addition of a common ion.",
      "Distinguish endothermic and exothermic reactions by how they respond to T.",
      "Recognize that K depends only on T, while Q changes with concentrations.",
      "Connect shift direction to color/precipitate observations in transition-metal and acid-base systems.",
    ],
    experimentalObjectives: [
      "Observe color/precipitate changes when stresses are applied to several equilibria (e.g., Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺; CoCl₄²⁻ ⇌ Co(H₂O)₆²⁺; Cr₂O₇²⁻/CrO₄²⁻; saturated NaCl with HCl).",
      "Record qualitative shift direction for each stress.",
      "Connect each observation to Q vs. K and to ΔH (endo vs. exo).",
    ],
    theory: [
      {
        heading: "Reaction quotient and direction of shift",
        equations: [
          "Q = [products]^… / [reactants]^…",
          "Q < K → shifts forward (toward products)",
          "Q > K → shifts backward (toward reactants)",
          "Q = K → no shift (at equilibrium)",
        ],
      },
      {
        heading: "Concentration stress",
        body:
          "Add reactant → Q decreases → shift forward. Add product → Q increases → shift backward. Remove a species (e.g., precipitate it out, or complex it) → opposite of adding it.",
      },
      {
        heading: "Common-ion effect",
        body:
          "Adding a salt that supplies a product ion is the same as adding product → shift backward / decrease solubility of a slightly soluble salt. Used in NaCl(s) + HCl(aq, conc) which precipitates more NaCl.",
      },
      {
        heading: "Temperature",
        body:
          "Treat heat as a reactant (endothermic) or product (exothermic). Heating an endothermic reaction (heat is a reactant) shifts forward; heating an exothermic reaction (heat is a product) shifts backward. T is the ONLY stress that changes K itself.",
      },
      {
        heading: "Pressure (for gases)",
        body:
          "Compressing a gas equilibrium shifts toward the side with FEWER moles of gas. Adding inert gas at constant V does not shift it (partial pressures unchanged).",
      },
      {
        heading: "Catalyst",
        body:
          "Speeds attainment of equilibrium but does NOT shift the position — both forward and reverse rates increase equally.",
      },
    ],
    procedure: [
      "Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ (red): add more Fe(NO₃)₃ → deeper red; add more KSCN → deeper red; add Na₂HPO₄ (which complexes Fe³⁺) → fades.",
      "CoCl₄²⁻ (blue) + 6 H₂O ⇌ Co(H₂O)₆²⁺ (pink) + 4 Cl⁻: heat → blue (endothermic forward to blue); cool → pink. Add concentrated HCl → blue (more Cl⁻); add water → pink (dilution favors more particles side, here pink).",
      "2 CrO₄²⁻ (yellow) + 2 H⁺ ⇌ Cr₂O₇²⁻ (orange) + H₂O: add acid → orange; add base → yellow.",
      "Saturated NaCl(aq) ⇌ Na⁺ + Cl⁻; add concentrated HCl → NaCl(s) precipitates (common ion).",
    ],
    procedureWhy: [
      {
        step: "Why use a saturated NaCl solution for the common-ion test?",
        why: "Q already equals K. Any additional Cl⁻ pushes Q above K and forces precipitation — proving the common-ion effect dramatically.",
      },
      {
        step: "Why does adding water to CoCl₄²⁻ shift back to pink?",
        why:
          "Water is a reactant in CoCl₄²⁻ + 6H₂O ⇌ Co(H₂O)₆²⁺ + 4Cl⁻. Adding water raises [reactant] and dilutes Cl⁻, both pushing the reaction forward (toward pink).",
      },
      {
        step: "Why does adding Na₂HPO₄ fade the red FeSCN²⁺ color?",
        why:
          "HPO₄²⁻ binds Fe³⁺ (forming colorless complexes), removing free Fe³⁺ — Q drops (less product because Fe³⁺ removed from product side conceptually, or reactant Fe³⁺ removed making forward reaction unable to proceed). Net effect: FeSCN²⁺ dissociates → red fades.",
      },
      {
        step: "Why is temperature the only stress that changes K?",
        why:
          "K is the ratio of forward to reverse rate constants k_f/k_r, both of which obey Arrhenius. Their RATIO depends on ΔH — only T changes that ratio. All other stresses move Q, not K.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Qualitative analysis",
        body:
          "There is no quantitative calculation here; you record observations (color before/after, precipitate yes/no) and interpret each as a forward or backward shift, then justify with LCP and Q vs. K.",
      },
      {
        heading: "Sign of ΔH from T behavior",
        body:
          "If heating shifts forward → reaction is endothermic (ΔH > 0). If heating shifts backward → exothermic (ΔH < 0). The CoCl₄²⁻/Co(H₂O)₆²⁺ test is a classic example: heat → blue means forward (toward CoCl₄²⁻) is endothermic.",
      },
    ],
    errors: [
      {
        source: "Adding too much reagent at once",
        effect: "Drives the equilibrium so far that the reverse experiment is hard to see; not a quantitative error but obscures the trend.",
        direction: "neutral",
      },
      {
        source: "Contaminated test tubes / leftover acid or base",
        effect:
          "Especially in the Cr₂O₇²⁻/CrO₄²⁻ test, residual base or acid biases the apparent shift.",
        direction: "either",
      },
      {
        source: "Not letting the system re-equilibrate before observation",
        effect: "Color may still be in transition; misreporting the final state.",
        direction: "either",
      },
      {
        source: "Heating too aggressively",
        effect: "Solvent evaporation concentrates ions, mimicking a concentration stress alongside the T stress.",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Adding inert solid or gas to the system: does it shift?",
        a: "Inert solid: no, it does not appear in Q. Inert gas at constant V: no, partial pressures of reactants/products are unchanged. Inert gas at constant P (so V increases): yes — this dilutes partial pressures and shifts toward the side with MORE moles of gas.",
      },
      {
        q: "Why doesn't a catalyst change the position of equilibrium?",
        a: "Catalysts lower Ea for both forward and reverse reactions equally → both k_f and k_r increase by the same factor → K = k_f/k_r unchanged.",
      },
      {
        q: "If you double both [Fe³⁺] and [SCN⁻] simultaneously, how does Q change relative to K?",
        a: "Q = [FeSCN²⁺] / ([Fe³⁺][SCN⁻]). Doubling each reactant on the bottom multiplies the denominator by 4 → Q drops to ¼ of its previous value (Q = ¼·K_old). Since Q < K → shifts FORWARD (more red FeSCN²⁺) until Q = K again.",
      },
      {
        q: "Why does adding HCl to the dichromate/chromate equilibrium turn it orange?",
        a: "H⁺ is a reactant for the formation of Cr₂O₇²⁻. Adding it pushes the equilibrium toward dichromate (orange).",
      },
      {
        q: "Could you tell the sign of ΔH from a concentration stress?",
        a: "No — only temperature changes K. Concentration stresses change Q toward K but leave K (and thus ΔH information) untouched.",
      },
      {
        q: "Why does precipitating one ion remove it from the equilibrium?",
        a: "Precipitation removes the ion from solution (now in the solid phase). Solids do not appear in Q, so this is identical to physically removing the species — Q drops, equilibrium shifts to replace it.",
      },
    ],
    practice: [
      {
        q: "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH < 0. Predict the shift for: (a) increase T, (b) increase P (compress), (c) add He at constant V, (d) remove NH₃.",
        solution:
          "(a) Exothermic forward → adding heat shifts BACKWARD (less NH₃).\n(b) 4 mol gas → 2 mol gas: compression favors the side with fewer moles → FORWARD.\n(c) He inert at constant V → no shift.\n(d) Remove product → Q decreases → FORWARD.",
      },
      {
        q: "When AgCl(s) is in equilibrium with its ions in solution, you add NaCl(s). Solubility?",
        solution:
          "Common-ion effect: extra Cl⁻ raises Q above Ksp → AgCl precipitates → solubility of AgCl DECREASES.",
      },
      {
        q: "You heat the FeSCN²⁺ solution and the red color fades. What does this tell you about ΔH?",
        solution:
          "Heat shifts the equilibrium AWAY from FeSCN²⁺ (red), so the forward reaction (to product) is exothermic → ΔH < 0 for Fe³⁺ + SCN⁻ → FeSCN²⁺.",
      },
    ],
  },
  {
    id: "exp4",
    num: 4,
    title: "Equilibrium II — Spectrophotometric K_In of Bromothymol Blue",
    short: "K_In (BTB)",
    oneLiner:
      "Use buffers and Beer's Law to determine the acid-dissociation constant K_In of bromothymol blue indicator.",
    learningObjectives: [
      "Write the K_In expression for an indicator: HIn ⇌ H⁺ + In⁻.",
      "Use phosphate buffers to fix [H⁺] (or pH) at known values across the indicator's transition range.",
      "Apply Beer's Law and absorbance at two wavelengths (λ_HIn yellow ~430 nm; λ_In⁻ blue ~615 nm) to find [HIn] and [In⁻] in any buffer.",
      "Use the linearized form to extract pK_In as the pH where [HIn] = [In⁻] (A_HIn = A_In⁻ in matched conditions).",
      "Connect to Henderson-Hasselbalch.",
    ],
    experimentalObjectives: [
      "Prepare phosphate buffers across pH 6-8 (the BTB transition range).",
      "Add the same amount of BTB to each, and measure A at the two indicator wavelengths.",
      "Solve for [HIn]/[In⁻] in each buffer; plot log([In⁻]/[HIn]) vs. pH.",
      "Slope = 1, y-intercept = −pK_In; or read pK_In as the pH where the two species' absorbances are equal.",
    ],
    theory: [
      {
        heading: "Indicator equilibrium",
        equations: [
          "HIn(yellow) ⇌ H⁺ + In⁻(blue)",
          "K_In = [H⁺][In⁻]/[HIn]",
          "pK_In = pH + log([HIn]/[In⁻]) = pH − log([In⁻]/[HIn])",
        ],
      },
      {
        heading: "Henderson-Hasselbalch reformulation",
        equations: [
          "pH = pK_In + log([In⁻]/[HIn])",
        ],
        body:
          "When [In⁻] = [HIn], the log term is 0 and pH = pK_In — that pH is where the indicator color is the midpoint between yellow and blue (green).",
      },
      {
        heading: "Beer's Law at two wavelengths",
        body:
          "At λ_HIn (~430 nm) HIn absorbs strongly, In⁻ does not (or barely). At λ_In⁻ (~615 nm) In⁻ absorbs strongly, HIn does not. So A(430) ∝ [HIn], A(615) ∝ [In⁻].",
        equations: [
          "A_HIn = ε_HIn · b · [HIn]",
          "A_In⁻ = ε_In⁻ · b · [In⁻]",
        ],
      },
      {
        heading: "Reference standards",
        body:
          "To get ε_HIn, measure A in strongly acidic buffer (essentially all HIn). To get ε_In⁻, measure A in strongly basic buffer (essentially all In⁻).",
      },
    ],
    procedure: [
      "Prepare ~5 phosphate buffers spanning pH 6.0 to 8.0 in roughly 0.5 increments using the Henderson-Hasselbalch design (NaH₂PO₄/Na₂HPO₄).",
      "Make a strongly acidic buffer (pH ~3) and a strongly basic buffer (pH ~10) for the pure-form references.",
      "Add the SAME volume/concentration of BTB stock to each.",
      "Measure A at λ_HIn (~430 nm) and λ_In⁻ (~615 nm) in every buffer using the same cuvette/blank protocol.",
      "Record exact pH of each buffer with a calibrated pH meter.",
    ],
    procedureWhy: [
      {
        step: "Why use phosphate buffers — why not just dilute HCl or NaOH?",
        why:
          "A buffer holds pH constant even when a tiny amount of HIn dissociates (which generates H⁺). In an unbuffered solution, the indicator's own equilibrium would shift the pH and you'd be measuring a moving target.",
      },
      {
        step: "Why is the indicator concentration the same in every buffer?",
        why:
          "Total [In] = [HIn] + [In⁻] is held fixed. Then any change in A across buffers comes from the SHIFT between the two forms — i.e., the equilibrium response to pH — and not from changing total dye.",
      },
      {
        step: "Why measure at TWO wavelengths?",
        why:
          "You have two unknowns ([HIn] and [In⁻]) so you need two independent absorbance readings. Choosing wavelengths where each form dominates simplifies the math because cross-absorption is small.",
      },
      {
        step: "Why measure in strongly acidic and strongly basic buffers?",
        why:
          "Those define the 100% HIn (pure yellow) and 100% In⁻ (pure blue) endpoints, giving you ε_HIn and ε_In⁻. Without these you cannot scale partial absorbances to concentrations.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Compute [HIn] and [In⁻] in each buffer",
        equations: [
          "[HIn] = A(λ_HIn) / (ε_HIn · b)",
          "[In⁻] = A(λ_In⁻) / (ε_In⁻ · b)",
        ],
      },
      {
        heading: "Plot pH vs. log([In⁻]/[HIn])",
        body:
          "By Henderson-Hasselbalch the plot is a straight line with slope +1 and y-intercept = pK_In (when plotted as log vs. pH, intercept on the pH axis at log=0). Use LINEST.",
      },
      {
        heading: "Worked example",
        body:
          "At pH 7.20, A(430)=0.18, A(615)=0.55 with ε_HIn=2.0×10⁴ and ε_In⁻=3.0×10⁴ (b=1 cm). [HIn]=9.0×10⁻⁶ M; [In⁻]=1.83×10⁻⁵ M; ratio=2.04; log=0.31; so pK_In = pH − log([In⁻]/[HIn]) = 7.20 − 0.31 = 6.89.",
      },
    ],
    errors: [
      {
        source: "Buffer pH miscalibrated (pH meter)",
        effect: "All inferred pK_In shifts by the same offset → systematic error.",
        direction: "either",
      },
      {
        source: "Cuvette mismatch / fingerprints",
        effect: "Inflates A at one λ disproportionately → wrong [HIn]/[In⁻] ratio → wrong pK_In.",
        direction: "either",
      },
      {
        source: "Indicator concentration not constant across buffers",
        effect: "Changes total [In] — A's no longer reflect only the pH shift; ratio reading is biased.",
        direction: "either",
      },
      {
        source: "Cross-absorption (HIn absorbing at λ_In⁻ or vice versa)",
        effect: "Overestimates the minority species; typically pulls the apparent pK_In toward the middle of the data range.",
        direction: "either",
      },
      {
        source: "Diluting buffers with the indicator stock without correcting [In]",
        effect: "Total [In] drops slightly; ratio is still OK but absorbances are smaller (more noise).",
        direction: "neutral",
      },
    ],
    whyQA: [
      {
        q: "Why is pK_In the pH at which the indicator changes color?",
        a: "At pH = pK_In, [HIn] = [In⁻]. Color is a 50/50 mix → eye perceives the transition (green for BTB). Below pK_In: HIn dominates (yellow). Above: In⁻ dominates (blue).",
      },
      {
        q: "Could we determine pK_In with a single buffer?",
        a: "No, that gives one pH/ratio data point — you cannot tell the shape of the line. You need a series across pK_In ± ~1 to fit the curve and see the transition.",
      },
      {
        q: "Was it necessary that buffers be EXACTLY at the predicted pH?",
        a: "No — just measure each pH accurately with a calibrated meter and use that. Henderson-Hasselbalch design is to land you within the indicator's transition range; the exact value used in analysis is the measured pH.",
      },
      {
        q: "Why use a long path-length cuvette? Or why doesn't path length matter for the ratio?",
        a: "Both A's scale with b. The RATIO [In⁻]/[HIn] = (A_In⁻/ε_In⁻)/(A_HIn/ε_HIn) — b cancels. Only ε's matter, and those come from the reference buffers.",
      },
      {
        q: "If you used acetate buffer at pH 5 instead of phosphate at pH 7 — would it work?",
        a: "Not for BTB (transition pH ~6-8). The buffer must span the indicator's transition range, otherwise you only see one form.",
      },
      {
        q: "Why must the strong-acid reference buffer have pH << pK_In?",
        a: "Otherwise some In⁻ remains, and you'd be measuring an effective ε that is too small (some HIn missing). Pushing pH at least 2 units below pK_In ensures >99% HIn.",
      },
    ],
    practice: [
      {
        q: "BTB in pH 7.50 buffer gives A_HIn = 0.10, A_In⁻ = 0.60. From reference runs, ε_HIn = 2.0×10⁴ and ε_In⁻ = 3.0×10⁴ M⁻¹cm⁻¹ (1-cm cuvette). Find pK_In.",
        solution:
          "[HIn] = 0.10/2.0×10⁴ = 5.0×10⁻⁶ M; [In⁻] = 0.60/3.0×10⁴ = 2.0×10⁻⁵ M.\nlog([In⁻]/[HIn]) = log(4.0) = 0.60.\npK_In = 7.50 − 0.60 = 6.90.",
      },
      {
        q: "What absorbance ratio would you measure at pH = pK_In, assuming the same ε's as above?",
        solution:
          "[HIn] = [In⁻]. So A_HIn/A_In⁻ = ε_HIn/ε_In⁻ = 2.0×10⁴/3.0×10⁴ = 2/3 ≈ 0.67.",
      },
      {
        q: "If your strong-acid 'pure HIn' buffer was actually pH 4.5 instead of pH 2, what error did you introduce?",
        solution:
          "Some In⁻ still present → measured A < pure-HIn A → ε_HIn underestimated → all subsequent [HIn] overestimated → ratio [In⁻]/[HIn] too small → pK_In reported too HIGH.",
      },
    ],
  },
  {
    id: "exp5",
    num: 5,
    title: "Acid-Base Equilibrium — Buffer Capacity & Henderson-Hasselbalch",
    short: "Buffers",
    oneLiner:
      "Prepare an acetic acid / acetate buffer two ways and probe its capacity by titration with strong acid/base.",
    learningObjectives: [
      "Define a buffer; explain why it resists pH change.",
      "Use Henderson-Hasselbalch (pH = pKa + log [A⁻]/[HA]) to design buffers.",
      "Describe two ways to make a buffer: (i) mix weak acid + conjugate base directly; (ii) partially neutralize a weak acid with strong base (or vice versa).",
      "Define buffer capacity and identify the conditions that maximize it (pH ≈ pKa; high [HA] + [A⁻]).",
      "Calculate pH after small additions of strong acid or base via stoichiometry then HH.",
    ],
    experimentalObjectives: [
      "Prepare a CH₃COOH / CH₃COONa buffer to a target pH (~4.74 ± something) using both methods.",
      "Verify pH with a calibrated pH meter.",
      "Add increments of strong acid (HCl) and strong base (NaOH) and record pH after each addition.",
      "Compare the buffer's pH-vs-mL curve to that of unbuffered water.",
    ],
    theory: [
      {
        heading: "What is a buffer?",
        body:
          "A solution containing comparable amounts of a weak acid (HA) and its conjugate base (A⁻). HA neutralizes added strong base; A⁻ neutralizes added strong acid. Both consumption reactions essentially go to completion, so pH changes little.",
      },
      {
        heading: "Henderson-Hasselbalch",
        equations: [
          "Ka = [H⁺][A⁻]/[HA]",
          "pH = pKa + log([A⁻]/[HA])",
        ],
        body:
          "Maximally effective when [A⁻] ≈ [HA] (ratio near 1 → log term near 0 → pH ≈ pKa). The 'useful range' is pKa ± 1.",
      },
      {
        heading: "Two ways to make a buffer",
        bullets: [
          "Method 1: Mix HA and A⁻ salt directly. Use HH to compute the ratio that gives target pH.",
          "Method 2: Partial neutralization. Start from HA only and add (target ratio) moles of strong base; the reaction HA + OH⁻ → A⁻ + H₂O converts some HA into A⁻.",
        ],
      },
      {
        heading: "Adding strong acid or base — the two-step approach",
        bullets: [
          "Stoichiometry first: H⁺ added consumes A⁻ → HA. OH⁻ added consumes HA → A⁻. Update mole counts.",
          "Then plug new mole ratio into HH to get new pH.",
          "If volumes change appreciably, technically you should use concentrations — but the LOG of the ratio means [A⁻]/[HA] has the same value if you use moles instead, since the volume cancels.",
        ],
      },
      {
        heading: "Buffer capacity",
        body:
          "Quantitatively how many moles of strong acid/base the buffer can absorb before pH changes by, say, 1 unit. Capacity scales with TOTAL [HA]+[A⁻]; equimolar mixtures (ratio = 1) are most resistant.",
      },
    ],
    procedure: [
      "Method 1 — direct: weigh CH₃COONa·3H₂O, dissolve in DI water, add measured volume of glacial CH₃COOH or stock acetic acid, dilute to volume with DI water in a volumetric flask.",
      "Method 2 — partial neutralization: dissolve known moles of CH₃COOH, then add the calculated moles of NaOH (e.g., from a standardized stock) — half-neutralization gives 1:1 HA:A⁻.",
      "Calibrate pH meter with pH 4 and pH 7 buffers; rinse electrode between solutions.",
      "Measure starting pH of each buffer.",
      "Titrate one aliquot of buffer with HCl in small increments, recording pH after each addition; titrate another aliquot with NaOH the same way.",
      "Repeat the same titration on equal-volume DI water as control.",
    ],
    procedureWhy: [
      {
        step: "Why are TWO preparation methods compared?",
        why:
          "To show they give the same pH. Both rely on the same Henderson-Hasselbalch equilibrium — once moles of HA and A⁻ are present in the same flask, the system has 'forgotten' how it got there.",
      },
      {
        step: "Why does the volume not need to be measured exactly when using HH on a buffer?",
        why:
          "HH depends on the RATIO [A⁻]/[HA]. As long as both are in the same solution (same V), V cancels — you can use moles. So pipetting absolute volumes accurately matters less than getting the relative amounts right.",
      },
      {
        step: "Why is the half-equivalence point pH = pKa?",
        why:
          "At half-equivalence, exactly half of HA has been converted to A⁻, so [A⁻] = [HA] and log term = 0.",
      },
      {
        step: "Why does the buffer 'fail' once you exceed its capacity?",
        why:
          "Once nearly all of one component is consumed, additional strong acid/base has nothing to react with — pH then falls/rises as if no buffer were present.",
      },
      {
        step: "Why must you calibrate the pH meter every session?",
        why:
          "Glass electrodes drift over hours/days; calibration at known pH 4 / 7 (and pH 10 for basic systems) corrects the drift to ±0.02 pH units.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Predicting the buffer's starting pH",
        body:
          "From the moles of HA and A⁻ used, compute pH = pKa + log(mol A⁻/mol HA). pKa for acetic acid = 4.74.",
      },
      {
        heading: "Predicting pH after adding x mol HCl (or NaOH)",
        bullets: [
          "Stoichiometry: A⁻ + H⁺ → HA (or HA + OH⁻ → A⁻). Subtract x from one component, add x to the other.",
          "Plug into HH using NEW moles.",
          "Compare to measured pH; agreement validates HH.",
        ],
      },
      {
        heading: "Buffer capacity from titration data",
        body:
          "Plot pH vs. mol acid (or base) added. Capacity is quantified as the slope's magnitude: shallower slope = higher capacity. The curve plateau ends near the equivalence point of the strong-acid/base-vs-buffer-component reaction.",
      },
    ],
    errors: [
      {
        source: "pH meter not calibrated or contaminated electrode",
        effect: "All pH readings biased; conclusions about pKa or buffer behavior off by the offset.",
        direction: "either",
      },
      {
        source: "Using NaOH that has absorbed CO₂ (carbonate contamination)",
        effect: "Effective [NaOH] less than labeled → method-2 buffer slightly under-neutralized → pH a bit LOW; titration with NaOH delivers fewer moles per mL than expected.",
        direction: "low",
      },
      {
        source: "Stock acetic acid evaporation",
        effect: "Concentration drifts higher than label → wrong moles HA → buffer pH below target.",
        direction: "low",
      },
      {
        source: "Adding too much strong acid/base too fast",
        effect: "Local pH excursions damage the electrode reading; not a permanent error if mixed.",
        direction: "either",
      },
      {
        source: "Volumetric flask not at room T",
        effect: "Volume off by ~0.04% per °C — usually negligible compared to other errors.",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Why doesn't the pH change much when a small amount of HCl is added to a buffer?",
        a: "A⁻ neutralizes added H⁺: A⁻ + H⁺ → HA. The ratio [A⁻]/[HA] only changes a little, so log of the ratio (and pH) only changes a little.",
      },
      {
        q: "If you doubled the total concentration of buffer (same ratio), how does pH change?",
        a: "It does NOT — pH depends only on the ratio. But the buffer's CAPACITY doubles.",
      },
      {
        q: "Was it necessary to weigh the sodium acetate to ±0.001 g?",
        a: "Not super-strictly — pH depends on log of the ratio. ±5% in either component shifts pH by only log(1.05) ≈ 0.02 unit. Still, gross errors matter, and you want to know the actual moles.",
      },
      {
        q: "Why is acetate a good buffer at pH 5 but not at pH 8?",
        a: "Useful range is pKa ± 1 = 3.74-5.74. At pH 8, [A⁻]/[HA] = 10^3.26 ≈ 1800 — almost all conjugate base, almost no HA, so adding strong acid would crash the pH.",
      },
      {
        q: "Method 1 vs. Method 2 — should they give the same pH?",
        a: "Yes, if the moles HA and A⁻ are the same in the final solution. The history of the solution doesn't matter — equilibrium state does.",
      },
      {
        q: "Why does adding water to a buffer NOT change its pH appreciably?",
        a: "Diluting both HA and A⁻ by the same factor leaves the ratio unchanged. Only buffer CAPACITY decreases.",
      },
    ],
    practice: [
      {
        q: "Make 100 mL of acetic-acid/acetate buffer at pH 5.00. pKa(HOAc) = 4.74. Total [buffer] = 0.40 M.",
        solution:
          "5.00 = 4.74 + log([A⁻]/[HA]) → log = 0.26 → ratio = 1.82.\n[HA] + [A⁻] = 0.40 M → [HA](1+1.82) = 0.40 → [HA] = 0.142 M, [A⁻] = 0.258 M.\nMoles in 100 mL: HA 0.0142 mol; A⁻ 0.0258 mol.\nWeigh 0.0258 mol NaOAc·3H₂O (FW 136.08) = 3.51 g; pipet enough acetic acid to give 0.0142 mol; dilute to 100 mL.",
      },
      {
        q: "To 50.0 mL of a buffer with 0.020 mol HOAc and 0.020 mol OAc⁻, you add 0.0050 mol HCl. New pH?",
        solution:
          "Stoich: OAc⁻ + H⁺ → HOAc. New moles: HA = 0.025, A⁻ = 0.015.\npH = 4.74 + log(0.015/0.025) = 4.74 + log(0.60) = 4.74 − 0.22 = 4.52.",
      },
      {
        q: "Why is buffer capacity maximum at pH = pKa?",
        solution:
          "Symmetric: [A⁻] = [HA]. Adding either H⁺ or OH⁻ shifts the ratio least (in log terms) when starting from 1:1, because log((1+ε)/(1−ε)) is minimized near ε = 0.",
      },
    ],
  },
  {
    id: "exp6",
    num: 6,
    title: "Aqueous Equilibria — Potentiometric Titration of HOAc & H₃PO₄",
    short: "Potentiometric Titration",
    oneLiner:
      "Titrate a weak monoprotic acid (acetic) and a weak triprotic acid (phosphoric) with NaOH while tracking pH; extract pKa(s) and concentrations from the curve.",
    learningObjectives: [
      "Identify the equivalence point on a pH-vs-V curve from the steepest-slope inflection (max of dpH/dV).",
      "Identify the half-equivalence point and recognize pH(½eq) = pKa.",
      "Recognize that a polyprotic acid shows multiple inflections — one per dissociable proton.",
      "Compute concentration from moles NaOH at the equivalence point.",
      "Sketch the buffer regions on either side of each pKa.",
    ],
    experimentalObjectives: [
      "Calibrate the pH meter; standardize NaOH stock against a primary acid (e.g. KHP) if not already standardized.",
      "Titrate a known volume of acetic acid solution with NaOH, recording pH every 0.5-1.0 mL near the steep region (smaller increments).",
      "Repeat for phosphoric acid; observe two clearly separated equivalence points (the third pKa~12 is hard to see in water).",
      "Determine concentration and pKa(s) from the curves.",
    ],
    theory: [
      {
        heading: "What a titration curve tells you",
        bullets: [
          "Initial pH: depends on Ka and [HA]₀.",
          "Buffer region: roughly flat where [HA] ≈ [A⁻]; pH = pKa here.",
          "Half-equivalence: pH = pKa exactly (the most reliable graphical readout).",
          "Equivalence point: steep jump; mol NaOH added = mol acid initially present (×n for polyprotic).",
          "Past equivalence: excess strong base sets pH.",
        ],
      },
      {
        heading: "First-derivative method",
        body:
          "ΔpH/ΔV peaks at each equivalence point. For polyprotic acids the derivative shows one peak per dissociation step (provided the Ka's are well-separated, by ≥ 10⁴).",
      },
      {
        heading: "Phosphoric acid — three steps",
        equations: [
          "H₃PO₄ ⇌ H⁺ + H₂PO₄⁻   pKa1 ≈ 2.15",
          "H₂PO₄⁻ ⇌ H⁺ + HPO₄²⁻   pKa2 ≈ 7.20",
          "HPO₄²⁻ ⇌ H⁺ + PO₄³⁻    pKa3 ≈ 12.35",
        ],
        body:
          "First two equivalence points are sharp. The third is obscured because pKa3 is so close to that of water.",
      },
      {
        heading: "Concentration from equivalence volume",
        equations: [
          "moles acid = (M_NaOH)(V_eq) for monoprotic",
          "moles HOAc = (M_NaOH)(V_eq); [HOAc]₀ = moles / V_acid_initial",
          "for H₃PO₄ to first eq: moles H₃PO₄ = (M_NaOH)(V_eq1)",
        ],
      },
    ],
    procedure: [
      "Calibrate pH electrode with pH 4, 7, and (for phosphoric titration) pH 10 buffers.",
      "Pipette a known volume of acetic acid into a beaker with a stir bar; immerse electrode and burette tip.",
      "Add NaOH in 1 mL increments; near the equivalence point switch to 0.1-0.2 mL increments.",
      "Record V (to 0.02 mL) and pH (to 0.01) after each stable reading.",
      "Repeat for H₃PO₄; expect two visible equivalence points.",
    ],
    procedureWhy: [
      {
        step: "Why use small (0.1-0.2 mL) increments near the equivalence point?",
        why:
          "The slope is steep there; large volume steps blur the inflection and give a poor first derivative — making V_eq imprecise.",
      },
      {
        step: "Why use larger increments away from the equivalence point?",
        why:
          "pH changes only slowly in the buffer region; fine resolution is wasted there.",
      },
      {
        step: "Why standardize NaOH first?",
        why:
          "NaOH stock concentration drifts (CO₂ absorption forms carbonate; bottle absorbs water). Without exact M_NaOH, your moles-of-acid calculation is off.",
      },
      {
        step: "Why does the pH meter give a more accurate equivalence than an indicator?",
        why:
          "An indicator changes color over ~1 pH unit and may not align with the steep jump exactly. The dpH/dV peak is the true max-slope and pinpoints V_eq to ~0.01 mL.",
      },
      {
        step: "Why does phosphoric acid show only two clear equivalences?",
        why:
          "pKa3 ≈ 12.4 is so close to H₂O's pKa (~14) that the third proton's removal occurs alongside water's autoionization; the curve in plain water doesn't show a distinct third inflection.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Graphical readouts",
        bullets: [
          "Eyeball: V_eq is the midpoint of the vertical jump.",
          "Half-eq: V_½eq = V_eq/2; read pH at that V → pKa.",
          "First derivative: plot ΔpH/ΔV vs. V; peak gives V_eq precisely.",
          "Second derivative: zero-crossing also pinpoints V_eq.",
        ],
      },
      {
        heading: "Worked example (HOAc)",
        body:
          "25.00 mL of HOAc titrated with 0.1000 M NaOH; V_eq = 23.40 mL. Moles HOAc = (0.1000)(0.02340) = 2.340×10⁻³ mol. [HOAc]₀ = 2.340×10⁻³/0.02500 = 0.0936 M. At V_½eq = 11.70 mL, pH = 4.75 → pKa(HOAc) = 4.75 (literature 4.74).",
      },
      {
        heading: "Worked example (H₃PO₄)",
        body:
          "Two visible equivalence volumes V_eq1 and V_eq2 should differ by V_eq1 (each step removes one proton from the same initial moles). pKa1 = pH at V_eq1/2; pKa2 = pH at (V_eq1 + V_eq2)/2.",
      },
    ],
    errors: [
      {
        source: "Carbonate in NaOH",
        effect:
          "CO₂-absorbed NaOH is partly Na₂CO₃; titration shows a smaller-than-expected V_eq (less effective base) → calculated [HA] too LOW.",
        direction: "low",
      },
      {
        source: "Coarse increments near equivalence",
        effect: "V_eq imprecise; pKa from V_eq/2 also imprecise.",
        direction: "either",
      },
      {
        source: "Slow stirring / electrode not fully equilibrated",
        effect: "pH lags real value → buffer region looks shifted; pKa estimate off.",
        direction: "either",
      },
      {
        source: "Initial volume uncertainty (volumetric pipet vs. graduated cylinder)",
        effect: "Direct multiplicative error in [HA].",
        direction: "either",
      },
      {
        source: "Cross-contamination of pH electrode (no rinse between buffers)",
        effect: "Calibration biased → all pH readings shifted.",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Why is pH at half-equivalence equal to pKa?",
        a: "At half-eq, exactly half of HA has been converted to A⁻ → [HA] = [A⁻] → log([A⁻]/[HA]) = 0 → pH = pKa.",
      },
      {
        q: "Could we determine pKa without ever finding V_eq?",
        a: "Yes — read the pH at the FLATTEST part of the buffer region; that's pKa to ±0.05. But finding V_eq is more accurate because of the sharp jump.",
      },
      {
        q: "Why is V_eq the same regardless of WHICH titrant concentration we use?",
        a: "It isn't — V_eq depends on M_NaOH. What's invariant is the moles at equivalence. V_eq · M_NaOH = constant.",
      },
      {
        q: "Why does H₃PO₄ require careful interpretation between V_eq1 and V_eq2?",
        a: "Between them, the dominant species is H₂PO₄⁻ acting as both acid (toward HPO₄²⁻) and conjugate base (of H₃PO₄). The pH there ≈ (pKa1 + pKa2)/2 ≈ 4.7 — useful to know.",
      },
      {
        q: "Was it necessary to dry the burette before titrating?",
        a: "No — it should be RINSED with a small portion of titrant first (so residual water doesn't dilute the NaOH). Drying wastes time and risks contamination.",
      },
      {
        q: "Why does the equivalence-point pH for HOAc + NaOH lie ABOVE 7?",
        a: "At equivalence, you have a solution of NaOAc — the acetate ion is a weak base. So pH > 7 (typically ~8.7 for 0.1 M).",
      },
      {
        q: "Why does the equivalence point for HCl + NaOH lie at pH = 7?",
        a: "Both are strong; the salt (NaCl) is neither acidic nor basic — pure water pH = 7 at 25 °C.",
      },
    ],
    practice: [
      {
        q: "30.0 mL of an unknown weak monoprotic acid is titrated with 0.0500 M NaOH. V_eq = 18.20 mL; pH at V_½eq = 4.20. Find [acid] and pKa.",
        solution:
          "moles acid = (0.0500)(0.01820) = 9.10×10⁻⁴ mol.\n[acid] = 9.10×10⁻⁴ / 0.0300 = 0.0303 M.\npKa = pH(½eq) = 4.20.",
      },
      {
        q: "For a triprotic acid with pKa1=2, pKa2=7, pKa3=12, sketch the predicted pH at V_eq1, halfway between V_eq1 and V_eq2, and at V_eq2.",
        solution:
          "V_eq1: dominant species H₂A⁻ (amphoteric) → pH ≈ (pKa1+pKa2)/2 = 4.5.\n(V_eq1+V_eq2)/2 (= half-equivalence of step 2): [H₂A⁻] = [HA²⁻] → pH = pKa2 = 7.0.\nV_eq2: dominant species HA²⁻ → pH ≈ (pKa2+pKa3)/2 = 9.5.",
      },
      {
        q: "Your NaOH was 0.105 M instead of the labeled 0.100 M. How does this affect your reported [acid]?",
        solution:
          "[acid] = M_NaOH · V_eq / V_acid. Underestimating M_NaOH means computing [acid] too LOW by 5%. Also pKa from pH at V_½eq is unaffected (no concentration enters).",
      },
    ],
  },
  {
    id: "exp7",
    num: 7,
    title: "Equilibrium & Thermodynamics — Solubility of Ca(OH)₂",
    short: "Ksp + Thermo",
    oneLiner:
      "Measure Ksp of Ca(OH)₂ at three temperatures, then extract ΔG°, ΔH°, and ΔS° from the temperature dependence.",
    learningObjectives: [
      "Write Ksp for a sparingly-soluble salt; relate molar solubility s to Ksp via stoichiometry.",
      "Connect Ksp to ΔG° via ΔG° = −RT ln K.",
      "Use the van't Hoff equation: ln K = −ΔH°/(R·T) + ΔS°/R; plot ln K vs. 1/T.",
      "Interpret slope = −ΔH°/R and y-intercept = ΔS°/R.",
      "Predict whether dissolution is endothermic or exothermic from how Ksp varies with T.",
    ],
    experimentalObjectives: [
      "Prepare saturated Ca(OH)₂ solutions at three temperatures (e.g., 5 °C, 25 °C, 45 °C).",
      "Filter or decant carefully to remove undissolved solid (saturation requires excess solid present during equilibration).",
      "Titrate aliquots of the saturated solution with standardized HCl to determine [OH⁻].",
      "Compute s and Ksp at each T; plot ln Ksp vs. 1/T to extract thermodynamic parameters.",
    ],
    theory: [
      {
        heading: "Ksp expression for Ca(OH)₂",
        equations: [
          "Ca(OH)₂(s) ⇌ Ca²⁺(aq) + 2 OH⁻(aq)",
          "Ksp = [Ca²⁺][OH⁻]²",
          "If s = molar solubility, then [Ca²⁺] = s and [OH⁻] = 2s, so Ksp = 4s³",
        ],
      },
      {
        heading: "Why titrate OH⁻, not Ca²⁺?",
        body:
          "OH⁻ is easy to titrate with strong acid using a pH indicator or pH meter. Once [OH⁻] is known, [Ca²⁺] = ½[OH⁻] by stoichiometry.",
      },
      {
        heading: "Thermodynamic relationships",
        equations: [
          "ΔG° = −RT ln K",
          "ΔG° = ΔH° − T ΔS°",
          "ln K = −ΔH°/(R·T) + ΔS°/R   (van't Hoff)",
        ],
        body:
          "Plot ln Ksp vs. 1/T (in K⁻¹). Slope = −ΔH°/R. Intercept = ΔS°/R.",
      },
      {
        heading: "Sign expectations",
        bullets: [
          "Ca(OH)₂ dissolution is mildly EXOTHERMIC (ΔH° < 0): solubility DECREASES with rising T (unusual — opposite of most salts).",
          "ΔS° for dissolving a 1:2 salt to 3 ions is positive (more disorder).",
          "ΔG° must be > 0 (Ksp << 1, so K < 1, ln K < 0).",
        ],
      },
    ],
    procedure: [
      "Place excess solid Ca(OH)₂ in three flasks of DI water; equilibrate each at one of three temperatures.",
      "After 15+ minutes (constant T) carefully decant or filter while keeping at the equilibration T.",
      "Pipet a known volume of clear saturated solution; titrate with standardized HCl using phenolphthalein or a pH meter.",
      "Compute moles of OH⁻ neutralized → [OH⁻] → s = ½[OH⁻] → Ksp = 4s³.",
      "Repeat at each of the three temperatures.",
    ],
    procedureWhy: [
      {
        step: "Why must EXCESS solid Ca(OH)₂ be present during equilibration?",
        why:
          "Saturation requires that the solid be in equilibrium with its dissolved ions. Without excess solid, you can't be sure the solution is at the maximum [Ca²⁺][OH⁻]² product — it might be unsaturated.",
      },
      {
        step: "Why filter at the equilibration temperature, not after cooling?",
        why:
          "Cooling a saturated solution made at higher T can supersaturate, and Ca(OH)₂ might re-precipitate during transfer (changing [OH⁻]). Filtering at T preserves the equilibrium concentrations for that T.",
      },
      {
        step: "Why is the volume of solution NOT critical (within reason)?",
        why:
          "[OH⁻] depends only on T, not on how much saturated solution you have. You only need a known aliquot for the titration so moles → concentration is straightforward.",
      },
      {
        step: "Why titrate with HCl instead of just measuring pH?",
        why:
          "Titration gives total moles of OH⁻ (a quantitative integration); pH gives [OH⁻] activity but is more sensitive to electrode calibration and ionic strength. Titration is more accurate at modest [OH⁻].",
      },
      {
        step: "Why do we plot ln K vs. 1/T (not K vs. T)?",
        why:
          "The van't Hoff form is linear in 1/T when ΔH° is approximately T-independent. Linear regression then gives ΔH° and ΔS° from slope and intercept.",
      },
    ],
    dataAnalysis: [
      {
        heading: "From titration to Ksp",
        equations: [
          "moles OH⁻ = M_HCl · V_HCl_eq",
          "[OH⁻] = moles / V_aliquot",
          "s = [OH⁻]/2 = [Ca²⁺]",
          "Ksp = 4 s³",
        ],
      },
      {
        heading: "Worked example",
        body:
          "At 25°C: 25.00 mL aliquot needs 5.20 mL of 0.0500 M HCl. moles OH⁻ = 2.60×10⁻⁴; [OH⁻] = 0.01040 M; s = 0.00520 M; Ksp = 4(0.00520)³ = 5.6×10⁻⁷. ln Ksp = −14.4. ΔG° = −RT ln K = −(8.314)(298)(−14.4) = +35.7 kJ/mol.",
      },
      {
        heading: "Van't Hoff plot",
        body:
          "Plot ln Ksp (y) vs. 1/T in K⁻¹ (x). Use LINEST: slope (m) and intercept (b). ΔH° = −m·R; ΔS° = b·R. Compute ΔG° at any T from ΔG° = ΔH° − TΔS° (or directly from −RT ln K at that T).",
      },
    ],
    errors: [
      {
        source: "Solution unsaturated at the time of decanting",
        effect: "Reports [OH⁻] LOW → Ksp LOW.",
        direction: "low",
      },
      {
        source: "Solid Ca(OH)₂ carried through into the titrated aliquot",
        effect: "Apparent [OH⁻] HIGH (more solid dissolves during titration) → Ksp HIGH.",
        direction: "high",
      },
      {
        source: "CO₂ absorption (CO₂ + 2OH⁻ → CO₃²⁻ + H₂O)",
        effect:
          "Removes OH⁻ silently before titration → measured [OH⁻] LOW; Ksp LOW. Particularly bad at higher T because solubility of CO₂ is lower but reaction kinetics fast.",
        direction: "low",
      },
      {
        source: "Standardized HCl actually a different M",
        effect: "Direct multiplicative error in [OH⁻] and ⅓-power smaller in Ksp.",
        direction: "either",
      },
      {
        source: "Temperature drift between equilibration and titration",
        effect: "Ksp value applied to wrong T on the van't Hoff plot.",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Why does Ca(OH)₂ become LESS soluble at higher T?",
        a: "Its dissolution is exothermic — heat is a 'product'. Adding heat shifts the equilibrium back toward solid (Le Chatelier). Most ionic salts are the opposite (endothermic), so this is a notable special case.",
      },
      {
        q: "Could you do this experiment in tap water?",
        a: "No — tap water already contains dissolved ions (Ca²⁺, Mg²⁺, HCO₃⁻) that change ionic strength and may exert a common-ion effect, biasing s. DI water is required.",
      },
      {
        q: "Why is it OK to use a small aliquot for titration if Ksp depends on concentrations, not volumes?",
        a: "Concentrations are intensive — they don't change with how much you take. The aliquot just needs to be large enough that the titration consumes a measurable V of HCl.",
      },
      {
        q: "If you mistakenly let the saturated solution cool before titrating, how is your reported Ksp at the higher T affected?",
        a: "Some Ca(OH)₂ may re-precipitate as solution cools → [OH⁻] in titrated solution is LOWER than the saturated value at the higher T → Ksp underestimated.",
      },
      {
        q: "From ln K vs. 1/T, the slope is positive — what does that imply about ΔH°?",
        a: "Slope = −ΔH°/R. Positive slope means ΔH° < 0 (exothermic). Confirms decreasing K with increasing T (Ca(OH)₂ behavior).",
      },
      {
        q: "Why is ΔG° > 0 even though Ca(OH)₂ does dissolve?",
        a: "ΔG° refers to the standard state ([ions]=1 M). Real solutions have far lower [ions] (s ≈ 10⁻² M), so ΔG = ΔG° + RT ln Q is negative for Q < K — driving dissolution until Q = K. The standard state is just 'paper'; physical dissolution depends on Q vs. K.",
      },
    ],
    practice: [
      {
        q: "At 25°C, [OH⁻] in saturated Ca(OH)₂ is 0.0204 M. Find s, Ksp, ΔG° at 25°C.",
        solution:
          "s = 0.0204/2 = 0.0102 M.\nKsp = 4(0.0102)³ = 4.24×10⁻⁶.\nΔG° = −RT ln K = −(8.314)(298)(ln 4.24×10⁻⁶) = −(8.314)(298)(−12.37) = +30.6 kJ/mol.",
      },
      {
        q: "Two data points: at 5°C (278 K) Ksp = 9.0×10⁻⁶; at 45°C (318 K) Ksp = 1.0×10⁻⁶. Estimate ΔH°.",
        solution:
          "ln K₁ = −11.62; ln K₂ = −13.82; Δ ln K = −2.20.\nΔ(1/T) = 1/318 − 1/278 = 3.144×10⁻³ − 3.597×10⁻³ = −4.53×10⁻⁴ K⁻¹.\nslope = ΔlnK / Δ(1/T) = −2.20 / −4.53×10⁻⁴ = +4860 K.\nΔH° = −R · slope = −(8.314)(4860) = −40.4 kJ/mol → exothermic, consistent with decreasing solubility with T.",
      },
      {
        q: "If your saturated solution absorbed CO₂ before titration, how does your reported Ksp compare to the true value?",
        solution:
          "CO₂ + 2OH⁻ → CO₃²⁻ + H₂O removes OH⁻. Apparent [OH⁻] LOW → s LOW → Ksp = 4s³ LOW (and underestimated by a factor of ~ (loss fraction)³).",
      },
    ],
  },
  {
    id: "exp8",
    num: 8,
    title: "Electrochemistry I — Galvanic & Electrolytic Cells (Faraday)",
    short: "Galvanic + Electrolytic",
    oneLiner:
      "Build galvanic cells, measure cell potentials, then use an electrolytic cell to relate charge passed (Q = It) to moles of metal plated (Faraday).",
    learningObjectives: [
      "Identify anode (oxidation) and cathode (reduction) in galvanic AND electrolytic cells (the labels switch sign convention vs. driving force, not vs. process).",
      "Compute E°_cell = E°_cathode − E°_anode using a table of standard reduction potentials.",
      "Apply the Nernst equation: E = E° − (RT/nF) ln Q (or 0.0592/n · log Q at 25°C).",
      "Use Faraday's law: Q = nF for n moles of electrons; m = (Q · M) / (n · F) for grams plated.",
      "Distinguish galvanic (spontaneous, ΔG° < 0, E° > 0) from electrolytic (driven, ΔG° > 0, ext. supply needed).",
    ],
    experimentalObjectives: [
      "Construct several galvanic cells (e.g., Cu|Cu²⁺ ‖ Zn²⁺|Zn; Cu|Cu²⁺ ‖ Pb²⁺|Pb) using a salt bridge; measure E with a voltmeter.",
      "Compare measured E to the value predicted from standard reduction potentials.",
      "Run an electrolytic cell (e.g., Cu plating from CuSO₄): measure current I, record time t, measure mass change of the cathode.",
      "Use Q = It and Faraday's law to compute mass and compare to weighed mass.",
    ],
    theory: [
      {
        heading: "Standard cell potential",
        equations: [
          "E°_cell = E°_cathode − E°_anode",
          "ΔG° = −nFE°_cell",
          "Spontaneous if E°_cell > 0",
        ],
        body:
          "Always look up REDUCTION potentials in the table. The species with the more positive E°_red goes on the cathode side (gets reduced); the other is reversed (oxidized) on the anode side.",
      },
      {
        heading: "Nernst equation",
        equations: [
          "E = E° − (RT/nF) ln Q",
          "At 25°C: E = E° − (0.0592/n) log Q",
        ],
        body:
          "Q is the reaction quotient written for the cell reaction as a whole. As the cell discharges, Q → K, ln Q → ln K, E → 0 (dead battery).",
      },
      {
        heading: "Faraday's constants & laws",
        equations: [
          "F = 96 485 C/mol e⁻",
          "Q (charge) = I · t",
          "moles e⁻ = Q / F = I·t / F",
          "moles metal = (moles e⁻) / n  where n = electrons per metal atom",
          "mass = moles metal · M",
        ],
      },
      {
        heading: "Anode/cathode by cell type",
        bullets: [
          "Galvanic: cathode is +; anode is −. Electrons flow externally from − (anode) to + (cathode).",
          "Electrolytic: cathode is − (the side connected to the supply's negative terminal); anode is +. Reduction still happens at the cathode and oxidation at the anode (process labels are tied to oxidation/reduction, not to charge).",
        ],
      },
      {
        heading: "Salt bridge",
        body:
          "Allows ion flow between half-cells to maintain electrical neutrality without mixing the solutions. Typically KNO₃ or KCl in agar/saturated solution. Cations migrate toward the cathode side (which becomes negative as cations are removed from solution by reduction) and anions toward the anode side.",
      },
    ],
    procedure: [
      "Cell A (galvanic, Zn-Cu): immerse a Zn strip in Zn²⁺ and Cu strip in Cu²⁺; connect via salt bridge and a voltmeter.",
      "Repeat with other metal pairs (Cu-Pb, Cu-Mg, etc.) and tabulate measured vs. predicted E.",
      "Cell B (electrolytic, Cu plating): use a CuSO₄ solution with two Cu strips. Connect to a power supply, record I (mA) and t (s); weigh the cathode before and after.",
      "Optional: Nernst variation — change [Cu²⁺] in one half-cell and observe predicted E shift.",
    ],
    procedureWhy: [
      {
        step: "Why is the salt bridge essential?",
        why:
          "Without it, charge accumulates rapidly in each half-cell (cathode side becomes positive as Cu²⁺ is consumed; anode side becomes negative as Zn²⁺ is generated). The cell stops within milliseconds. The salt bridge supplies ions to neutralize each side.",
      },
      {
        step: "Why use the SAME metal in CuSO₄ for the electrolytic cell (Cu/Cu²⁺/Cu)?",
        why:
          "If both electrodes are Cu, the only Faradaic process is Cu plating on the cathode and Cu dissolving from the anode. With foreign electrodes, gas evolution (O₂, H₂) competes and ruins your m = nF/Q analysis.",
      },
      {
        step: "Why measure CURRENT, not just voltage, in the electrolytic experiment?",
        why:
          "Faraday's law uses charge Q = ∫I dt. Voltage tells you about thermodynamic driving force; current tells you about RATE of electron transfer. To convert to moles, you need ∫I dt.",
      },
      {
        step: "Why must the cathode be carefully cleaned, dried, and weighed?",
        why:
          "Mass change is small (mg-scale). Surface oxide, fingerprints, or trapped water all introduce mass that has nothing to do with plated Cu — the data analysis depends entirely on Δm_Cu.",
      },
      {
        step: "Why is current sometimes held CONSTANT during electrolysis?",
        why:
          "Then Q = I · t exactly. If I varies, you must integrate. A constant-current power supply simplifies the analysis to a single multiplication.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Galvanic cells",
        body:
          "Measured E vs. predicted E°. Differences usually attributed to non-standard concentrations (use Nernst), junction potentials, or impure electrodes.",
      },
      {
        heading: "Electrolytic cell — Cu plating",
        equations: [
          "Q (C) = I (A) · t (s)",
          "moles e⁻ = Q / F",
          "moles Cu = moles e⁻ / 2     (Cu²⁺ + 2e⁻ → Cu)",
          "mass Cu predicted = moles Cu · 63.55 g/mol",
          "% recovery = (mass measured / mass predicted) · 100",
        ],
      },
      {
        heading: "Worked example",
        body:
          "I = 0.200 A constant for t = 600 s → Q = 120 C → moles e⁻ = 120/96485 = 1.244×10⁻³ → moles Cu = 6.22×10⁻⁴ → mass Cu = 0.0395 g (39.5 mg). Measured Δm = 0.0388 g → 98.2% recovery.",
      },
    ],
    errors: [
      {
        source: "Voltage measured during current draw (not open circuit)",
        effect: "Internal IR drop reduces measured E below E° → E_measured < E°_predicted.",
        direction: "low",
      },
      {
        source: "Salt bridge dried out or poorly conducting",
        effect: "High internal resistance; voltmeter still reads near OCV but cell quickly drops; for electrolytic, current stalls.",
        direction: "either",
      },
      {
        source: "Side reactions (e.g., H₂ evolution at high overpotential)",
        effect: "Some current goes to H₂ instead of Cu plating → mass plated < predicted; % recovery < 100%.",
        direction: "low",
      },
      {
        source: "Cathode surface contamination",
        effect: "Oxide weighed in or out → Δm too high or too low.",
        direction: "either",
      },
      {
        source: "Time stopwatch error",
        effect: "Q = It off proportionally; affects predicted mass linearly.",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Why is the cathode (+) in a galvanic cell but (−) in an electrolytic cell?",
        a: "Charge labels reflect external circuit polarity, not the chemistry. Reduction always happens at the cathode. In a galvanic cell, electrons flow spontaneously TO the cathode → cathode is at + relative to anode. In electrolytic, the supply DRIVES electrons to the cathode by making it −.",
      },
      {
        q: "If you doubled [Cu²⁺] on the cathode side, does measured E go up or down?",
        a: "Up (slightly). Q = [Zn²⁺]/[Cu²⁺] decreases → −(0.0592/n) log Q is more positive → E increases per Nernst.",
      },
      {
        q: "Was it necessary that the Cu and Zn strips be exactly the same surface area?",
        a: "No — equilibrium potentials are intensive (independent of surface area). Surface area affects rate (current draw), not E_open-circuit.",
      },
      {
        q: "Why is F = 96 485 C/mol?",
        a: "F = N_A · e = (6.022×10²³)(1.602×10⁻¹⁹) C/mol e⁻. It converts moles of electrons to coulombs.",
      },
      {
        q: "Why does the cell stop working when Q = K?",
        a: "When Q = K, ΔG = 0 → E = 0. No driving force, no further net reaction. This is the discharged 'dead battery' state.",
      },
      {
        q: "Why is the predicted mass computed from Q·M/(nF) often LARGER than the measured mass?",
        a: "Side reactions (H₂ evolution, Cu²⁺ reduction at uneven surface, complexes) consume some electrons without depositing weighable Cu. So mass measured ≤ mass predicted; current efficiency < 100%.",
      },
      {
        q: "Could you replace the salt bridge with a metal wire?",
        a: "No. A metal wire conducts ELECTRONS, not ions. The cell needs ION transfer to balance charge in solution; the wire is the external electron path. They are not interchangeable.",
      },
    ],
    practice: [
      {
        q: "A galvanic cell is built from Cu²⁺/Cu (E° = +0.34 V) and Zn²⁺/Zn (E° = −0.76 V), both at 1 M, 25°C. Write the cell, identify anode/cathode, compute E°_cell. What is E if [Cu²⁺] = 0.0010 M and [Zn²⁺] = 1.0 M?",
        solution:
          "Cathode: Cu²⁺ + 2e⁻ → Cu (more positive E°). Anode: Zn → Zn²⁺ + 2e⁻.\nE°_cell = 0.34 − (−0.76) = +1.10 V.\nQ = [Zn²⁺]/[Cu²⁺] = 1.0/0.0010 = 1000.\nE = 1.10 − (0.0592/2)·log(1000) = 1.10 − 0.0888 = 1.01 V.",
      },
      {
        q: "A constant 0.500 A is run through CuSO₄(aq) for 30.0 min using a Cu cathode. Predict mass of Cu deposited.",
        solution:
          "Q = 0.500·1800 = 900 C.\nmol e⁻ = 900/96485 = 9.33×10⁻³.\nmol Cu = 9.33×10⁻³/2 = 4.66×10⁻³.\nm = 4.66×10⁻³ · 63.55 = 0.296 g.",
      },
      {
        q: "If 0.250 g of Ag (M = 107.87) is to be plated from Ag⁺ at 0.150 A, how long must the current run?",
        solution:
          "mol Ag = 0.250/107.87 = 2.318×10⁻³.\nAg⁺ + e⁻ → Ag, n = 1, mol e⁻ = 2.318×10⁻³.\nQ = 2.318×10⁻³ · 96 485 = 223.6 C.\nt = Q/I = 223.6/0.150 = 1491 s ≈ 24.8 min.",
      },
      {
        q: "Your measured E for a Cu-Zn cell is 1.04 V instead of the predicted 1.10 V. Give two plausible reasons.",
        solution:
          "(1) Concentrations not 1 M (Nernst correction). (2) IR drop in the salt bridge / internal resistance lowers terminal voltage when any current flows. (3) Junction potentials at the salt-bridge interfaces. (4) Electrode surface contamination.",
      },
    ],
  },
  {
    id: "exp9",
    num: 9,
    title: "Electrochemistry II — Corrosion of Iron",
    short: "Corrosion",
    oneLiner:
      "Use galvanic cell logic to explain corrosion of iron, sacrificial anode protection, and impressed-current protection — and observe the role of NaCl and HCl.",
    learningObjectives: [
      "Define corrosion as oxidation of a metal driven by formation of a galvanic cell with O₂/H₂O, contaminants, or another metal.",
      "Write the half-reactions for iron corrosion: anode Fe → Fe²⁺ + 2e⁻; cathode O₂ + 2H₂O + 4e⁻ → 4OH⁻ (in neutral) or 2H⁺ + 2e⁻ → H₂ (in acid).",
      "Explain why salt water accelerates corrosion (electrolyte raises conductivity → cells operate faster).",
      "Explain sacrificial-anode protection (a more easily oxidized metal corrodes preferentially).",
      "Explain impressed-current protection (an external supply forces the protected metal to be the cathode).",
      "Connect the qualitative test colors (K₃[Fe(CN)₆] for Fe²⁺ — blue; phenolphthalein for OH⁻ — pink) to the redox steps.",
    ],
    experimentalObjectives: [
      "Set up several iron-nail systems in agar with K₃[Fe(CN)₆] (Fe²⁺ indicator) and phenolphthalein (OH⁻ indicator) to visualize anodic and cathodic regions.",
      "Compare bare iron, iron with attached Cu (more noble — accelerates corrosion at iron), iron with attached Zn (sacrificial — protects iron), iron with applied negative voltage (cathodic protection).",
      "Repeat with additional NaCl and/or HCl to test how electrolyte composition affects rate.",
    ],
    theory: [
      {
        heading: "Iron corrosion as a localized galvanic cell",
        equations: [
          "Anode (where iron is being lost): Fe → Fe²⁺ + 2e⁻",
          "Cathode (where O₂/H⁺ is reduced): O₂ + 2H₂O + 4e⁻ → 4 OH⁻  (neutral)",
          "                                  2 H⁺ + 2e⁻ → H₂          (acidic)",
        ],
        body:
          "Even on a single iron nail, mechanical strain (the head and the point are work-hardened) creates anodic and cathodic regions. Strained metal is slightly more easily oxidized → those become anode sites.",
      },
      {
        heading: "Why salt water makes corrosion worse",
        body:
          "NaCl raises ionic conductivity dramatically. Galvanic-cell internal resistance falls; current flows freely between local anode and local cathode → corrosion proceeds at higher rate. Cl⁻ also penetrates passive oxide films and breaks them.",
      },
      {
        heading: "Sacrificial anode protection",
        body:
          "Couple iron to a metal that is MORE easily oxidized (more negative E°_red). The other metal becomes the anode and is consumed, while iron is now the cathode (protected — it's being reduced if anything, certainly not oxidized).",
        equations: [
          "Zn²⁺ + 2e⁻ → Zn   E° = −0.76 V  (more negative → easier to oxidize than Fe)",
          "Fe²⁺ + 2e⁻ → Fe   E° = −0.44 V",
          "Cu²⁺ + 2e⁻ → Cu   E° = +0.34 V  (less easily oxidized → makes Fe corrode WORSE)",
        ],
      },
      {
        heading: "Impressed-current protection",
        body:
          "External DC supply forces electrons INTO the iron, making it the cathode of an electrolytic cell. The 'auxiliary anode' is consumed instead. Used on pipelines and ship hulls.",
      },
      {
        heading: "Color tests",
        bullets: [
          "K₃[Fe(CN)₆] reacts with Fe²⁺ → deep blue (Prussian-blue-like) precipitate. Marks the ANODE.",
          "Phenolphthalein turns pink in basic solution (OH⁻ ≥ pH 8.3). Marks the CATHODE (where OH⁻ is generated by O₂ reduction).",
        ],
      },
    ],
    procedure: [
      "Embed iron nails (some bent, some with a copper wire wrapped around them, some with zinc, some attached to the negative lead of a low-voltage power supply) into a Petri dish of warm agar containing K₃[Fe(CN)₆] and phenolphthalein.",
      "Optionally include NaCl in some plates and HCl-acidified gel in others.",
      "Allow to cool and stand for 15-30 min.",
      "Photograph and describe the patterns of blue and pink coloration.",
    ],
    procedureWhy: [
      {
        step: "Why is the agar warm to start, then allowed to gel?",
        why:
          "Warm agar pours easily and contacts every surface of the nail; gelling locks the indicator near the diffusion front so anodic and cathodic regions remain visually localized.",
      },
      {
        step: "Why a bent nail in some cells?",
        why:
          "Bent regions are work-hardened (more strained) → preferred ANODE sites — you should see blue concentrated at the bend and the tip, pink along the unstrained shaft.",
      },
      {
        step: "Why does the iron-Cu pair corrode iron FASTER than iron alone?",
        why:
          "Cu is a much better cathode (its O₂-reduction is faster, and it doesn't lose electrons itself). It pulls electrons from iron more efficiently than the iron's own surface would, so iron's anodic dissolution accelerates.",
      },
      {
        step: "Why does the iron-Zn pair show pink at the iron and blue at the zinc?",
        why:
          "Zn is the sacrificial anode (more negative E°_red). Zn → Zn²⁺ + 2e⁻ (no Fe²⁺ formed; some other indicator might catch Zn²⁺ but K₃[Fe(CN)₆] doesn't). Iron, now the cathode, hosts O₂ + 2H₂O + 4e⁻ → 4OH⁻ — pink.",
      },
      {
        step: "Why does adding NaCl darken the colors more strongly?",
        why:
          "More current flows → more Fe²⁺ generated per minute (more blue) and more OH⁻ generated (more pink). NaCl by itself isn't a redox participant — it accelerates by lowering resistance.",
      },
      {
        step: "Why does adding HCl change the cathodic color?",
        why:
          "In strong acid, the cathodic reaction shifts from O₂ reduction (which generates OH⁻ → pink) to H⁺ reduction (which generates H₂ — colorless and consumes acid). Phenolphthalein no longer turns pink because pH stays below 8.3.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Qualitative interpretation",
        body:
          "Note where blue and pink appear and use that to label anode vs cathode regions on each electrode. Compare relative intensity of color across plates to infer rate (more color in less time = faster corrosion).",
      },
      {
        heading: "Predicted protection ordering",
        body:
          "Most-protective sacrificial metals on iron: Mg (E° −2.37 V) > Zn (−0.76 V) > … > Pb. Worse than nothing: Cu (+0.34 V), Sn, Ag — these are nobler than iron and ACCELERATE corrosion.",
      },
    ],
    errors: [
      {
        source: "Nail not freshly cleaned",
        effect: "Existing oxide passivates surface; corrosion appears slower than reality.",
        direction: "low",
      },
      {
        source: "Insufficient O₂ access (sealed Petri)",
        effect: "Cathodic reaction starves; pink is faint even where it 'should' be.",
        direction: "low",
      },
      {
        source: "Indicator concentrations too high",
        effect: "Color saturates everywhere → can't distinguish localized anode/cathode regions.",
        direction: "either",
      },
      {
        source: "Power supply voltage too high in cathodic-protection cell",
        effect: "May cause electrolysis of water → bubbling and altered chemistry; over-protection can also damage coatings or evolve H₂ that embrittles the iron.",
        direction: "either",
      },
      {
        source: "Mixed-up voltage polarity in impressed-current setup",
        effect:
          "If iron is connected to the + terminal, you've MADE it the anode and accelerated corrosion instead of preventing it — an instructive failure mode.",
        direction: "high",
      },
    ],
    whyQA: [
      {
        q: "Why is rust commonly written as Fe₂O₃·xH₂O and not just FeO?",
        a: "Fe²⁺ formed at the anode is further oxidized by atmospheric O₂ to Fe³⁺, then precipitates with hydroxide to give the hydrated Fe(III) oxide ('rust'). The visible reddish-brown solid is the Fe³⁺ form.",
      },
      {
        q: "Was it necessary to use BOTH indicators?",
        a: "Yes — they reveal the two halves of the redox couple. K₃[Fe(CN)₆] alone shows you where iron is being oxidized; phenolphthalein alone shows you where O₂ is being reduced. Together they make the galvanic-cell nature of corrosion visible.",
      },
      {
        q: "Why is zinc galvanizing effective even where the steel is exposed (e.g., a scratch)?",
        a: "Galvanic protection works at a distance through the electrolyte. Even if iron is exposed at a scratch, the surrounding zinc preferentially corrodes (it's the anode). Iron remains cathodic until enough Zn is consumed.",
      },
      {
        q: "Could copper-plated steel rust faster than bare steel?",
        a: "Yes — once a defect breaks the Cu coating, the Cu becomes a cathode that rapidly accelerates iron oxidation at the breach. This is why Cu is a poor barrier coating but Zn is good.",
      },
      {
        q: "Why does seawater corrode iron faster than fresh water?",
        a: "Salt (NaCl, MgCl₂…) increases conductivity and breaks down passive oxide films; both effects accelerate the corrosion-cell current.",
      },
      {
        q: "If you applied the +pole of the power supply to the iron in an impressed-current cell, what would happen?",
        a: "Iron becomes the ANODE → forced oxidation → corrodes much faster than naturally. Always connect protected metal to the −pole.",
      },
    ],
    practice: [
      {
        q: "You see Prussian blue at both ends of a bent iron nail and pink along the shaft. Explain.",
        solution:
          "The bent ends are work-hardened, so they are more easily oxidized — they act as anodes (Fe → Fe²⁺ + 2e⁻, blue with K₃[Fe(CN)₆]). The shaft is the cathode (O₂ + 2H₂O + 4e⁻ → 4OH⁻, pink with phenolphthalein). The same nail hosts both half-cells.",
      },
      {
        q: "Rank the metals as sacrificial anodes for iron protection: Mg, Zn, Cu, Pb.",
        solution:
          "Effective sacrificial anodes need E°_red MORE NEGATIVE than Fe (−0.44 V) so they oxidize preferentially:\n• Mg (E° = −2.37 V) — way more negative than Fe → strongly protects.\n• Zn (E° = −0.76 V) — more negative than Fe → protects (this is galvanizing).\n• Pb (E° = −0.13 V) — LESS negative than Fe (−0.13 > −0.44), so Pb is harder to oxidize than Fe → Pb would NOT protect; if anything Fe stays the anode and corrodes.\n• Cu (E° = +0.34 V) — far less negative than Fe → makes Fe the anode → ACCELERATES Fe corrosion.\nProtect: Mg, Zn. Do not protect: Pb, Cu.",
      },
      {
        q: "Explain why an iron pipe carrying salty water that lies near a copper pipe in the soil corrodes much faster than an iron pipe alone.",
        solution:
          "Soil moisture is the electrolyte. Iron and copper, electrically connected through the soil (or worse, by accidental contact), form a galvanic couple in which iron is the anode (more easily oxidized than Cu). The salt water increases conductivity. Result: iron loses metal far faster than it would without the Cu nearby.",
      },
    ],
  },
  {
    id: "exp10",
    num: 10,
    title: "Coordination Compounds — Crystal Field Theory in Co Complexes",
    short: "Coordination",
    oneLiner:
      "Synthesize and characterize cobalt coordination compounds; relate observed colors to d-orbital splitting energies (Δ_o) via the spectrochemical series.",
    learningObjectives: [
      "Define a coordination compound, ligand, denticity, coordination number.",
      "Apply Crystal Field Theory: octahedral splitting into t₂g (lower, dxy/dxz/dyz) and eg (upper, dz²/dx²-y²) by Δ_o.",
      "Use color (the wavelength absorbed) to estimate Δ_o via E = hc/λ.",
      "Order ligands along the spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ ≈ CO.",
      "Distinguish high-spin and low-spin d⁶ configurations by Δ_o vs. pairing energy P.",
      "Identify common metal oxidation states from precursor formulas (e.g., CoCl₂·6H₂O = Co²⁺; Co(NH₃)₆³⁺ formed by oxidation = Co³⁺).",
    ],
    experimentalObjectives: [
      "Synthesize one or more cobalt complexes (e.g., [Co(NH₃)₅Cl]Cl₂; [Co(NH₃)₆]Cl₃) by oxidizing Co²⁺ to Co³⁺ in the presence of NH₃ ligands.",
      "Observe the color of each complex.",
      "Use a Vis spectrometer to find λ_max and infer Δ_o = hc/λ_max (in J/mol after multiplying by N_A).",
      "Compare measured Δ_o values across ligands and explain in terms of the spectrochemical series.",
    ],
    theory: [
      {
        heading: "Crystal Field splitting (octahedral)",
        body:
          "In an octahedral field, the five d orbitals split: the three (dxy, dxz, dyz) form the t₂g set (lower energy, 0.4 Δ_o below average); the two (dz², dx²−y²) form the eg set (higher energy, 0.6 Δ_o above average). The splitting energy is Δ_o (or 10 Dq).",
        equations: [
          "E(eg) − E(t₂g) = Δ_o",
          "Δ_o = h c / λ_max  (per molecule, then × N_A for kJ/mol)",
        ],
      },
      {
        heading: "Why complexes are colored",
        body:
          "Photons of energy = Δ_o promote a t₂g electron to eg. The complementary color is what we see. For example, a complex absorbing red light (~650 nm) appears green; absorbing blue (~450 nm) makes it orange.",
      },
      {
        heading: "Spectrochemical series",
        body:
          "Ligands ordered by their ability to split d-orbitals (small → large Δ_o): I⁻ < Br⁻ < S²⁻ < SCN⁻ < Cl⁻ < NO₃⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < phen < NO₂⁻ < CN⁻ ≈ CO. 'Strong-field' ligands (right side) → larger Δ_o → light absorbed at SHORTER wavelength.",
      },
      {
        heading: "High-spin vs. low-spin (d⁴-d⁷ only)",
        body:
          "If Δ_o > pairing energy P, electrons pair up in t₂g first → low-spin (fewer unpaired). If Δ_o < P, electrons spread to eg first → high-spin (more unpaired). For Co³⁺ (d⁶) with strong-field ligands like NH₃: low-spin, diamagnetic. With weak-field like F⁻: high-spin, paramagnetic.",
      },
      {
        heading: "Color observation guide",
        body:
          "Co(H₂O)₆²⁺: pink (Δ_o ~ 9 800 cm⁻¹). [Co(NH₃)₆]³⁺: yellow-orange (Δ_o ~ 22 900 cm⁻¹) — much larger because (a) Co³⁺ vs Co²⁺ and (b) NH₃ stronger than H₂O. CoCl₄²⁻: blue (tetrahedral, smaller Δ_t = (4/9) Δ_o). [Co(NH₃)₅Cl]²⁺: red-violet — one Cl lowers Δ a bit vs the all-NH₃ analog.",
      },
    ],
    procedure: [
      "Dissolve CoCl₂·6H₂O in water; add concentrated NH₃ then an oxidizer (H₂O₂ or air) — Co²⁺ is oxidized to Co³⁺ with ligand exchange.",
      "Acidify with HCl during NH₃ addition to control which complex forms (more Cl in the inner sphere = different stoichiometry).",
      "Crystallize the product, filter, wash, dry, weigh.",
      "Dissolve a small amount in water and run a Vis spectrum from ~350-700 nm.",
      "Identify λ_max(s); compute Δ_o.",
    ],
    procedureWhy: [
      {
        step: "Why oxidize Co²⁺ to Co³⁺ during synthesis?",
        why:
          "Co³⁺ complexes with N-donor ligands are KINETICALLY INERT (substitution-resistant) — once formed, they don't fall apart in dilute solution and you can study them. Co²⁺ analogs are labile and would re-equilibrate.",
      },
      {
        step: "Why use H₂O₂ or air as the oxidizer?",
        why:
          "H₂O₂ is a clean two-electron oxidant that doesn't introduce other coordinating species. Air works because Co²⁺/NH₃ mixtures are easily oxidized (E° more negative when amine-coordinated).",
      },
      {
        step: "Why control the amount of HCl added?",
        why:
          "It controls how many Cl⁻ end up in the inner coordination sphere (e.g., [Co(NH₃)₅Cl]²⁺ vs. [Co(NH₃)₆]³⁺). Excess HCl gives more Cl-containing products.",
      },
      {
        step: "Why measure the spectrum at low concentration?",
        why:
          "These complexes have moderate ε; at high [complex], A > 1 and the spectrometer signal is no longer linear. Dilute samples keep A in the 0.2-1.0 'sweet spot'.",
      },
      {
        step: "Why is exact mass for the spectrum NOT critical?",
        why:
          "λ_max depends only on Δ_o, which is intensive — independent of how much complex you dissolved. ε would require a known concentration, but the wavelength does not.",
      },
    ],
    dataAnalysis: [
      {
        heading: "Computing Δ_o",
        equations: [
          "E (J) = h c / λ_max ; with λ in meters, h = 6.626×10⁻³⁴ J·s, c = 3.00×10⁸ m/s",
          "Δ_o (kJ/mol) = N_A · E (J) / 1000",
          "Convenient: Δ_o (kJ/mol) ≈ 1.196×10⁵ / λ(nm)",
        ],
      },
      {
        heading: "Worked example",
        body:
          "[Co(NH₃)₆]³⁺ has λ_max ≈ 437 nm. Δ_o ≈ 1.196×10⁵ / 437 = 274 kJ/mol. By comparison [Co(NH₃)₅Cl]²⁺ shows λ_max around 530 nm → ~226 kJ/mol — smaller because Cl is a weaker-field ligand than NH₃ (lower in spectrochemical series).",
      },
      {
        heading: "Predicting and comparing",
        bullets: [
          "Stronger-field ligand or higher charge on M → larger Δ_o → shorter λ_max → 'bluer' apparent absorption.",
          "Replacing one NH₃ with a Cl⁻ in [Co(NH₃)₆]³⁺ should shift λ_max to longer wavelengths.",
          "Tetrahedral splitting Δ_t ≈ (4/9) Δ_o → tetrahedral complexes absorb at LONGER wavelengths and are usually deeper colored than their octahedral analogs.",
        ],
      },
    ],
    errors: [
      {
        source: "Incomplete oxidation of Co²⁺",
        effect: "Sample contains Co²⁺ contaminant — broad/extra absorbance, λ_max appears shifted.",
        direction: "either",
      },
      {
        source: "Sample not fully dissolved",
        effect: "Particle scattering raises A artificially across the spectrum; baseline non-zero.",
        direction: "either",
      },
      {
        source: "Misidentified λ_max (broad peak)",
        effect: "Δ_o off by ratio (Δλ/λ); typically ±5-10%.",
        direction: "either",
      },
      {
        source: "Cuvette/reference not matched",
        effect: "Apparent A baseline shifted; if peak is broad you may pick the wrong wavelength.",
        direction: "either",
      },
      {
        source: "Wrong complex formed (e.g., aquated rather than ammoniated)",
        effect: "λ_max wildly off; usually obvious from color (pink vs orange).",
        direction: "either",
      },
    ],
    whyQA: [
      {
        q: "Why are most transition-metal complexes colored, while Zn²⁺ complexes are not?",
        a: "Color requires a d-d transition. Zn²⁺ is d¹⁰ (full t₂g and eg) — no electron can be promoted because there is no empty d-orbital → no visible absorption.",
      },
      {
        q: "Could the SAME metal in the SAME oxidation state be different colors?",
        a: "Yes — different ligands give different Δ_o. [Co(NH₃)₆]³⁺ is yellow-orange, [Co(H₂O)₆]³⁺ would be paler/blue, [CoF₆]³⁻ blue-green.",
      },
      {
        q: "Why is CO higher in the spectrochemical series than even CN⁻?",
        a: "CO is a strong σ-donor AND π-acceptor (back-bonding from filled metal t₂g into empty CO π*). The combined effect raises Δ_o more than ligands without π-acceptor character.",
      },
      {
        q: "Was it necessary to use exactly the recipe for HCl/NH₃ ratios?",
        a: "Yes for selectivity — the ratio determines which product crystallizes. Out-of-spec ratios give mixtures and ambiguous spectra.",
      },
      {
        q: "Why are charged species (e.g., [Co(NH₃)₆]³⁺) accompanied by counter-ions in the formula?",
        a: "The formula must be electrically neutral overall. Counter-ions (Cl⁻ here) are in the OUTER sphere — they are NOT directly bonded to the metal and don't affect Δ_o.",
      },
      {
        q: "Why does the same Co³⁺ complex get a larger Δ_o than the analogous Co²⁺ complex?",
        a: "Higher charge on the metal pulls ligands closer and creates a stronger field → larger Δ_o. This is also why second- and third-row transition metals (Ru³⁺, Rh³⁺, Ir³⁺) almost always give low-spin complexes.",
      },
      {
        q: "If a complex absorbs at 600 nm, what color does it appear?",
        a: "Absorbs orange/red → transmits its complement → appears blue or blue-green.",
      },
    ],
    practice: [
      {
        q: "[Co(NH₃)₆]³⁺ has λ_max = 437 nm. Compute Δ_o in kJ/mol.",
        solution:
          "Δ_o = h c / λ × N_A = (6.626×10⁻³⁴)(3.00×10⁸)/(437×10⁻⁹) · 6.022×10²³.\n= (4.55×10⁻¹⁹ J)(6.022×10²³) = 2.74×10⁵ J/mol = 274 kJ/mol.",
      },
      {
        q: "Predict whether [Co(NH₃)₆]³⁺ is high-spin or low-spin. d-electron count?",
        solution:
          "Co³⁺ is d⁶. NH₃ is a strong-field ligand on the spectrochemical series → Δ_o > P → LOW-SPIN: t₂g⁶eg⁰, all electrons paired, diamagnetic.",
      },
      {
        q: "Explain why [Co(H₂O)₆]²⁺ is pink whereas CoCl₄²⁻ is intensely blue.",
        solution:
          "[Co(H₂O)₆]²⁺ is OCTAHEDRAL with weak-field water → small Δ_o → absorbs in green-yellow → pink color (low ε for symmetry-forbidden d-d, hence pale).\nCoCl₄²⁻ is TETRAHEDRAL with Cl⁻ → Δ_t ≈ (4/9) Δ_o → smaller still, absorbs red-orange → blue. ALSO tetrahedral geometry breaks the centrosymmetric selection rule (no g/u parity) → ε is much larger → intense color.",
      },
      {
        q: "Replacing one NH₃ in [Co(NH₃)₆]³⁺ with Cl⁻ — predict whether λ_max increases or decreases. Why?",
        solution:
          "Cl⁻ is weaker-field than NH₃. Average ligand-field strength of the complex DROPS → Δ_o decreases → photon required to excite is LESS energetic → λ_max INCREASES (shifts to longer wavelength). Color shifts toward red/violet.",
      },
    ],
  },
  {
    id: "exp11",
    num: 11,
    title: "Organic Structure & Spectroscopy — Functional Groups, Polarity, IR",
    short: "Organic + IR",
    oneLiner:
      "Identify common organic functional groups, predict bond/molecule polarity, and read IR spectra to confirm structure.",
    learningObjectives: [
      "Identify common functional groups: alcohol, ether, amine, amide, aldehyde, ketone, carboxylic acid, ester.",
      "Use Pauling electronegativity differences to classify bonds as nonpolar covalent, polar covalent, or ionic.",
      "Determine whether a molecule has a net dipole moment from individual bond dipoles + geometry (vector sum).",
      "Name simple organic molecules by IUPAC rules and draw structures from names.",
      "Match characteristic IR absorption bands to functional groups (broad O-H, sharp N-H, strong C=O).",
      "Distinguish a carbonyl (C=O) from other polar groups by its strong, sharp absorption around 1700 cm⁻¹.",
    ],
    experimentalObjectives: [
      "For a series of given molecules: identify functional groups; assign polar/nonpolar; predict overall molecular dipole.",
      "Read or interpret an IR spectrum: locate diagnostic peaks (O-H 3200-3550 broad; N-H 3300-3500 medium; C=O 1650-1750 strong; C-H ~3000).",
      "Name several organic compounds and draw structural formulas from names.",
    ],
    theory: [
      {
        heading: "Electronegativity and bond polarity",
        body:
          "Electronegativity (Pauling): F (4.0) > O (3.5) > N (3.0) > Cl (3.0) > C (2.5) ≈ S (2.5) > H (2.1) > Si (1.8) > B (2.0) ≈ metals (lower). Bond polarity is judged by ΔEN:",
        bullets: [
          "ΔEN = 0 → nonpolar covalent (e.g., C-C, H-H).",
          "0 < ΔEN ≤ 0.4 → essentially nonpolar covalent.",
          "0.4 < ΔEN < 1.7 → polar covalent (e.g., C-O, C-N, O-H).",
          "ΔEN ≥ 1.7 → ionic (e.g., NaCl, ΔEN ≈ 2.1).",
        ],
      },
      {
        heading: "Why O is more electronegative than N or S",
        body:
          "Across a row, EN increases left to right (effective nuclear charge rises while shielding stays similar). Down a group, EN decreases (added shells reduce attraction for outer electrons). Hence O (top of group 16) > S (below it); and O (group 16) > N (group 15, same row).",
      },
      {
        heading: "Dipole moment",
        body:
          "Vector sum of bond dipoles. A molecule can have polar bonds but be nonpolar overall if the bond dipoles cancel by symmetry (e.g., CCl₄: tetrahedral, four polar C-Cl that sum to zero). CHCl₃ is polar — symmetry is broken by H.",
      },
      {
        heading: "Functional groups (must recognize)",
        bullets: [
          "Alcohol R-OH; Ether R-O-R; Amine R-NH₂ / R-NHR' / R-NR'R''; Amide R-CO-NR₂.",
          "Aldehyde R-CHO; Ketone R-CO-R'; Carboxylic acid R-COOH; Ester R-COO-R'.",
          "Carbonyl = C=O common to aldehyde, ketone, carboxylic acid, amide, ester.",
        ],
      },
      {
        heading: "IR diagnostic regions",
        body:
          "IR absorbs at vibrational frequencies of bonds. Stronger bond, lighter atoms → higher frequency. Polar bonds give stronger signals (intensity ∝ |dμ/dq|).",
        bullets: [
          "O-H (alcohol): 3200-3550 cm⁻¹, broad (H-bonding).",
          "O-H (carboxylic acid): 2500-3300 cm⁻¹, very broad.",
          "N-H (amine, amide): 3300-3500 cm⁻¹, medium, often two peaks for 1° amines.",
          "C-H (sp³): ~2850-3000 cm⁻¹.",
          "C-H (sp²): ~3000-3100 cm⁻¹.",
          "C≡C: ~2200 cm⁻¹, weak.",
          "C≡N: ~2250 cm⁻¹, sharp.",
          "C=O: 1650-1750 cm⁻¹, strong sharp — DIAGNOSTIC.",
          "C=C: ~1600 cm⁻¹, medium.",
          "C-O: 1000-1300 cm⁻¹.",
        ],
      },
      {
        heading: "IUPAC naming basics",
        bullets: [
          "Pick the longest carbon chain that contains the principal functional group.",
          "Number from the end giving the FG (or first substituent) the lowest locant.",
          "List substituents alphabetically with locants.",
          "Functional-group endings: -ol (alcohol), -al (aldehyde), -one (ketone), -oic acid (carboxylic acid), -amide, -amine, -oate (ester).",
        ],
      },
    ],
    procedure: [
      "For each given molecule (e.g., 5-hydroxy-2-pentanone, morphine, riboflavin, hexane, NaOH), circle every functional group and label it.",
      "Mark each polar bond with an arrow from positive to negative (toward the more electronegative atom).",
      "Decide whether the bond dipoles cancel; if not, draw the resultant molecular dipole.",
      "Match a given IR spectrum to a candidate structure by reading off characteristic peaks.",
      "Practice naming: write IUPAC names for given structures and draw structures from given names.",
    ],
    procedureWhy: [
      {
        step: "Why does CCl₄ have polar bonds but no net dipole?",
        why:
          "Tetrahedral symmetry. The four C-Cl bond dipoles point at the corners of a regular tetrahedron — vector sum = 0. The molecule is nonpolar overall.",
      },
      {
        step: "Why is the O-H stretch in a carboxylic acid much broader than in an alcohol?",
        why:
          "Carboxylic acids form strong cyclic hydrogen-bonded dimers in the condensed phase. The H-bond network smears the O-H frequency over a large range, producing a very broad band that often extends down into the C-H region.",
      },
      {
        step: "Why is the C=O peak at ~1700 cm⁻¹ so reliable for identifying a carbonyl?",
        why:
          "It's strong (large dipole moment derivative) and falls in a region with few competing absorptions. Position within that range encodes which carbonyl: ester ~1735, ketone ~1715, aldehyde ~1725, amide ~1670, carboxylic acid ~1710.",
      },
      {
        step: "Why is hexane a nonpolar molecule?",
        why:
          "Only C-C and C-H bonds. C-H has ΔEN ≈ 0.4, essentially nonpolar; the small dipoles point in many directions and average to ~0. Hexane is a hydrocarbon and is hydrophobic.",
      },
      {
        step: "Why is NaOH best classified as ionic, not 'polar covalent'?",
        why:
          "ΔEN(O−Na) ≈ 3.5 − 0.9 = 2.6 (>1.7) and the actual electronic structure is Na⁺ + OH⁻. Ionic-bond classification is supported by both the EN difference rule of thumb and physical evidence (high mp, conductivity in solution).",
      },
    ],
    dataAnalysis: [
      {
        heading: "Polarity decision tree",
        bullets: [
          "Step 1: Are all bonds nonpolar? → molecule is nonpolar.",
          "Step 2: If polar bonds exist, draw 3D structure with VSEPR geometry.",
          "Step 3: Add bond-dipole vectors. Cancel if symmetric (linear, trigonal planar, tetrahedral with identical groups, square planar, trigonal bipyramidal/octahedral with identical ligands).",
          "Step 4: Net dipole exists → molecule is polar.",
        ],
      },
      {
        heading: "IR identification flow",
        bullets: [
          "Look for C=O at 1650-1750 — if present, you have a carbonyl class.",
          "Then check for O-H broad: + C=O = carboxylic acid; without C=O = alcohol.",
          "N-H stretches (often two for 1° NH₂): amine or amide (amide has C=O too).",
          "Absence of all of the above + C-H near 3000: hydrocarbon.",
        ],
      },
    ],
    errors: [
      {
        source: "Confusing C=O frequency between functional groups",
        effect: "Misidentifies aldehyde vs. ketone vs. ester (they differ by tens of cm⁻¹).",
        direction: "neutral",
      },
      {
        source: "Thinking polar bonds always give a polar molecule",
        effect: "Misclassifies CCl₄, CO₂, BF₃ as polar; they are not.",
        direction: "neutral",
      },
      {
        source: "Mis-numbering the carbon chain in IUPAC naming",
        effect: "Wrong locants → wrong name; the same structure can be named two correct ways but only one IUPAC-preferred way.",
        direction: "neutral",
      },
      {
        source: "Ignoring O-H broad band as 'noise'",
        effect: "Missed alcohol/acid identification.",
        direction: "neutral",
      },
    ],
    whyQA: [
      {
        q: "Why does the O-H stretch shift to broader/lower frequency when H-bonding is present?",
        a: "H-bonding lengthens the O-H bond slightly and adds a distribution of microenvironments → frequency drops and the peak broadens.",
      },
      {
        q: "Why is sulfur less electronegative than oxygen?",
        a: "Sulfur is below oxygen in group 16. Its valence shell is the n=3 shell (further from the nucleus, more shielded) → reduced attraction for electrons. EN drops down a group.",
      },
      {
        q: "Could you distinguish a carboxylic acid from an ester by IR alone?",
        a: "Yes — both have C=O, but the carboxylic acid also has a very broad O-H around 2500-3300 cm⁻¹ that the ester does not.",
      },
      {
        q: "Was it necessary to know exactly where the C=O peak falls (e.g., 1715 vs 1735 cm⁻¹) to identify a carbonyl?",
        a: "Not for whether it IS a carbonyl. The exact position helps tell which class of carbonyl it is.",
      },
      {
        q: "Why does C≡C absorb more weakly in IR than C=O?",
        a: "C≡C has a small or zero dipole moment derivative (especially for symmetric internal alkynes — IR-inactive). C=O has a large dipole change → strong absorption.",
      },
      {
        q: "Two molecules have formula C₂H₆O. One is ethanol, the other is dimethyl ether. How does IR differentiate?",
        a: "Ethanol shows a strong, broad O-H ~3300 cm⁻¹ from H-bonding. Dimethyl ether has no O-H, only C-H and C-O — no broad band in 3000-3600 region.",
      },
      {
        q: "Why is the dipole moment of NH₃ greater than that of NF₃ even though F is more electronegative than H?",
        a: "In NH₃ the N→H bond dipoles and the lone-pair dipole point the SAME way (toward N). In NF₃ the bond dipoles point AWAY from N (toward F) while the lone-pair dipole still points TOWARD the N — they partly cancel, giving a small net dipole.",
      },
    ],
    practice: [
      {
        q: "Identify the functional groups in 5-hydroxy-2-pentanone and predict whether the molecule is polar.",
        solution:
          "Structure: CH₃-CO-CH₂-CH₂-CH₂-OH. Functional groups: ketone (C=O at C2) and alcohol (-OH at C5). Both groups are polar; the geometry has no symmetry to cancel them. → POLAR molecule, with strong H-bonding ability through the OH (donor) and C=O (acceptor).",
      },
      {
        q: "Draw 3-methylbutanamide and identify all polar bonds.",
        solution:
          "Structure: (CH₃)₂CHCH₂C(=O)NH₂.\nPolar bonds: C=O (ΔEN 1.0), C-N (ΔEN 0.5), N-H (ΔEN 0.9). The C-H and C-C bonds are essentially nonpolar.\nThe molecule is polar overall (amide group is a strong dipole; not symmetric).",
      },
      {
        q: "An IR spectrum shows a strong band at 1720 cm⁻¹, a broad band centered around 3000 cm⁻¹ extending well into the C-H region, no N-H band. Likely class?",
        solution:
          "C=O at 1720 cm⁻¹ → carbonyl. Very broad O-H spanning 2500-3300 → CARBOXYLIC ACID (the broadening from cyclic H-bonded dimers is the diagnostic). The absence of N-H rules out amide.",
      },
      {
        q: "Order CHCl₃, CCl₄, and CH₃Cl by dipole moment, largest to smallest.",
        solution:
          "CH₃Cl: tetrahedral with 3 H's and 1 Cl → strong net dipole. μ ≈ 1.87 D.\nCHCl₃: 1 H + 3 Cl tetrahedral → bond dipoles partly cancel. μ ≈ 1.04 D.\nCCl₄: 4 identical Cl tetrahedral → bond dipoles cancel. μ = 0.\nOrder: CH₃Cl > CHCl₃ > CCl₄.",
      },
    ],
  },
];

// ------------------------------------------------------------
// REFERENCE SECTIONS
// ------------------------------------------------------------

const formulaGroups: { heading: string; items: { name: string; eq: string; note?: string }[] }[] =
  [
    {
      heading: "Solutions & stoichiometry",
      items: [
        { name: "Molarity", eq: "M = mol solute / L solution" },
        {
          name: "Dilution",
          eq: "M₁V₁ = M₂V₂",
          note: "Moles unchanged on dilution. Use any volume units as long as both sides match.",
        },
        { name: "Mass percent", eq: "%m = (mass solute / mass solution) × 100" },
        { name: "ppm (water, dilute)", eq: "ppm ≈ mg solute / L solution" },
        {
          name: "% yield",
          eq: "% yield = (actual / theoretical) × 100",
        },
      ],
    },
    {
      heading: "Acid-base equilibria",
      items: [
        { name: "Water ion product", eq: "Kw = [H⁺][OH⁻] = 1.0×10⁻¹⁴ at 25 °C" },
        { name: "pH / pOH", eq: "pH = −log[H⁺]; pOH = −log[OH⁻]; pH + pOH = 14 (25 °C)" },
        { name: "Ka·Kb relation", eq: "Ka · Kb = Kw" },
        { name: "Henderson-Hasselbalch", eq: "pH = pKa + log([A⁻]/[HA])" },
        {
          name: "% ionization",
          eq: "% ionization = ([H⁺]/[HA]₀) · 100",
        },
        {
          name: "Buffer pH after small acid added",
          eq: "Stoich first (A⁻ + H⁺ → HA); then plug NEW moles into HH.",
        },
      ],
    },
    {
      heading: "Equilibrium",
      items: [
        { name: "Equilibrium constant K (in terms of concentrations)", eq: "K = Π[products]^ν / Π[reactants]^ν" },
        { name: "Reaction quotient Q", eq: "Same form as K, but using current concentrations." },
        { name: "Q < K → forward", eq: "Q > K → reverse; Q = K → at equilibrium" },
        { name: "Ksp (sparingly soluble salt)", eq: "Ksp = product of ion concentrations, each raised to its stoich coefficient" },
        { name: "Ksp ↔ molar solubility", eq: "Ca(OH)₂: Ksp = 4s³; AgCl: Ksp = s²; PbI₂: Ksp = 4s³ (same as Ca(OH)₂)" },
      ],
    },
    {
      heading: "Thermodynamics",
      items: [
        { name: "Free energy", eq: "ΔG° = ΔH° − TΔS°" },
        { name: "ΔG° from K", eq: "ΔG° = −RT ln K  (R = 8.314 J/mol·K)" },
        { name: "Van't Hoff", eq: "ln K = −ΔH°/(RT) + ΔS°/R" },
        { name: "ΔG vs ΔG°", eq: "ΔG = ΔG° + RT ln Q (drive: ΔG < 0)" },
      ],
    },
    {
      heading: "Kinetics",
      items: [
        { name: "Generic rate law", eq: "rate = k [A]^m [B]^n" },
        { name: "0th order integrated", eq: "[A] = [A]₀ − k t;     plot [A] vs t linear" },
        { name: "1st order integrated", eq: "ln[A] = ln[A]₀ − k t;  plot ln[A] vs t linear" },
        { name: "2nd order integrated", eq: "1/[A] = 1/[A]₀ + k t;  plot 1/[A] vs t linear" },
        { name: "1st order half-life", eq: "t½ = ln 2 / k = 0.693 / k" },
        { name: "Arrhenius", eq: "k = A · exp(−Ea/RT);  ln k₂/k₁ = (Ea/R)(1/T₁ − 1/T₂)" },
      ],
    },
    {
      heading: "Electrochemistry",
      items: [
        { name: "Cell potential", eq: "E°_cell = E°_cathode − E°_anode" },
        { name: "Free energy", eq: "ΔG° = −nFE°_cell;   F = 96 485 C/mol" },
        { name: "K from E°", eq: "ln K = nF·E°_cell / (RT)" },
        { name: "Nernst (25 °C)", eq: "E = E° − (0.0592/n) log Q" },
        { name: "Faraday's law", eq: "moles e⁻ = It / F;   moles M = (It)/(nF);   m = (It·M)/(nF)" },
      ],
    },
    {
      heading: "Spectroscopy & gases",
      items: [
        { name: "Beer's Law", eq: "A = ε · b · c" },
        { name: "Photon energy", eq: "E = hν = hc/λ;   h = 6.626×10⁻³⁴ J·s, c = 3.00×10⁸ m/s" },
        { name: "Convenient form", eq: "E (kJ/mol) ≈ 1.196×10⁵ / λ(nm)" },
        { name: "Ideal gas", eq: "PV = nRT;   R = 0.0821 L·atm/(mol·K) = 8.314 J/(mol·K)" },
        { name: "Calorimetry", eq: "q = m·c·ΔT  (specific heat) or q = C·ΔT (heat capacity)" },
      ],
    },
  ];

const techniqueRows: [string, string, string][] = [
  ["10 mL volumetric flask", "10.00 ± 0.02 mL", "Use TC label; rinse with solvent first; mix at 75% then top-off to mark."],
  ["100 mL volumetric flask", "100.00 ± 0.08 mL", "Same workflow; bottom of meniscus on the etched line."],
  ["50 mL Class-A buret", "± 0.05 mL absolute; ± 0.02 mL between two readings", "Read to nearest 0.02 mL; eye level with meniscus; rinse with titrant before filling."],
  ["10 mL graduated cylinder", "± ½ smallest gradation", "Reads to ~0.05 mL — never use for high-precision analysis."],
  ["Volumetric (TD) pipet", "± 0.02 mL (10 mL TD)", "After dispensing, wait 2 s and touch off the last drop. Do NOT blow out a TD pipet."],
  ["TC / TD-EX pipet", "Calibrated to contain", "Blow out the last drop. Different from TD!"],
  ["Analytical balance", "± 0.0001 g", "Tare with weigh paper; use the same balance throughout an experiment."],
  ["Top-loading balance", "± 0.01 g", "Higher capacity (≤ 400 g); less precise — use only when 0.01 g is enough."],
  ["Thermometer", "± 0.2 °C", "Read at the bottom of the meniscus; let temperature equilibrate."],
  ["pH meter", "± 0.02 pH after 2-pt cal", "Calibrate at pH 4 + 7 for acidic samples; pH 7 + 10 for basic. Store electrode in pH 7 buffer."],
  ["Spectrometer", "Manufacturer-specific", "Warm up 10 min; calibrate against blank; cuvette in correct orientation; clean cuvette walls."],
];

const sigfigsRules: string[] = [
  "Multiplication / division: result has the SAME number of sig figs as the LEAST precise factor.",
  "Addition / subtraction: result keeps the SAME number of decimal places as the LEAST precise term.",
  "Logarithms (pH, pK, log K): the number of decimal places in the log equals the number of sig figs in the original number. pH 4.74 → [H⁺] = 1.8×10⁻⁵ M (2 sig figs).",
  "Exact numbers (counting, defined constants like F, exact factors of 1000) have infinite sig figs — they don't limit precision.",
  "Round only at the END; carry one or two extra digits during a multistep calculation.",
];

const errorPropRules: string[] = [
  "Addition / subtraction: absolute uncertainties add in quadrature. σ_C² = σ_A² + σ_B² when C = A ± B.",
  "Multiplication / division: relative uncertainties add in quadrature. (σ_C/C)² = (σ_A/A)² + (σ_B/B)² when C = AB or A/B.",
  "Power rule: σ(x^n)/x^n = |n| · σ(x)/x. For Ksp = 4s³, σ(Ksp)/Ksp = 3 σ(s)/s.",
  "Log: σ(log x) = (1/ln 10) · σ(x)/x ≈ 0.434 σ(x)/x.",
  "Anti-log (10^x): σ(10^x)/10^x = ln 10 · σ(x) ≈ 2.303 σ(x).",
];

const safetyRules: string[] = [
  "Goggles ALL the time — even when others are doing the chemistry.",
  "No food, drink, or makeup application in the lab.",
  "No open-toed shoes; wear long pants.",
  "Long hair tied back; loose sleeves rolled up.",
  "Know the location of the eyewash, safety shower, fire extinguisher, and fume hood.",
  "Add ACID to WATER (not water to acid) when diluting concentrated acids — the heat released is buffered by the larger water volume and prevents splattering.",
  "NaOH and other strong bases are caustic to skin and eyes; rinse with copious water for ≥15 min after exposure.",
  "Heat liquids in beakers/flasks — never in a closed container that could pressurize.",
  "Keep flammable solvents (ethanol, acetone, hexane) away from open flames; prefer hot plate over Bunsen burner when working with organics.",
  "Bromine, chlorine, NH₃ vapors, and HCl(g) — work in the fume hood.",
  "Never pipette by mouth; always use a pipet bulb or pump.",
  "Dispose of heavy metals (Pb, Cd, Cr, Co, Cu) in the labeled waste containers — never down the drain.",
  "Broken glass goes in the broken-glass bin; chemical waste in the chemical waste container.",
  "Notify TA immediately of any spill, injury, or unusual smell.",
];

const cramPlan: { day: string; focus: string; tasks: string[] }[] = [
  {
    day: "Day 1 (T-3 days) — Foundations",
    focus: "Fundamentals you should be able to recite without hesitation.",
    tasks: [
      "Memorize the 'Formulas you must know cold' section and self-quiz from it.",
      "Be able to write Beer's Law, Henderson-Hasselbalch, Nernst, ideal gas, q = mcΔT, and the integrated rate laws from memory.",
      "Practice a buffer-pH calculation (Method 1 vs. Method 2) and a strong-acid + buffer 'add HCl' problem.",
      "Drill: pH ↔ [H⁺] ↔ pOH ↔ [OH⁻] mental conversions for round-number pH values.",
    ],
  },
  {
    day: "Day 2 (T-2 days) — Kinetics + Equilibrium",
    focus: "Experiments 1, 2, 3, 4.",
    tasks: [
      "Re-derive m, n, k from a 3-trial method-of-initial-rates table by ratios.",
      "Identify reaction order from which integrated-rate-law plot is linear (Exp 2).",
      "Predict shift direction for 5 random LCP stresses (concentration, T, P, common ion, dilution).",
      "Walk through the BTB / pK_In analysis: ε from reference buffers → [HIn]/[In⁻] → log → linear plot.",
      "Practice problems: Exp 1, 2, 3, 4 in this guide. Aim for full credit on all of them with NO peeking.",
    ],
  },
  {
    day: "Day 3 (T-1 day) — Acid-Base + Thermo + Electrochem",
    focus: "Experiments 5, 6, 7, 8, 9.",
    tasks: [
      "Re-do a full titration analysis: V_eq → moles → [acid]; pH at V_½eq → pKa.",
      "Practice the polyprotic case: locate first two equivalences and pKa1, pKa2.",
      "Do one van't Hoff problem (two T's, two K's → ΔH°). Confirm the SIGN of ΔH° matches the trend in K.",
      "Build a galvanic cell from scratch: pick anode/cathode, write half-reactions, compute E° and ΔG°.",
      "Faraday's-law calculation: I, t, n → mass plated.",
      "Go through Exp 9 corrosion logic: identify anodic vs cathodic regions; sacrificial vs impressed-current.",
    ],
  },
  {
    day: "Day 4 (exam morning) — Coordination + Organic + Cross-cutting",
    focus: "Experiments 10, 11. Final reference review.",
    tasks: [
      "Spectrochemical series memorized: I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O < NH₃ < en < CN⁻ ≈ CO.",
      "Be able to compute Δ_o from λ_max in nm using the shortcut: Δ_o (kJ/mol) ≈ 1.196×10⁵/λ.",
      "Identify all 8 functional groups by structure and by IR signature (especially C=O, broad O-H of acids).",
      "Quick review of the LAB-TECHNIQUES table — especially uncertainty values, buret reading, and pH-meter calibration.",
      "Re-read the safety section once.",
      "Light review only — by now your strategy is to consolidate, not cram new material.",
      "Sleep and breakfast > extra hour of studying at 1 AM.",
    ],
  },
];

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function MathLine({ text }: { text: string }) {
  return <MathBlock>{text}</MathBlock>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <Stack gap={4}>
      {items.map((it, i) => (
        <Row key={i} gap={8} align="start">
          <Text tone="tertiary" style={{ minWidth: 12 }}>
            •
          </Text>
          <Text>{it}</Text>
        </Row>
      ))}
    </Stack>
  );
}

function Para({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <Stack gap={4}>
      {lines.map((line, i) => (
        <Text key={i}>
          <MixedText text={line} />
        </Text>
      ))}
    </Stack>
  );
}

function SubsectionView({ s }: { s: Subsection }) {
  return (
    <Stack gap={6}>
      <Text weight="semibold">{s.heading}</Text>
      {s.body && <Para text={s.body} />}
      {s.bullets && <Bullets items={s.bullets} />}
      {s.equations && (
        <Stack gap={4}>
          {s.equations.map((eq, i) => (
            <MathLine key={i} text={eq} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function PracticeCard({
  practice,
  storageKey,
  done,
  onToggleDone,
}: {
  practice: Practice;
  storageKey: string;
  done: boolean;
  onToggleDone: () => void;
}) {
  const [open, setOpen] = useCanvasState<boolean>(storageKey, false);
  return (
    <Stack gap={8}>
      <Para text={practice.q} />
      <Row gap={8} align="center" wrap>
        <Button
          variant={open ? "secondary" : "primary"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide solution" : "Show solution"}
        </Button>
        <Pill
          tone={done ? "success" : "neutral"}
          active={done}
          onClick={onToggleDone}
        >
          {done ? "✓ Done" : "Mark done"}
        </Pill>
      </Row>
      <div
        className="cs-practice-solution"
        hidden={!open}
        style={open ? undefined : { display: "none" }}
      >
        <Callout tone="success" title="Solution">
          <Para text={practice.solution} />
        </Callout>
      </div>
    </Stack>
  );
}

function ExperimentView({
  exp,
  prev,
  next,
  onNavigate,
  practiceDone,
  onTogglePracticeDone,
}: {
  exp: Experiment;
  prev?: Experiment;
  next?: Experiment;
  onNavigate: (id: string) => void;
  practiceDone: Record<string, boolean>;
  onTogglePracticeDone: (expId: string, idx: number) => void;
}) {
  const theme = useHostTheme();
  const totalPractice = exp.practice.length;
  const doneCount = exp.practice.reduce(
    (acc, _p, i) => acc + (practiceDone[`${exp.id}.${i}`] ? 1 : 0),
    0
  );
  return (
    <Stack gap={16}>
      <Stack gap={6}>
        <Row gap={8} align="center" wrap>
          <Pill tone="info" active>
            Experiment {exp.num}
          </Pill>
          <Text tone="secondary" size="small">
            {exp.short}
          </Text>
          {totalPractice > 0 && (
            <Pill
              tone={doneCount === totalPractice ? "success" : "neutral"}
              size="sm"
            >
              {doneCount}/{totalPractice} practice done
            </Pill>
          )}
        </Row>
        <H2>{exp.title}</H2>
        <Text tone="secondary" italic>
          {exp.oneLiner}
        </Text>
      </Stack>

      <Grid columns={2} gap={12}>
        <Card collapsible defaultOpen>
          <CardHeader>Learning objectives (concepts)</CardHeader>
          <CardBody>
            <Bullets items={exp.learningObjectives} />
          </CardBody>
        </Card>
        <Card collapsible defaultOpen>
          <CardHeader>Experimental objectives (what you did)</CardHeader>
          <CardBody>
            <Bullets items={exp.experimentalObjectives} />
          </CardBody>
        </Card>
      </Grid>

      <Card collapsible defaultOpen>
        <CardHeader trailing={<Pill tone="info" size="sm">Theory</Pill>}>
          Background theory
        </CardHeader>
        <CardBody>
          <Stack gap={14}>
            {exp.theory.map((s, i) => (
              <SubsectionView key={i} s={s} />
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader trailing={<Pill size="sm">Procedure</Pill>}>
          Procedure overview &mdash; the why behind each step
        </CardHeader>
        <CardBody>
          <Stack gap={12}>
            <Text weight="semibold">What you did</Text>
            <Bullets items={exp.procedure} />
            <Divider />
            <Text weight="semibold">Why it matters</Text>
            <Stack gap={10}>
              {exp.procedureWhy.map((p, i) => (
                <Stack key={i} gap={4}>
                  <Text weight="semibold" style={{ color: theme.accent.primary }}>
                    {p.step}
                  </Text>
                  <Para text={p.why} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader trailing={<Pill tone="info" size="sm">Analysis</Pill>}>
          Key data analysis
        </CardHeader>
        <CardBody>
          <Stack gap={14}>
            {exp.dataAnalysis.map((s, i) => (
              <SubsectionView key={i} s={s} />
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader trailing={<Pill tone="warning" size="sm">Errors</Pill>}>
          Common sources of error
        </CardHeader>
        <CardBody>
          <Table
            headers={["Source", "Effect on the result", "Direction"]}
            columnAlign={["left", "left", "center"]}
            rows={exp.errors.map((e) => [
              e.source,
              e.effect,
              e.direction === "high"
                ? "↑ HIGH"
                : e.direction === "low"
                ? "↓ LOW"
                : e.direction === "either"
                ? "± either"
                : e.direction === "neutral"
                ? "info"
                : "—",
            ])}
            rowTone={exp.errors.map((e) =>
              e.direction === "high" || e.direction === "low"
                ? ("warning" as const)
                : e.direction === "neutral"
                ? ("info" as const)
                : undefined
            )}
          />
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader trailing={<Pill size="sm">Q&amp;A</Pill>}>
          &quot;Why does this work?&quot; &mdash; anticipating Skibo&apos;s style
        </CardHeader>
        <CardBody>
          <Stack gap={14}>
            {exp.whyQA.map((qa, i) => (
              <Stack key={i} gap={4}>
                <Text weight="semibold" style={{ color: theme.accent.primary }}>
                  Q{i + 1}. {qa.q}
                </Text>
                <Para text={qa.a} />
              </Stack>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader trailing={<Pill tone="success" size="sm">Practice</Pill>}>
          Practice problems
        </CardHeader>
        <CardBody>
          <Stack gap={18}>
            {exp.practice.map((p, i) => (
              <Stack key={i} gap={6}>
                <Text weight="semibold">Problem {i + 1}</Text>
                <PracticeCard
                  practice={p}
                  storageKey={`solution.${exp.id}.${i}`}
                  done={!!practiceDone[`${exp.id}.${i}`]}
                  onToggleDone={() => onTogglePracticeDone(exp.id, i)}
                />
                {i < exp.practice.length - 1 && <Divider />}
              </Stack>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Row gap={10} align="center" justify="between" wrap>
        <Button
          variant="secondary"
          onClick={() => prev && onNavigate(prev.id)}
        >
          {prev ? `← Prev: ${prev.num}. ${prev.short}` : "← Prev"}
        </Button>
        <Text tone="tertiary" size="small">
          Experiment {exp.num} of {experiments.length}
        </Text>
        <Button
          variant="secondary"
          onClick={() => next && onNavigate(next.id)}
        >
          {next ? `Next: ${next.num}. ${next.short} →` : "Next →"}
        </Button>
      </Row>
    </Stack>
  );
}

// ------------------------------------------------------------
// REFERENCE PANES
// ------------------------------------------------------------

function FormulasPane() {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Formulas you must know cold</H2>
        <Text tone="secondary">
          Skibo expects fluency with these. Don&apos;t look them up during the exam &mdash; have them in working memory.
        </Text>
      </Stack>
      {formulaGroups.map((g, i) => (
        <Stack key={i} gap={8}>
          <H2>{g.heading}</H2>
          <Table
            headers={["Quantity", "Formula", "Note"]}
            columnAlign={["left", "left", "left"]}
            rows={g.items.map((it) => [
              <Text weight="semibold">{it.name}</Text>,
              <Math>{it.eq}</Math>,
              it.note ?? "",
            ])}
          />
        </Stack>
      ))}
    </Stack>
  );
}

function TechniquesPane() {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Lab techniques cheat sheet</H2>
        <Text tone="secondary">
          Glassware tolerances, pH-meter calibration, spectrometer protocol, sig-fig and error-propagation rules &mdash; all the procedural facts a 'random question' might fish for.
        </Text>
      </Stack>

      <H2>Glassware &amp; instrument tolerances</H2>
      <Table
        headers={["Instrument", "Precision / spec", "How to use"]}
        columnAlign={["left", "left", "left"]}
        rows={techniqueRows.map((r) => [
          <Text weight="semibold">{r[0]}</Text>,
          <Code>{r[1]}</Code>,
          r[2],
        ])}
      />

      <H2>Buret reading</H2>
      <Stack gap={6}>
        <Text>
          Read to the nearest <Code>0.02 mL</Code>. Eye level with the bottom of the meniscus.
          Mentally split the space between two marked gradations into halves; if the meniscus
          sits in the upper half closer to the mark, that&apos;s 0.02 past; if closer to the
          midline, 0.04; etc. Class-A 50 mL burets are accurate to ±0.05 mL absolute, but a
          DIFFERENCE between two readings is good to ±0.02 mL.
        </Text>
      </Stack>

      <H2>pH meter calibration</H2>
      <Bullets
        items={[
          "Always 2-point: pH 7 + pH 4 for acidic samples, pH 7 + pH 10 for basic.",
          "Rinse electrode with DI water and BLOT (don't wipe with pressure) between solutions.",
          "Store electrode in pH 7 buffer between uses; never let it dry out.",
          "Tip immersed ~1 inch in solution; let reading stabilize before recording.",
        ]}
      />

      <H2>Spectrometer</H2>
      <Bullets
        items={[
          "Warm up ~10 min before use (lamp stability).",
          "Calibrate against a blank cuvette filled with the same solvent (usually DI water).",
          "Cuvette in correct orientation: light through the long, polished sides (1.000 cm path).",
          "Wipe cuvette walls — fingerprints scatter light and inflate A.",
          "Keep A in 0.2-1.0 range for best linearity (Beer's Law).",
          "At λ_max, sensitivity is highest and small wavelength drift matters least.",
        ]}
      />

      <H2>Significant figures</H2>
      <Bullets items={sigfigsRules} />

      <H2>Error propagation</H2>
      <Bullets items={errorPropRules} />

      <H2>Linear regression with LINEST</H2>
      <Bullets
        items={[
          "Pick the appropriate plot for the analysis (e.g. ln A vs. t for 1st order kinetics).",
          "Use only the LINEAR portion of the data; plot residuals to confirm linearity.",
          "LINEST returns slope, intercept, σ_slope, σ_intercept, and R².",
          "R² close to 1 is necessary but NOT sufficient — eyeball the residuals to spot curvature.",
          "Slope's physical meaning depends on the plot: e.g., −k_obs (1st order), −Ea/R (Arrhenius), −ΔH°/R (van't Hoff), 1 (HH plot), Ksp(s) functional, etc.",
        ]}
      />
    </Stack>
  );
}

function SafetyPane() {
  return (
    <Stack gap={14}>
      <Stack gap={4}>
        <H2>Safety &amp; general lab knowledge</H2>
        <Text tone="secondary">
          Must-know facts for any pre-lab quiz or lab-knowledge multiple choice question.
        </Text>
      </Stack>
      <Callout tone="warning" title="If something goes wrong">
        Notify the TA immediately. Eyewash and safety shower locations should be known BEFORE
        you set up any glassware. For acid splash on skin, rinse with copious water for ≥15 min.
      </Callout>
      <Bullets items={safetyRules} />

      <H2>Common reactivity reminders</H2>
      <Bullets
        items={[
          "Concentrated acids and bases generate heat when mixed with water — add ACID to WATER, never the reverse.",
          "Reactions producing gas (H₂, CO₂, O₂, NO₂, Cl₂) should be done in the hood or with a vented apparatus.",
          "Strong oxidizers (KMnO₄, H₂O₂, NaOCl) react vigorously with reducing agents, organics, and even paper towels.",
          "Heavy-metal salts (Pb²⁺, Cd²⁺, Cr⁶⁺) are toxic; collect waste separately from sink-disposal.",
          "Phenolphthalein is OK as an indicator but do not ingest; bromothymol blue is non-hazardous in dilute solutions.",
          "Acetone and ethanol are flammable solvents; close caps when not pouring.",
        ]}
      />
    </Stack>
  );
}

function CramPane() {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Last-48-hours cram plan</H2>
        <Text tone="secondary">
          A concrete day-by-day plan for the 4 days remaining. Don&apos;t learn new material on day 4; consolidate.
        </Text>
      </Stack>
      {cramPlan.map((d, i) => (
        <Card key={i} collapsible defaultOpen={i === 0}>
          <CardHeader trailing={<Pill tone="info" size="sm">{d.focus}</Pill>}>
            {d.day}
          </CardHeader>
          <CardBody>
            <Bullets items={d.tasks} />
          </CardBody>
        </Card>
      ))}
      <Callout tone="info" title="Exam-day strategy">
        <Stack gap={6}>
          <Text>
            60 min, 40 pts → ~1.5 min per point. Read the entire exam first; do the
            calculations you&apos;re fastest at FIRST so you bank points.
          </Text>
          <Text>
            On free response: write the relevant equation, plug in numbers WITH units, then
            evaluate. Even partial credit comes from showing the right setup.
          </Text>
          <Text>
            On multiple choice: eliminate impossible answers (sign, units, order of magnitude)
            before solving in detail.
          </Text>
        </Stack>
      </Callout>
    </Stack>
  );
}

// ------------------------------------------------------------
// NAV
// ------------------------------------------------------------

type NavItem = { id: string; label: string; group: "experiment" | "reference" };

const navItems: NavItem[] = [
  ...experiments.map((e) => ({
    id: e.id,
    label: `${e.num}. ${e.short}`,
    group: "experiment" as const,
  })),
  { id: "ref-formulas", label: "Formulas", group: "reference" },
  { id: "ref-techniques", label: "Lab techniques", group: "reference" },
  { id: "ref-safety", label: "Safety", group: "reference" },
  { id: "ref-cram", label: "Cram plan", group: "reference" },
];

const validSectionIds = new Set(navItems.map((n) => n.id));

// ------------------------------------------------------------
// SEARCH INDEX
// ------------------------------------------------------------

type SearchEntry = {
  sectionId: string;
  sectionLabel: string;
  group: "experiment" | "reference";
  context: string;
  text: string;
};

const searchIndex: SearchEntry[] = (() => {
  const out: SearchEntry[] = [];
  for (const exp of experiments) {
    const meta = {
      sectionId: exp.id,
      sectionLabel: `${exp.num}. ${exp.short}`,
      group: "experiment" as const,
    };
    out.push({ ...meta, context: "Title", text: exp.title });
    out.push({ ...meta, context: "Summary", text: exp.oneLiner });
    exp.learningObjectives.forEach((b) =>
      out.push({ ...meta, context: "Learning objective", text: b })
    );
    exp.experimentalObjectives.forEach((b) =>
      out.push({ ...meta, context: "Experimental objective", text: b })
    );
    exp.theory.forEach((t) => {
      const ctx = `Theory · ${t.heading}`;
      if (t.body) out.push({ ...meta, context: ctx, text: t.body });
      t.bullets?.forEach((b) => out.push({ ...meta, context: ctx, text: b }));
      t.equations?.forEach((eq) =>
        out.push({ ...meta, context: `${ctx} (eq)`, text: eq })
      );
    });
    exp.procedure.forEach((p) =>
      out.push({ ...meta, context: "Procedure", text: p })
    );
    exp.procedureWhy.forEach((p) =>
      out.push({ ...meta, context: `Procedure · ${p.step}`, text: p.why })
    );
    exp.dataAnalysis.forEach((t) => {
      const ctx = `Analysis · ${t.heading}`;
      if (t.body) out.push({ ...meta, context: ctx, text: t.body });
      t.bullets?.forEach((b) => out.push({ ...meta, context: ctx, text: b }));
      t.equations?.forEach((eq) =>
        out.push({ ...meta, context: `${ctx} (eq)`, text: eq })
      );
    });
    exp.errors.forEach((e) =>
      out.push({
        ...meta,
        context: "Common error",
        text: `${e.source}: ${e.effect}`,
      })
    );
    exp.whyQA.forEach((qa, i) => {
      out.push({ ...meta, context: `Q${i + 1}`, text: qa.q });
      out.push({ ...meta, context: `Q${i + 1} answer`, text: qa.a });
    });
    exp.practice.forEach((p, i) => {
      out.push({ ...meta, context: `Practice ${i + 1}`, text: p.q });
      out.push({
        ...meta,
        context: `Practice ${i + 1} solution`,
        text: p.solution,
      });
    });
  }

  const refMeta = (id: string, label: string) => ({
    sectionId: id,
    sectionLabel: label,
    group: "reference" as const,
  });

  formulaGroups.forEach((g) =>
    g.items.forEach((it) =>
      out.push({
        ...refMeta("ref-formulas", "Formulas"),
        context: g.heading,
        text: `${it.name} · ${it.eq}${it.note ? " · " + it.note : ""}`,
      })
    )
  );
  techniqueRows.forEach((r) =>
    out.push({
      ...refMeta("ref-techniques", "Lab techniques"),
      context: r[0],
      text: `${r[1]} — ${r[2]}`,
    })
  );
  sigfigsRules.forEach((r) =>
    out.push({
      ...refMeta("ref-techniques", "Lab techniques"),
      context: "Sig figs",
      text: r,
    })
  );
  errorPropRules.forEach((r) =>
    out.push({
      ...refMeta("ref-techniques", "Lab techniques"),
      context: "Error propagation",
      text: r,
    })
  );
  safetyRules.forEach((r) =>
    out.push({
      ...refMeta("ref-safety", "Safety"),
      context: "Safety rule",
      text: r,
    })
  );
  cramPlan.forEach((d) =>
    d.tasks.forEach((t) =>
      out.push({
        ...refMeta("ref-cram", "Cram plan"),
        context: d.day,
        text: t,
      })
    )
  );
  return out;
})();

function searchEntries(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return searchIndex.filter((e) => {
    const hay = (e.text + " " + e.context).toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}

// ------------------------------------------------------------
// HOOKS
// ------------------------------------------------------------

function useHashSection(
  section: string,
  setSection: (id: string) => void
): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromHash = window.location.hash.replace(/^#\/?/, "");
    if (fromHash && validSectionIds.has(fromHash) && fromHash !== section) {
      setSection(fromHash);
    }
    const onHashChange = () => {
      const next = window.location.hash.replace(/^#\/?/, "");
      if (next && validSectionIds.has(next)) setSection(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const desired = "#" + section;
    if (window.location.hash !== desired) {
      const url = window.location.pathname + window.location.search + desired;
      window.history.replaceState(null, "", url);
    }
  }, [section]);
}

type ThemeMode = "auto" | "light" | "dark";

function useThemeMode(): [ThemeMode, () => void] {
  const [mode, setMode] = useCanvasState<ThemeMode>("theme-mode", "auto");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (mode === "auto") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = mode;
    }
    root.dispatchEvent(new CustomEvent("themechange"));
  }, [mode]);
  const cycle = useCallback(() => {
    setMode((m) => (m === "auto" ? "light" : m === "light" ? "dark" : "auto"));
  }, [setMode]);
  return [mode, cycle];
}

function useGlobalKeyboardShortcuts({
  prev,
  next,
  openSearch,
}: {
  prev: () => void;
  next: () => void;
  openSearch: () => void;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTextInput = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
        return;
      }
      if (isTextInput(e.target)) return;
      if (e.key === "/") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "ArrowLeft" || e.key === "j") {
        prev();
      } else if (e.key === "ArrowRight" || e.key === "k") {
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, openSearch]);
}

// ------------------------------------------------------------
// SEARCH OVERLAY
// ------------------------------------------------------------

function highlightMatches(text: string, query: string): ReactNode {
  const q = query.trim();
  if (q.length < 2) return text;
  const parts = q.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return text;
  const pattern = new RegExp(
    "(" + parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")",
    "gi"
  );
  const segments = text.split(pattern);
  return segments.map((seg, i) =>
    pattern.test(seg) ? (
      <mark key={i} className="cs-search-mark">
        {seg}
      </mark>
    ) : (
      <span key={i}>{seg}</span>
    )
  );
}

function SearchOverlay({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const theme = useHostTheme();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const grouped = useMemo(() => {
    const matches = searchEntries(query).slice(0, 80);
    const groups = new Map<
      string,
      { sectionId: string; sectionLabel: string; entries: SearchEntry[] }
    >();
    for (const m of matches) {
      const g = groups.get(m.sectionId);
      if (g) {
        if (g.entries.length < 6) g.entries.push(m);
      } else {
        groups.set(m.sectionId, {
          sectionId: m.sectionId,
          sectionLabel: m.sectionLabel,
          entries: [m],
        });
      }
    }
    return Array.from(groups.values()).slice(0, 8);
  }, [query]);

  const totalMatches = grouped.reduce((a, g) => a + g.entries.length, 0);

  return (
    <div
      ref={overlayRef}
      className="cs-search-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="cs-search-panel"
        style={{
          background: theme.fill.primary,
          color: theme.text.primary,
          border: `1px solid ${theme.stroke.secondary}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          className="cs-search-input-wrap"
          style={{ borderBottom: `1px solid ${theme.stroke.tertiary}` }}
        >
          <span aria-hidden="true" style={{ color: theme.text.tertiary }}>
            ⌕
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search experiments, formulas, errors, practice…"
            className="cs-search-input"
            style={{ color: theme.text.primary }}
          />
          <kbd
            style={{
              background: theme.fill.tertiary,
              color: theme.text.tertiary,
              border: `1px solid ${theme.stroke.tertiary}`,
            }}
          >
            Esc
          </kbd>
        </div>
        <div className="cs-search-results">
          {query.trim().length < 2 ? (
            <div className="cs-search-empty" style={{ color: theme.text.tertiary }}>
              Type at least 2 characters. Use <kbd>↵</kbd> to jump,{" "}
              <kbd>Esc</kbd> to close.
            </div>
          ) : totalMatches === 0 ? (
            <div className="cs-search-empty" style={{ color: theme.text.tertiary }}>
              No matches.
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.sectionId} className="cs-search-group">
                <div
                  className="cs-search-group-label"
                  style={{ color: theme.text.tertiary }}
                >
                  {g.sectionLabel}
                </div>
                {g.entries.map((entry, i) => (
                  <button
                    key={i}
                    type="button"
                    className="cs-search-item"
                    onClick={() => {
                      onNavigate(entry.sectionId);
                      onClose();
                    }}
                    style={{ color: theme.text.primary }}
                  >
                    <div
                      className="cs-search-item-context"
                      style={{ color: theme.text.tertiary }}
                    >
                      {entry.context}
                    </div>
                    <div className="cs-search-item-text">
                      {highlightMatches(entry.text, query)}
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// ROOT COMPONENT
// ------------------------------------------------------------

export default function StudyGuide() {
  const theme = useHostTheme();
  const [section, setSection] = useCanvasState<string>("section", "exp1");
  const [reviewed, setReviewed] = useCanvasState<Record<string, boolean>>(
    "reviewed",
    {}
  );
  const [practiceDone, setPracticeDone] = useCanvasState<
    Record<string, boolean>
  >("practice-done", {});
  const [themeMode, cycleThemeMode] = useThemeMode();
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useCallback(
    (id: string) => {
      if (!validSectionIds.has(id)) return;
      setSection(id);
      if (typeof window !== "undefined") {
        const url =
          window.location.pathname + window.location.search + "#" + id;
        window.history.pushState(null, "", url);
      }
    },
    [setSection]
  );

  useHashSection(section, setSection);

  const togglePracticeDone = useCallback(
    (expId: string, idx: number) => {
      const k = `${expId}.${idx}`;
      setPracticeDone((p) => ({ ...p, [k]: !p[k] }));
    },
    [setPracticeDone]
  );

  const toggleReviewed = (id: string) =>
    setReviewed((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalExp = experiments.length;
  const reviewedCount = experiments.filter((e) => reviewed[e.id]).length;

  const currentExp = experiments.find((e) => e.id === section);
  const currentIdx = experiments.findIndex((e) => e.id === section);
  const prevExp =
    currentIdx > 0 ? experiments[currentIdx - 1] : undefined;
  const nextExp =
    currentIdx >= 0 && currentIdx < experiments.length - 1
      ? experiments[currentIdx + 1]
      : undefined;

  const goPrev = useCallback(() => {
    const idx = navItems.findIndex((n) => n.id === section);
    if (idx > 0) navigate(navItems[idx - 1].id);
  }, [section, navigate]);
  const goNext = useCallback(() => {
    const idx = navItems.findIndex((n) => n.id === section);
    if (idx >= 0 && idx < navItems.length - 1) navigate(navItems[idx + 1].id);
  }, [section, navigate]);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useGlobalKeyboardShortcuts({
    prev: goPrev,
    next: goNext,
    openSearch,
  });

  const themeLabel =
    themeMode === "auto"
      ? "Theme: Auto"
      : themeMode === "light"
      ? "Theme: Light"
      : "Theme: Dark";
  const themeIcon =
    themeMode === "auto" ? "◐" : themeMode === "light" ? "☀" : "☾";

  const [printMode, setPrintMode] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const before = () => setPrintMode(true);
    const after = () => setPrintMode(false);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <Stack gap={20}>
      <Stack gap={6}>
        <Row gap={10} align="center" wrap>
          <Pill tone="info" active>
            CHEM 105B Lab Final
          </Pill>
          <Text tone="secondary" size="small">
            USC &middot; Dr. Skibo &middot; 60 min &middot; 40 pts &middot; Experiments 1-11
          </Text>
        </Row>
        <H1>Lab Final Study Guide</H1>
        <Text tone="secondary">
          Comprehensive review of every experiment plus cross-cutting reference. Use the
          sidebar to jump around (or press <Code>⌘K</Code> / <Code>/</Code> to search). Each
          experiment has collapsible sections; practice problems have hide / show solutions.
        </Text>
      </Stack>

      <Grid columns={4} gap={16}>
        <Stat value={`${totalExp}`} label="Experiments" />
        <Stat
          value={`${reviewedCount}`}
          label="Marked reviewed"
          tone={reviewedCount === totalExp ? "success" : "info"}
        />
        <Stat value="40" label="Exam points" />
        <Stat value="60" label="Exam minutes" tone="warning" />
      </Grid>

      <Divider />

      <Grid columns="240px 1fr" gap={20} align="start">
        <Stack gap={12}>
          <Row gap={6} align="center" wrap>
            <Button variant="secondary" onClick={openSearch}>
              ⌕ Search…
            </Button>
            <Button
              variant="ghost"
              onClick={cycleThemeMode}
              title={themeLabel}
            >
              {themeIcon}
            </Button>
          </Row>
          <Stack gap={6}>
            <Text weight="semibold" tone="secondary" size="small">
              EXPERIMENTS
            </Text>
            <Stack gap={6}>
              {navItems
                .filter((n) => n.group === "experiment")
                .map((n) => {
                  const exp = experiments.find((e) => e.id === n.id)!;
                  const isActive = section === n.id;
                  const isReviewed = !!reviewed[n.id];
                  return (
                    <Row key={n.id} gap={6} align="center">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Pill
                          active={isActive}
                          tone={isReviewed ? "success" : "neutral"}
                          onClick={() => navigate(n.id)}
                          style={{ width: "100%", justifyContent: "flex-start" }}
                        >
                          {n.label}
                        </Pill>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleReviewed(exp.id)}
                        title={
                          isReviewed
                            ? "Mark as not reviewed"
                            : "Mark as reviewed"
                        }
                        style={{
                          background: "transparent",
                          border: `1px solid ${theme.stroke.tertiary}`,
                          color: isReviewed
                            ? theme.accent.primary
                            : theme.text.tertiary,
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          cursor: "pointer",
                          padding: 0,
                          fontSize: 12,
                          lineHeight: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isReviewed ? "✓" : ""}
                      </button>
                    </Row>
                  );
                })}
            </Stack>
          </Stack>

          <Stack gap={6}>
            <Text weight="semibold" tone="secondary" size="small">
              REFERENCE
            </Text>
            <Stack gap={6}>
              {navItems
                .filter((n) => n.group === "reference")
                .map((n) => (
                  <Pill
                    key={n.id}
                    active={section === n.id}
                    onClick={() => navigate(n.id)}
                    style={{ width: "100%", justifyContent: "flex-start" }}
                  >
                    {n.label}
                  </Pill>
                ))}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap={6}>
            <Text weight="semibold" tone="secondary" size="small">
              PROGRESS
            </Text>
            <Text size="small">
              {reviewedCount} of {totalExp} experiments reviewed
            </Text>
            <div
              style={{
                height: 6,
                background: theme.fill.tertiary,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(reviewedCount / totalExp) * 100}%`,
                  background: theme.accent.primary,
                  transition: "width 0.2s ease",
                }}
              />
            </div>
            {reviewedCount > 0 && (
              <Button
                variant="ghost"
                onClick={() => setReviewed({})}
              >
                Reset progress
              </Button>
            )}
          </Stack>
        </Stack>

        <div>
          {printMode ? (
            <>
              {experiments.map((e, i) => (
                <div key={e.id} className="cs-print-section">
                  <ExperimentView
                    exp={e}
                    prev={i > 0 ? experiments[i - 1] : undefined}
                    next={
                      i < experiments.length - 1
                        ? experiments[i + 1]
                        : undefined
                    }
                    onNavigate={navigate}
                    practiceDone={practiceDone}
                    onTogglePracticeDone={togglePracticeDone}
                  />
                </div>
              ))}
              <div className="cs-print-section">
                <FormulasPane />
              </div>
              <div className="cs-print-section">
                <TechniquesPane />
              </div>
              <div className="cs-print-section">
                <SafetyPane />
              </div>
              <div className="cs-print-section">
                <CramPane />
              </div>
            </>
          ) : (
            <>
              {currentExp && (
                <ExperimentView
                  exp={currentExp}
                  prev={prevExp}
                  next={nextExp}
                  onNavigate={navigate}
                  practiceDone={practiceDone}
                  onTogglePracticeDone={togglePracticeDone}
                />
              )}
              {section === "ref-formulas" && <FormulasPane />}
              {section === "ref-techniques" && <TechniquesPane />}
              {section === "ref-safety" && <SafetyPane />}
              {section === "ref-cram" && <CramPane />}
            </>
          )}
        </div>
      </Grid>

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onNavigate={navigate}
        />
      )}
    </Stack>
  );
}

