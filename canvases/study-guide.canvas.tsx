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
} from "cursor/canvas";
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
          "\\text{rate} = -\\tfrac{1}{2}\\,\\frac{d[H₂O₂]}{dt} = +\\frac{d[O₂]}{dt}",
        ],
      },
      {
        heading: "Rate law",
        body:
          "The rate law is determined experimentally and need NOT match the stoichiometric coefficients:",
        equations: ["\\text{rate} = k\\,[H₂O₂]^{m}\\,[I⁻]^{n}"],
      },
      {
        heading: "Method of initial rates",
        body:
          "Run two trials in which only one concentration changes between them. Then m and n are extracted from ratios:",
        equations: [
          "\\frac{\\text{rate}_2}{\\text{rate}_1} = \\left(\\frac{[H₂O₂]_2}{[H₂O₂]_1}\\right)^{m} \\quad (\\text{with } [\\mathrm{I^-}] \\text{ fixed})",
          "\\frac{\\text{rate}_3}{\\text{rate}_1} = \\left(\\frac{[I⁻]_3}{[I⁻]_1}\\right)^{n} \\quad (\\text{with } [\\mathrm{H_2O_2}] \\text{ fixed})",
        ],
      },
      {
        heading: "Connecting V(O₂) to moles and rate",
        body:
          "Using the ideal-gas law at room T and atmospheric P, n_O₂ = PV/RT. A plot of n_O₂ vs. time has slope = d(n_O₂)/dt, which equals the rate of O₂ formation in moles/s. Divide by the reaction-vessel volume to get rate in M/s.",
        equations: [
          "PV = nRT",
          "\\text{rate} = \\frac{1}{V_{\\text{solution}}} \\cdot \\frac{d(n_{O_2})}{dt}",
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
        equations: ["n_{O_2} = \\frac{P \\cdot V}{R \\cdot T}"],
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
          "m = \\dfrac{\\log\\!\\left(\\text{rate}_2/\\text{rate}_1\\right)}{\\log\\!\\left([H₂O₂]_2/[H₂O₂]_1\\right)}",
          "n = \\dfrac{\\log\\!\\left(\\text{rate}_3/\\text{rate}_1\\right)}{\\log\\!\\left([I⁻]_3/[I⁻]_1\\right)}",
          "k = \\dfrac{\\text{rate}}{[H₂O₂]^{m}\\,[I⁻]^{n}}",
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
        equations: ["A = \\varepsilon \\cdot b \\cdot c"],
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
          "\\text{0th order:}\\quad [A] = [A]_0 - k_{\\text{obs}}\\,t \\quad\\text{(}A\\text{ vs. }t\\text{ linear)}",
          "\\text{1st order:}\\quad \\ln[A] = \\ln[A]_0 - k_{\\text{obs}}\\,t \\quad\\text{(}\\ln A\\text{ vs. }t\\text{ linear)}",
          "\\text{2nd order:}\\quad \\frac{1}{[A]} = \\frac{1}{[A]_0} + k_{\\text{obs}}\\,t \\quad\\text{(}1/A\\text{ vs. }t\\text{ linear)}",
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
        equations: ["t_{1/2} = \\frac{\\ln 2}{k_{\\text{obs}}} \\approx \\frac{0.693}{k_{\\text{obs}}}"],
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
        equations: ["n = \\dfrac{\\log\\!\\left(k_{\\text{obs},2}/k_{\\text{obs},1}\\right)}{\\log\\!\\left([bleach]_2/[bleach]_1\\right)}"],
      },
      {
        heading: "True k from k_obs",
        equations: ["k_{\\text{true}} = \\frac{k_{\\text{obs}}}{[bleach]^{n}}"],
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
          "Q = \\frac{\\prod[\\text{products}]^{\\nu}}{\\prod[\\text{reactants}]^{\\nu}}",
          "Q < K \\;\\Rightarrow\\; \\text{shifts forward (toward products)}",
          "Q > K \\;\\Rightarrow\\; \\text{shifts backward (toward reactants)}",
          "Q = K \\;\\Rightarrow\\; \\text{no shift (at equilibrium)}",
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
          "\\mathrm{HIn}\\,(\\text{yellow}) \\rightleftharpoons \\mathrm{H^+} + \\mathrm{In^-}\\,(\\text{blue})",
          "K_{\\text{In}} = \\frac{[\\mathrm{H^+}]\\,[\\mathrm{In^-}]}{[\\mathrm{HIn}]}",
          "\\mathrm{p}K_{\\text{In}} = \\mathrm{pH} + \\log\\frac{[\\mathrm{HIn}]}{[\\mathrm{In^-}]} = \\mathrm{pH} - \\log\\frac{[\\mathrm{In^-}]}{[\\mathrm{HIn}]}",
        ],
      },
      {
        heading: "Henderson-Hasselbalch reformulation",
        equations: [
          "\\mathrm{pH} = \\mathrm{p}K_{\\text{In}} + \\log\\frac{[\\mathrm{In^-}]}{[\\mathrm{HIn}]}",
        ],
        body:
          "When [In⁻] = [HIn], the log term is 0 and pH = pK_In — that pH is where the indicator color is the midpoint between yellow and blue (green).",
      },
      {
        heading: "Beer's Law at two wavelengths",
        body:
          "At λ_HIn (~430 nm) HIn absorbs strongly, In⁻ does not (or barely). At λ_In⁻ (~615 nm) In⁻ absorbs strongly, HIn does not. So A(430) ∝ [HIn], A(615) ∝ [In⁻].",
        equations: [
          "A_{\\mathrm{HIn}} = \\varepsilon_{\\mathrm{HIn}} \\cdot b \\cdot [\\mathrm{HIn}]",
          "A_{\\mathrm{In^-}} = \\varepsilon_{\\mathrm{In^-}} \\cdot b \\cdot [\\mathrm{In^-}]",
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
          "[\\mathrm{HIn}] = \\frac{A(\\lambda_{\\mathrm{HIn}})}{\\varepsilon_{\\mathrm{HIn}} \\cdot b}",
          "[\\mathrm{In^-}] = \\frac{A(\\lambda_{\\mathrm{In^-}})}{\\varepsilon_{\\mathrm{In^-}} \\cdot b}",
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
          "K_a = \\frac{[\\mathrm{H^+}]\\,[\\mathrm{A^-}]}{[\\mathrm{HA}]}",
          "\\mathrm{pH} = \\mathrm{p}K_a + \\log\\frac{[\\mathrm{A^-}]}{[\\mathrm{HA}]}",
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
          "\\mathrm{H_3PO_4} \\rightleftharpoons \\mathrm{H^+} + \\mathrm{H_2PO_4^-} \\qquad \\mathrm{p}K_{a1} \\approx 2.15",
          "\\mathrm{H_2PO_4^-} \\rightleftharpoons \\mathrm{H^+} + \\mathrm{HPO_4^{2-}} \\qquad \\mathrm{p}K_{a2} \\approx 7.20",
          "\\mathrm{HPO_4^{2-}} \\rightleftharpoons \\mathrm{H^+} + \\mathrm{PO_4^{3-}} \\qquad \\mathrm{p}K_{a3} \\approx 12.35",
        ],
        body:
          "First two equivalence points are sharp. The third is obscured because pKa3 is so close to that of water.",
      },
      {
        heading: "Concentration from equivalence volume",
        equations: [
          "\\text{moles acid} = M_{\\mathrm{NaOH}} \\cdot V_{\\text{eq}} \\quad \\text{(monoprotic)}",
          "\\text{moles HOAc} = M_{\\mathrm{NaOH}} \\cdot V_{\\text{eq}}",
          "[\\mathrm{HOAc}]_0 = \\frac{\\text{moles}}{V_{\\text{acid, initial}}}",
          "\\text{for } \\mathrm{H_3PO_4} \\text{ to first eq:} \\quad \\text{moles } \\mathrm{H_3PO_4} = M_{\\mathrm{NaOH}} \\cdot V_{\\text{eq},1}",
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
          "\\mathrm{Ca(OH)_2}(s) \\rightleftharpoons \\mathrm{Ca^{2+}}(aq) + 2\\,\\mathrm{OH^-}(aq)",
          "K_{\\mathrm{sp}} = [\\mathrm{Ca^{2+}}]\\,[\\mathrm{OH^-}]^{2}",
          "\\text{If } s = \\text{molar solubility, then } [\\mathrm{Ca^{2+}}] = s,\\; [\\mathrm{OH^-}] = 2s \\;\\Rightarrow\\; K_{\\mathrm{sp}} = 4 s^{3}",
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
          "\\Delta G^{\\circ} = -RT\\,\\ln K",
          "\\Delta G^{\\circ} = \\Delta H^{\\circ} - T\\,\\Delta S^{\\circ}",
          "\\ln K = -\\frac{\\Delta H^{\\circ}}{R\\,T} + \\frac{\\Delta S^{\\circ}}{R} \\quad \\text{(van't Hoff)}",
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
          "\\text{moles } \\mathrm{OH^-} = M_{\\mathrm{HCl}} \\cdot V_{\\mathrm{HCl,\\,eq}}",
          "[\\mathrm{OH^-}] = \\frac{\\text{moles}}{V_{\\text{aliquot}}}",
          "s = \\frac{[\\mathrm{OH^-}]}{2} = [\\mathrm{Ca^{2+}}]",
          "K_{\\mathrm{sp}} = 4\\,s^{3}",
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
          "E^{\\circ}_{\\text{cell}} = E^{\\circ}_{\\text{cathode}} - E^{\\circ}_{\\text{anode}}",
          "\\Delta G^{\\circ} = -n F E^{\\circ}_{\\text{cell}}",
          "\\text{Spontaneous if } E^{\\circ}_{\\text{cell}} > 0",
        ],
        body:
          "Always look up REDUCTION potentials in the table. The species with the more positive E°_red goes on the cathode side (gets reduced); the other is reversed (oxidized) on the anode side.",
      },
      {
        heading: "Nernst equation",
        equations: [
          "E = E^{\\circ} - \\frac{RT}{nF}\\,\\ln Q",
          "\\text{At } 25\\,^{\\circ}\\mathrm{C}: \\quad E = E^{\\circ} - \\frac{0.0592}{n}\\,\\log Q",
        ],
        body:
          "Q is the reaction quotient written for the cell reaction as a whole. As the cell discharges, Q → K, ln Q → ln K, E → 0 (dead battery).",
      },
      {
        heading: "Faraday's constants & laws",
        equations: [
          "F = 96\\,485\\,\\mathrm{C/mol\\;e^-}",
          "Q_{\\text{charge}} = I \\cdot t",
          "\\text{moles } e^- = \\frac{Q}{F} = \\frac{I\\,t}{F}",
          "\\text{moles metal} = \\frac{\\text{moles } e^-}{n} \\quad \\text{(}n = \\text{electrons per metal atom)}",
          "\\text{mass} = \\text{moles metal} \\cdot M",
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
      {
        heading: "Balancing redox: charge AND mass (Skibo trap)",
        body:
          "Past quizzes routinely give a half-reaction balanced for mass but NOT for charge — and ask you to fix it. Apply BOTH conservation laws or you'll lose the point.",
        bullets: [
          "Step 1: balance all atoms EXCEPT O and H.",
          "Step 2: balance O by adding H₂O to whichever side is short.",
          "Step 3: balance H by adding H⁺ to whichever side is short (acidic medium).",
          "Step 4: balance CHARGE by adding e⁻ to the more-positive side.",
          "Step 5 (basic medium only): add the same number of OH⁻ to both sides as the H⁺ count, combine H⁺ + OH⁻ → H₂O, cancel duplicates.",
          "Step 6: combine the two half-reactions so electrons cancel — multiply each through by an integer.",
          "Verification: total charge AND total atoms must match on both sides of the final equation.",
          "Example: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O — charge LHS −1+8−5 = +2; charge RHS +2 ✓; mass balanced.",
        ],
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
          "Q\\,[\\mathrm{C}] = I\\,[\\mathrm{A}] \\cdot t\\,[\\mathrm{s}]",
          "\\text{moles } e^- = \\frac{Q}{F}",
          "\\text{moles Cu} = \\frac{\\text{moles } e^-}{2} \\quad (\\mathrm{Cu^{2+}} + 2e^- \\to \\mathrm{Cu})",
          "\\text{mass Cu predicted} = \\text{moles Cu} \\cdot 63.55\\,\\mathrm{g/mol}",
          "\\%\\,\\text{recovery} = \\frac{\\text{mass measured}}{\\text{mass predicted}} \\cdot 100",
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
          "\\text{Anode (Fe lost):}\\quad \\mathrm{Fe} \\to \\mathrm{Fe^{2+}} + 2e^-",
          "\\text{Cathode, neutral:}\\quad \\mathrm{O_2} + 2\\mathrm{H_2O} + 4e^- \\to 4\\,\\mathrm{OH^-}",
          "\\text{Cathode, acidic:}\\quad 2\\mathrm{H^+} + 2e^- \\to \\mathrm{H_2}",
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
          "\\mathrm{Zn^{2+}} + 2e^- \\to \\mathrm{Zn} \\qquad E^{\\circ} = -0.76\\,\\mathrm{V} \\quad \\text{(easier to oxidize than Fe)}",
          "\\mathrm{Fe^{2+}} + 2e^- \\to \\mathrm{Fe} \\qquad E^{\\circ} = -0.44\\,\\mathrm{V}",
          "\\mathrm{Cu^{2+}} + 2e^- \\to \\mathrm{Cu} \\qquad E^{\\circ} = +0.34\\,\\mathrm{V} \\quad \\text{(makes Fe corrode worse)}",
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
      {
        heading: "pH dictates the cathode reaction (Skibo quiz rule)",
        body:
          "Which species is reduced at the cathode depends ENTIRELY on the pH of the surrounding electrolyte. Memorize the three regimes — past quizzes punish picking the wrong half-reaction.",
        bullets: [
          "Neutral / basic (pH ≈ 7-14, includes ocean water): cathode = O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻. Phenolphthalein turns pink.",
          "Acidic (pH < 4, e.g. car battery acid spill): cathode = 2 H⁺ + 2 e⁻ → H₂(g). No OH⁻ produced → phenolphthalein stays clear, you may see bubbles.",
          "Strongly basic (pH > 12): cathode is still O₂/OH⁻; H⁺ reduction is negligible.",
          "Anode is always the iron itself: Fe → Fe²⁺ + 2 e⁻, regardless of pH.",
        ],
      },
      {
        heading: "Seawater vs freshwater electrolyte",
        bullets: [
          "Seawater pH ≈ 8.0-8.2 (essentially neutral) → O₂-reduction cathode → still produces OH⁻ → still pink with phenolphthalein.",
          "Seawater is far more conductive (~5 S/m) than fresh water (~0.005 S/m); galvanic-cell internal resistance drops by ~1000× → corrosion current orders of magnitude higher.",
          "Cl⁻ also penetrates the Fe₂O₃ passive film and pits it, exposing fresh metal beneath → pitting corrosion.",
          "Net effect: seawater accelerates iron corrosion ≫ freshwater, even though the half-reactions are identical.",
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
          "E(e_g) - E(t_{2g}) = \\Delta_o",
          "\\Delta_o = \\frac{h\\,c}{\\lambda_{\\max}} \\quad \\text{(per molecule; multiply by } N_A \\text{ for kJ/mol)}",
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
          "E\\,[\\mathrm{J}] = \\frac{h\\,c}{\\lambda_{\\max}}",
          "h = 6.626 \\times 10^{-34}\\,\\mathrm{J\\,s}, \\quad c = 3.00 \\times 10^{8}\\,\\mathrm{m/s}",
          "\\Delta_o\\,[\\mathrm{kJ/mol}] = \\frac{N_A \\cdot E}{1000}",
          "\\text{Convenient:}\\quad \\Delta_o\\,[\\mathrm{kJ/mol}] \\approx \\frac{1.196 \\times 10^{5}}{\\lambda\\,[\\mathrm{nm}]}",
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
        heading: "Bond-frequency formula (worksheet derivation)",
        body:
          "Treat the bond as a harmonic oscillator. The vibrational energy spacing — and hence the IR absorption frequency — is set by the spring constant κ (bond stiffness) and the reduced mass μ = m₁·m₂/(m₁+m₂):",
        bullets: [
          "$\\nu = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{\\kappa}{\\mu}}$ (Hz);   wavenumber $\\tilde{\\nu} = \\nu / c$ (cm⁻¹).",
          "Equivalent worksheet form: $E = \\dfrac{h}{2\\pi}\\sqrt{\\dfrac{\\kappa\\,(m_1+m_2)}{m_1\\,m_2}}$.",
          "Higher κ (triple > double > single bond) → HIGHER frequency.",
          "Lighter atoms (smaller μ) → HIGHER frequency.",
          "Bond-strength order: C≡C (~2150 cm⁻¹) > C=C (~1650) > C-C (~1000); C=O (~1715) > C-O (~1100).",
          "Atom-mass order at fixed κ: C-H (~3000) > C-D (~2200) > C-C (~1000) — H is the lightest, so C-H sits highest.",
          "Diagnostic ladder: O-H/N-H ≫ C-H > C≡N/C≡C > C=O > C=C > C-O > C-C — bigger κ AND smaller μ both push frequency up.",
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

const formulaGroups: { heading: string; items: { name: string; eq: string | string[]; note?: string }[] }[] =
  [
    {
      heading: "Solutions & stoichiometry",
      items: [
        { name: "Molarity", eq: "M = \\dfrac{\\text{mol solute}}{\\text{L solution}}" },
        {
          name: "Dilution",
          eq: "M_1 V_1 = M_2 V_2",
          note: "Moles unchanged on dilution. Use any volume units as long as both sides match.",
        },
        { name: "Mass percent", eq: "\\%\\,m = \\dfrac{\\text{mass solute}}{\\text{mass solution}} \\times 100" },
        { name: "ppm (water, dilute)", eq: "\\text{ppm} \\approx \\dfrac{\\text{mg solute}}{\\text{L solution}}" },
        {
          name: "% yield",
          eq: "\\%\\,\\text{yield} = \\dfrac{\\text{actual}}{\\text{theoretical}} \\times 100",
        },
      ],
    },
    {
      heading: "Acid-base equilibria",
      items: [
        { name: "Water ion product", eq: "K_w = [\\mathrm{H^+}]\\,[\\mathrm{OH^-}] = 1.0 \\times 10^{-14} \\;\\text{at}\\; 25\\,^{\\circ}\\mathrm{C}" },
        {
          name: "pH / pOH",
          eq: [
            "\\mathrm{pH} = -\\log[\\mathrm{H^+}]",
            "\\mathrm{pOH} = -\\log[\\mathrm{OH^-}]",
            "\\mathrm{pH} + \\mathrm{pOH} = 14 \\quad (25\\,^{\\circ}\\mathrm{C})",
          ],
        },
        { name: "Ka·Kb relation", eq: "K_a \\cdot K_b = K_w" },
        { name: "Henderson-Hasselbalch", eq: "\\mathrm{pH} = \\mathrm{p}K_a + \\log\\dfrac{[\\mathrm{A^-}]}{[\\mathrm{HA}]}" },
        {
          name: "% ionization",
          eq: "\\%\\,\\text{ionization} = \\dfrac{[\\mathrm{H^+}]}{[\\mathrm{HA}]_0} \\cdot 100",
        },
        {
          name: "Buffer pH after small acid added",
          eq: "\\text{Stoich first }(\\mathrm{A^-} + \\mathrm{H^+} \\to \\mathrm{HA})\\text{; then plug NEW moles into HH.}",
        },
      ],
    },
    {
      heading: "Equilibrium",
      items: [
        { name: "Equilibrium constant K (in terms of concentrations)", eq: "K = \\dfrac{\\prod[\\text{products}]^{\\nu}}{\\prod[\\text{reactants}]^{\\nu}}" },
        { name: "Reaction quotient Q", eq: "\\text{Same form as }K\\text{, but using current concentrations.}" },
        {
          name: "Direction of shift",
          eq: [
            "Q < K \\;\\Rightarrow\\; \\text{forward}",
            "Q > K \\;\\Rightarrow\\; \\text{reverse}",
            "Q = K \\;\\Rightarrow\\; \\text{at equilibrium}",
          ],
        },
        { name: "Ksp (sparingly soluble salt)", eq: "K_{\\mathrm{sp}} = \\text{product of ion concentrations, each raised to its stoich coefficient}" },
        {
          name: "Ksp ↔ molar solubility",
          eq: [
            "\\mathrm{Ca(OH)_2}: \\quad K_{\\mathrm{sp}} = 4 s^{3}",
            "\\mathrm{AgCl}: \\quad K_{\\mathrm{sp}} = s^{2}",
            "\\mathrm{PbI_2}: \\quad K_{\\mathrm{sp}} = 4 s^{3} \\quad (\\text{same as } \\mathrm{Ca(OH)_2})",
          ],
        },
      ],
    },
    {
      heading: "Thermodynamics",
      items: [
        { name: "Free energy", eq: "\\Delta G^{\\circ} = \\Delta H^{\\circ} - T\\,\\Delta S^{\\circ}" },
        { name: "ΔG° from K", eq: "\\Delta G^{\\circ} = -R T\\,\\ln K \\quad (R = 8.314\\,\\mathrm{J/(mol\\,K)})" },
        { name: "Van't Hoff", eq: "\\ln K = -\\dfrac{\\Delta H^{\\circ}}{R T} + \\dfrac{\\Delta S^{\\circ}}{R}" },
        { name: "ΔG vs ΔG°", eq: "\\Delta G = \\Delta G^{\\circ} + R T\\,\\ln Q \\quad (\\text{drive: } \\Delta G < 0)" },
      ],
    },
    {
      heading: "Kinetics",
      items: [
        { name: "Generic rate law", eq: "\\text{rate} = k\\,[A]^{m}\\,[B]^{n}" },
        {
          name: "0th order integrated",
          eq: [
            "[A] = [A]_0 - k\\,t",
            "\\text{plot } [A] \\text{ vs. } t \\text{ linear}",
          ],
        },
        {
          name: "1st order integrated",
          eq: [
            "\\ln[A] = \\ln[A]_0 - k\\,t",
            "\\text{plot } \\ln[A] \\text{ vs. } t \\text{ linear}",
          ],
        },
        {
          name: "2nd order integrated",
          eq: [
            "\\dfrac{1}{[A]} = \\dfrac{1}{[A]_0} + k\\,t",
            "\\text{plot } 1/[A] \\text{ vs. } t \\text{ linear}",
          ],
        },
        { name: "1st order half-life", eq: "t_{1/2} = \\dfrac{\\ln 2}{k} = \\dfrac{0.693}{k}" },
        {
          name: "Arrhenius",
          eq: [
            "k = A\\,e^{-E_a/(R T)}",
            "\\ln\\dfrac{k_2}{k_1} = \\dfrac{E_a}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)",
          ],
        },
      ],
    },
    {
      heading: "Electrochemistry",
      items: [
        { name: "Cell potential", eq: "E^{\\circ}_{\\text{cell}} = E^{\\circ}_{\\text{cathode}} - E^{\\circ}_{\\text{anode}}" },
        {
          name: "Free energy",
          eq: [
            "\\Delta G^{\\circ} = -n F E^{\\circ}_{\\text{cell}}",
            "F = 96\\,485\\,\\mathrm{C/mol}",
          ],
        },
        { name: "K from E°", eq: "\\ln K = \\dfrac{n F\\,E^{\\circ}_{\\text{cell}}}{R T}" },
        { name: "Nernst (25 °C)", eq: "E = E^{\\circ} - \\dfrac{0.0592}{n}\\,\\log Q" },
        {
          name: "Faraday's law",
          eq: [
            "\\text{moles } e^- = \\dfrac{I\\,t}{F}",
            "\\text{moles M} = \\dfrac{I\\,t}{n F}",
            "m = \\dfrac{I\\,t\\,M}{n F}",
          ],
        },
      ],
    },
    {
      heading: "Spectroscopy & gases",
      items: [
        { name: "Beer's Law", eq: "A = \\varepsilon \\cdot b \\cdot c" },
        {
          name: "Photon energy",
          eq: [
            "E = h\\nu = \\dfrac{h\\,c}{\\lambda}",
            "h = 6.626 \\times 10^{-34}\\,\\mathrm{J\\,s}",
            "c = 3.00 \\times 10^{8}\\,\\mathrm{m/s}",
          ],
        },
        { name: "Convenient form", eq: "E\\,[\\mathrm{kJ/mol}] \\approx \\dfrac{1.196 \\times 10^{5}}{\\lambda\\,[\\mathrm{nm}]}" },
        {
          name: "Ideal gas",
          eq: [
            "PV = nRT",
            "R = 0.0821\\,\\mathrm{L\\,atm/(mol\\,K)} = 8.314\\,\\mathrm{J/(mol\\,K)}",
          ],
        },
        {
          name: "Calorimetry",
          eq: [
            "q = m\\,c\\,\\Delta T \\quad \\text{(specific heat)}",
            "q = C\\,\\Delta T \\quad \\text{(heat capacity)}",
          ],
        },
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
  const theme = useHostTheme();
  return (
    <div
      style={{
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: "0.9em",
        color: theme.text.primary,
        background: theme.fill.tertiary,
        border: `1px solid ${theme.stroke.tertiary}`,
        borderRadius: 6,
        padding: "6px 10px",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
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
        <Text key={i}>{line}</Text>
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
  const extras = experimentExtras[exp.id];
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

      {extras?.tldr && extras.tldr.length > 0 && <TldrCard items={extras.tldr} />}

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
            {extras?.stepFaded && (
              <StepFadedExample
                storageKey={`stepfaded.${exp.id}`}
                steps={extras.stepFaded}
              />
            )}
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

      {extras?.related && extras.related.length > 0 && (
        <RelatedFooter items={extras.related} onNavigate={onNavigate} />
      )}

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
              Array.isArray(it.eq) ? (
                <Stack gap={4}>
                  {it.eq.map((e, k) => (
                    <Code key={k}>{e}</Code>
                  ))}
                </Stack>
              ) : (
                <Code>{it.eq}</Code>
              ),
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

      <H2>Plot identifier (kinetics)</H2>
      <Text tone="secondary" size="small">
        For a single reactant: which plot is linear tells you the order. Memorize this 3-row table cold &mdash; it shows up on every kinetics question.
      </Text>
      <Table
        headers={["Plot", "Order", "Slope", "Half-life t½"]}
        columnAlign={["left", "center", "left", "left"]}
        rows={[
          [
            <Math>{"[A] \\text{ vs } t"}</Math>,
            "0",
            <Math>{"-k"}</Math>,
            <Math>{"t_{1/2} = [A]_0 / (2k)"}</Math>,
          ],
          [
            <Math>{"\\ln[A] \\text{ vs } t"}</Math>,
            "1",
            <Math>{"-k"}</Math>,
            <Math>{"t_{1/2} = \\ln 2 / k"}</Math>,
          ],
          [
            <Math>{"1/[A] \\text{ vs } t"}</Math>,
            "2",
            <Math>{"+k"}</Math>,
            <Math>{"t_{1/2} = 1/(k\\,[A]_0)"}</Math>,
          ],
        ]}
      />

      <H2>Color-complement wheel</H2>
      <Text tone="secondary" size="small">
        A solution&apos;s observed color is the COMPLEMENT of the wavelength it absorbs. If a complex looks blue, it&apos;s absorbing orange (~600 nm); use that for &lambda;<sub>max</sub> &rarr; &Delta;<sub>o</sub> calculations.
      </Text>
      <Table
        headers={["Color absorbed", "λ absorbed (nm)", "Color seen", "Energy"]}
        columnAlign={["left", "center", "left", "center"]}
        rows={[
          ["Violet", "400-430", "Yellow-green", "highest E"],
          ["Blue", "430-490", "Orange", "↑"],
          ["Green", "490-560", "Red", ""],
          ["Yellow", "560-580", "Violet", ""],
          ["Orange", "580-620", "Blue", "↓"],
          ["Red", "620-700", "Green", "lowest E"],
        ]}
      />
      <Callout tone="info" title="Quick rule">
        <Text>
          Larger Δ<sub>o</sub> &rarr; absorbs shorter λ (blue/violet) &rarr; complex
          looks orange/yellow. Smaller Δ<sub>o</sub> &rarr; absorbs longer λ (red) &rarr;
          complex looks green/blue. Use <Math>{"\\Delta_o = hc/\\lambda_{\\max}"}</Math>{" "}
          to convert.
        </Text>
      </Callout>
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

// ============================================================
// STUDY TOOLS — TL;DR + step-faded + cross-cutting + mnemonics +
// traps + flashcards + quiz mode + mock exam + past quizzes.
// All UI uses existing canvas-shim primitives. Persistence via
// useCanvasState (localStorage). No new dependencies.
// ============================================================

// The JS built-in Math is shadowed by the imported `Math` KaTeX
// component for the rest of this file; alias the global so we can
// still call Math.min/max/floor/random/etc. inside the study tools.
const MathJS = (globalThis as { Math: { min: (...n: number[]) => number; max: (...n: number[]) => number; floor: (n: number) => number; ceil: (n: number) => number; round: (n: number) => number; abs: (n: number) => number; random: () => number; pow: (a: number, b: number) => number; log: (n: number) => number; sqrt: (n: number) => number; PI: number } }).Math;

// ----- Types --------------------------------------------------
type ExperimentExtras = {
  tldr: string[];
  stepFaded?: { setup: string; equation: string; plugIn: string; answer: string };
  related?: { id: string; why: string }[];
};

type CrossCutting = {
  title: string;
  blurb: string;
  expIds: string[];
  bullets: string[];
};

type Mnemonic = {
  title: string;
  body: string;
  cues?: string[];
};

type Trap = {
  title: string;
  bait: string;
  catch: string;
  expId?: string;
};

type PastQuizQ = { q: string; a: string };
type PastQuiz = { id: string; title: string; expId?: string; questions: PastQuizQ[] };

type BankQuestion = {
  id: string;
  expId: string;
  expLabel: string;
  q: string;
  a: string;
  source: "practice" | "whyQA";
};

type FlashcardEntry = {
  id: string;
  expId: string;
  expLabel: string;
  front: string;
  back: string;
  source: "whyQA" | "errors" | "formulas";
};

type LeitnerState = { box: number; due: number; lastSeen: number };
type LeitnerStore = Record<string, LeitnerState>;

type QuizState = {
  current: string | null;
  showAnswer: boolean;
  attemptsById: Record<string, number>;
  correctById: Record<string, number>;
  streak: number;
  bestStreak: number;
  lastResult: "right" | "wrong" | null;
};

type MockQuestion = {
  id: string;
  expId: string;
  expLabel: string;
  prompt: string;
  solution: string;
  points: number;
  hint?: string;
};

type MockAttempt = {
  finishedAt: number;
  durationSec: number;
  score: number;
  perQ: Record<string, number>;
};

type MockState = {
  startedAt: number | null;
  remaining: number;
  responses: Record<string, string>;
  selfScore: Record<string, number>;
  submitted: boolean;
  history: MockAttempt[];
};

const MOCK_DURATION_SEC = 60 * 60;

// ----- Per-experiment extras (TL;DR + step-faded + related) ---
const experimentExtras: Record<string, ExperimentExtras> = {
  exp1: {
    tldr: [
      "Method of initial rates: r = k[H₂O₂]^m[I⁻]^n. Doubling [X] doubles rate ⇒ exponent = 1; quadruples ⇒ 2.",
      "Track O₂ via PV = nRT; remember P_O₂ = P_atm − P_H₂O (vapor pressure correction).",
      "Rate is defined PER stoichiometric coefficient — for 2 H₂O₂ → 2 H₂O + O₂, rate = −½ d[H₂O₂]/dt = +d[O₂]/dt.",
      "Use ONLY the early linear part; late curvature underestimates initial rate ⇒ k too low.",
      "Activation energy from Arrhenius: ln k vs 1/T linear, slope = −Eₐ/R.",
    ],
    stepFaded: {
      setup:
        "Run 4 trials varying [H₂O₂] and [I⁻] independently. Read ΔP_O₂/Δt from the linear early portion only. Measure room T (K) and atmospheric P (atm); look up P_H₂O at T.",
      equation:
        "$r = -\\dfrac{1}{2}\\dfrac{d[\\mathrm{H_2O_2}]}{dt} = +\\dfrac{d[\\mathrm{O_2}]}{dt}$.  Use $PV = nRT$ to convert pressure rise to mol O₂ rise.",
      plugIn:
        "Trial 1: ΔP_O₂ = 12.0 torr in 60.0 s in V = 0.150 L at 295 K.  ΔP_O₂ in atm = 12.0/760 = 0.01579.  Δn = (0.01579)(0.150)/((0.08206)(295)) = 9.78×10⁻⁵ mol.  d[O₂]/dt = 9.78×10⁻⁵ / (0.025 L · 60 s) = 6.52×10⁻⁵ M/s.",
      answer:
        "Initial rate r₁ = 6.52×10⁻⁵ M/s. Repeat for trials 2-4, then take ratios at fixed [I⁻] vs varying [H₂O₂] to extract m, and at fixed [H₂O₂] vs varying [I⁻] to extract n. Solve r = k[H₂O₂]ᵐ[I⁻]ⁿ for k.",
    },
    related: [
      { id: "exp2", why: "Pseudo-first-order kinetics — same rate-law machinery, different excess condition." },
      { id: "ref-formulas", why: "PV=nRT, Arrhenius, rate-law definitions cheat sheet." },
    ],
  },
  exp2: {
    tldr: [
      "Make [crystal violet] track exactly with absorbance via Beer's Law: A = εbc.",
      "Excess OH⁻ ⇒ pseudo-first-order in CV: rate = k_obs[CV], k_obs = k[OH⁻].",
      "Linearize as ln A vs t. Slope = −k_obs.",
      "Then plot k_obs vs [OH⁻]; slope = true rate constant k.",
      "Activation energy: ln k_obs vs 1/T (Arrhenius); slope = −Eₐ/R.",
    ],
    stepFaded: {
      setup:
        "Mix CV with large excess NaOH. Read A vs t at λ_max (~590 nm) every 30 s. Repeat at multiple [OH⁻]. Optionally repeat at multiple T.",
      equation:
        "$\\ln A = \\ln A_0 - k_{\\mathrm{obs}} t$.  Then $k_{\\mathrm{obs}} = k\\,[\\mathrm{OH^-}]$.  Arrhenius: $\\ln k = \\ln A - E_a/(RT)$.",
      plugIn:
        "Sample run: slope of ln A vs t = −0.0152 s⁻¹ at [OH⁻] = 0.030 M.  ⇒ k_obs = 0.0152 s⁻¹.  k = k_obs/[OH⁻] = 0.0152/0.030 = 0.51 M⁻¹ s⁻¹.",
      answer:
        "Rate law: rate = (0.51 M⁻¹ s⁻¹)[CV][OH⁻]. For Eₐ, regress ln k vs 1/T: slope ≈ −6500 K ⇒ Eₐ = 6500·8.314 = 5.4×10⁴ J/mol = 54 kJ/mol.",
    },
    related: [
      { id: "exp1", why: "Initial-rates approach to the same rate-law form." },
      { id: "exp4", why: "Beer's Law again — A∝c is the same machinery you use for K_a." },
      { id: "exp10", why: "Spectrophotometry as a measurement clock." },
    ],
  },
  exp3: {
    tldr: [
      "Le Chatelier: stress the equilibrium, predict the shift; color or precipitate change is your readout.",
      "Adding heat: exothermic ⇒ shift LEFT (reverse); endothermic ⇒ shift RIGHT.",
      "Adding ion product (common-ion or precipitate former): shift to consume it.",
      "Diluting: shift toward side with MORE moles of solute particles.",
      "Q vs K decides direction of shift, not the magnitude.",
    ],
    stepFaded: {
      setup:
        "For Co(II)-Cl⁻ system: [Co(H₂O)₆]²⁺ + 4 Cl⁻ ⇌ CoCl₄²⁻ + 6 H₂O. Pink ⇌ Blue. Test temperature, [Cl⁻] (concentrated HCl) and dilution.",
      equation:
        "$Q = \\dfrac{[\\mathrm{CoCl_4^{2-}}]}{[\\mathrm{Co^{2+}}][\\mathrm{Cl^-}]^4}$.  If $Q < K$ ⇒ forward (more blue); if $Q > K$ ⇒ reverse (more pink).",
      plugIn:
        "Adding HCl: [Cl⁻] rises ⇒ denominator is RAISED but raised more on bottom (^4). Wait — RAISING [Cl⁻] makes Q SMALLER (Cl⁻ in denominator), so Q < K ⇒ rxn shifts FORWARD (toward blue). Heating: rxn is endothermic in this direction ⇒ heating shifts forward (more blue).",
      answer:
        "Predictions: add HCl ⇒ blue; add water ⇒ pink (dilution favors more particles, the Co(H₂O)₆²⁺ side); cool ⇒ pink; heat ⇒ blue. Match observations to confirm.",
    },
    related: [
      { id: "exp4", why: "Same Q vs K logic applied to weak acid/conjugate base." },
      { id: "exp6", why: "Buffer = LeChatelier protection against added strong acid/base." },
    ],
  },
  exp4: {
    tldr: [
      "Indicator HIn ⇌ H⁺ + In⁻; HIn one color, In⁻ another, color tracks the ratio.",
      "Henderson-Hasselbalch: pH = pK_a + log([In⁻]/[HIn]).",
      "Beer's Law on a mix: A_λ = ε_HIn b [HIn] + ε_In b [In⁻]; isosbestic point lets you skip one term.",
      "At pH = pK_a, [HIn] = [In⁻] (color is exactly intermediate).",
      "Two-wavelength method: pick λ where ONLY one form absorbs to isolate it.",
    ],
    stepFaded: {
      setup:
        "Prepare BTB at known pH values bracketing the pK_a. Measure A at λ_yellow (HIn dominant) and λ_blue (In⁻ dominant). Plot pH vs log([In⁻]/[HIn]).",
      equation:
        "$\\dfrac{[\\mathrm{In^-}]}{[\\mathrm{HIn}]} = \\dfrac{A_{\\mathrm{blue}}/\\varepsilon_{\\mathrm{In},\\mathrm{blue}}}{A_{\\mathrm{yellow}}/\\varepsilon_{\\mathrm{HIn},\\mathrm{yellow}}}$.  Plot $\\mathrm{pH}$ vs $\\log([\\mathrm{In^-}]/[\\mathrm{HIn}])$ ⇒ slope = 1, intercept = pK_a.",
      plugIn:
        "At pH 6.5: A_yellow = 0.62, A_blue = 0.18.  Ratio = 0.290, log = −0.537.  At pH 7.5: A_yellow = 0.14, A_blue = 0.71.  Ratio = 5.07, log = 0.705. Two points give a line: slope = 1.0 (good), intercept ≈ 7.0.",
      answer:
        "pK_a ≈ 7.0 (BTB literature value). Color transition window = pK_a ± 1 = 6.0-8.0.",
    },
    related: [
      { id: "exp5", why: "Identical HH equation; only the species changes (weak acid + conjugate base buffer)." },
      { id: "exp6", why: "Buffers tested with the same indicator + HH math." },
      { id: "exp10", why: "Beer's Law spectrophotometry quantification." },
    ],
  },
  exp5: {
    tldr: [
      "Buffer = weak acid + conjugate base. Resists pH change because either side soaks up added H⁺ or OH⁻.",
      "pH = pK_a + log([A⁻]/[HA]) — Henderson-Hasselbalch is THE buffer equation.",
      "Maximum buffer capacity at pH = pK_a (when [A⁻]=[HA]).",
      "Capacity scales with [HA] + [A⁻] — concentrated buffers resist more strong acid/base.",
      "Pick pK_a within ±1 of target pH; use moles ratio, not concentration ratio (volumes cancel).",
    ],
    stepFaded: {
      setup:
        "Make 25.0 mL of pH 4.74 acetate buffer (pK_a = 4.74) at 0.10 M total. Add 1.00 mL of 0.10 M HCl, measure pH change. Repeat with water as control.",
      equation:
        "$\\mathrm{pH} = pK_a + \\log\\dfrac{n_{A^-}}{n_{HA}}$.  Adding strong acid converts $A^-$ to $HA$:  $\\Delta n_{HA} = +n_{H^+}$, $\\Delta n_{A^-} = -n_{H^+}$.",
      plugIn:
        "Initial: n_HA = n_A⁻ = 0.025·0.050 = 1.25 mmol each (0.050 M each in 25 mL).  Add 0.10 mmol HCl ⇒ n_HA = 1.35, n_A⁻ = 1.15.  Ratio = 0.852, log = −0.070.",
      answer:
        "pH_final = 4.74 − 0.070 = 4.67. Δ ≈ 0.07 — essentially flat. Same HCl into 25 mL pure water would drop pH from 7 to ~2.4. Buffer wins by ~5 pH units.",
    },
    related: [
      { id: "exp4", why: "Same HH equation; indicators are micro-buffers in disguise." },
      { id: "exp6", why: "Buffer stress test in the lab." },
      { id: "exp7", why: "K_a thermodynamics ties pK_a to ΔG° = −RT ln K_a." },
    ],
  },
  exp6: {
    tldr: [
      "Titrate weak acid (or polyprotic) with strong base; track pH vs volume.",
      "Half-equivalence: pH = pK_a (where moles base added = ½ moles acid present).",
      "Equivalence point: equal moles of titrant added to neutralize each acidic proton; n equiv pts for n acidic protons.",
      "Past equivalence: excess strong base controls pH.",
      "Indicator pK_a should match titration pH at equivalence (phenolphthalein for weak acid + strong base, ~pH 8.3-10).",
    ],
    stepFaded: {
      setup:
        "Titrate 25.0 mL of 0.100 M acetic acid (pK_a = 4.74) with 0.100 M NaOH. Find pH at half-equiv and equiv from the curve.",
      equation:
        "Half-eq: V_NaOH = ½ V_eq, [HA] = [A⁻] ⇒ pH = pK_a.  Equiv pt: all HA → A⁻; pOH from $K_b = K_w/K_a$, then pH = 14 − pOH.",
      plugIn:
        "n_HA = 0.025·0.100 = 2.50 mmol. V_eq = 25.0 mL. At V = 12.5 mL ⇒ pH = pK_a = 4.74. At V = 25 mL: [A⁻] = 2.50 mmol / 50 mL = 0.0500 M.  K_b = 10⁻¹⁴/10⁻⁴·⁷⁴ = 5.5×10⁻¹⁰.  [OH⁻] = √(0.05·5.5×10⁻¹⁰) = 5.2×10⁻⁶ M.  pOH = 5.28 ⇒ pH = 8.72.",
      answer:
        "Half-eq pH = 4.74; equivalence pH = 8.72. Phenolphthalein (transition 8.3-10) is the right indicator.",
    },
    related: [
      { id: "exp5", why: "Same HA/A⁻ buffer regime appears between half-eq and eq." },
      { id: "exp4", why: "Color indicators chosen by matching pK_a to equiv pH." },
    ],
  },
  exp7: {
    tldr: [
      "Hess's Law: ΔH for an overall reaction = sum of ΔH for any path that gets you there.",
      "Coffee-cup calorimetry: q = mcΔT (heat released → solution warms; ΔH_rxn = −q/n).",
      "Sign convention: exothermic ⇒ ΔH < 0; ΔT > 0 for the surroundings.",
      "ΔS predicted from change in disorder; ΔG = ΔH − TΔS decides spontaneity at T.",
      "ΔG° = −RT ln K — spontaneous standard rxn ⇔ K > 1 ⇔ ΔG° < 0.",
    ],
    stepFaded: {
      setup:
        "Run NaOH + HCl in a coffee-cup calorimeter. Measure ΔT for several volumes/concentrations. Compare to literature ΔH_neut.",
      equation:
        "$q = m\\,c\\,\\Delta T$;  $\\Delta H_{rxn} = -q/n$ where $n$ = moles limiting.  $\\Delta G^{\\circ} = -RT\\ln K$.",
      plugIn:
        "50.0 mL 1.00 M HCl + 50.0 mL 1.00 M NaOH at 22.5 °C → 29.3 °C. m = 100 g, c = 4.184 J/g·K, ΔT = 6.8 K.  q = 100·4.184·6.8 = 2845 J ≈ 2.84 kJ. n = 0.050 mol.  ΔH = −56.9 kJ/mol.",
      answer:
        "ΔH_neut ≈ −56 kJ/mol (lit. −55.8 kJ/mol). With ΔS° from tables (~80 J/mol·K) and T = 298 K, ΔG° = ΔH − TΔS ≈ −80 kJ/mol — spontaneous, K ≫ 1.",
    },
    related: [
      { id: "exp5", why: "Buffer pK_a connects to ΔG° via ΔG° = −RT ln K_a." },
      { id: "ref-formulas", why: "Thermodynamics & ΔG, ΔH, ΔS relations." },
    ],
  },
  exp8: {
    tldr: [
      "Galvanic: spontaneous rxn drives current. E°_cell = E°_cathode − E°_anode > 0.",
      "Electrolytic: external supply forces non-spontaneous rxn. Cathode is (−) because supply pushes electrons IN.",
      "Faraday: m = (Q·M)/(n·F), Q = It. Memorize F = 96485 C/mol e⁻.",
      "Nernst: E = E° − (0.0592/n) log Q. Cell stops when Q = K.",
      "Salt bridge transports IONS, not electrons; without it, charge piles up and cell dies in ms.",
      "BALANCE FOR CHARGE AND MASS — past quizzes punish students who forget the e⁻ count.",
    ],
    stepFaded: {
      setup:
        "Plate Cu onto a Cu cathode from CuSO₄(aq) at constant I = 0.500 A for t = 10.0 min. Weigh cathode before and after.",
      equation:
        "$Q = I\\,t$;  $n_{e^-} = Q/F$;  $n_\\mathrm{Cu} = n_{e^-}/2$;  $m = n_\\mathrm{Cu}\\,M_\\mathrm{Cu}$.",
      plugIn:
        "Q = 0.500·600 = 300 C.  n_e⁻ = 300/96485 = 3.110×10⁻³ mol.  n_Cu = 1.555×10⁻³ mol.  m = 1.555×10⁻³·63.55 = 0.0988 g.",
      answer:
        "Predicted mass = 98.8 mg. % recovery = 100·m_measured/m_pred. Sig figs: I = 3 sf, t = 3 sf ⇒ answer to 3 sf (0.0988 g).",
    },
    related: [
      { id: "exp9", why: "Same redox half-reactions; corrosion is a galvanic cell on a single metal." },
      { id: "ref-formulas", why: "F, E°, Nernst formulas." },
    ],
  },
  exp9: {
    tldr: [
      "Iron corrodes by forming a galvanic cell on a single piece of metal: anode = Fe → Fe²⁺ + 2 e⁻ (blue with K₃[Fe(CN)₆]).",
      "Cathode reaction depends on pH: O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻ at neutral/basic (pink with phenolphthalein); 2 H⁺ + 2 e⁻ → H₂ at acidic (no pink).",
      "Ocean ≈ pH 8 ⇒ neutral cathode (O₂/OH⁻). Salt accelerates everything by raising conductivity.",
      "Sacrificial anode = MORE negative E°_red than Fe (Mg, Zn). Cu/Sn make it WORSE.",
      "Impressed-current: connect protected metal to (−) terminal of supply.",
    ],
    stepFaded: {
      setup:
        "Embed iron nails (bent, w/ Cu, w/ Zn, w/ −cathodic protection) in agar containing K₃[Fe(CN)₆] + phenolphthalein. Add NaCl ± HCl variations.",
      equation:
        "Anode: $\\mathrm{Fe} \\to \\mathrm{Fe^{2+}} + 2 e^-$.  Cathode (neutral): $\\mathrm{O_2} + 2\\mathrm{H_2O} + 4 e^- \\to 4\\,\\mathrm{OH^-}$.  Cathode (acid): $2\\mathrm{H^+} + 2 e^- \\to \\mathrm{H_2}$.",
      plugIn:
        "Bent nail, neutral electrolyte: blue at bend & tip (anode), pink along shaft (cathode).  Fe + Cu in NaCl: blue floods Fe (now anode for both), pink at Cu surface.  Fe + Zn: pink on Fe (now cathode), Zn dissolves (no blue at Fe).",
      answer:
        "Patterns confirm galvanic-cell mechanism + sacrificial-anode protection. Adding HCl shuts off pink (cathode shifts from O₂/OH⁻ to H⁺/H₂).",
    },
    related: [
      { id: "exp8", why: "Same redox + standard-potential framework." },
      { id: "ref-formulas", why: "E°_red table." },
    ],
  },
  exp10: {
    tldr: [
      "Octahedral d-orbitals split into t₂g (low) + eg (high) by Δ_o.",
      "Δ_o = hc/λ_max — the photon you absorb is the gap.",
      "Color seen = COMPLEMENT of color absorbed (use the wheel: blue absorbed ⇒ orange seen).",
      "Spectrochemical series strong→weak: CN⁻ ≈ CO > en > NH₃ > H₂O > OH⁻ > F⁻ > Cl⁻ > Br⁻ > I⁻.",
      "Strong field + d⁴-d⁷ ⇒ low-spin (Δ_o > P). Weak field or d¹-d³, d⁸-d¹⁰ ⇒ high-spin/no choice.",
    ],
    stepFaded: {
      setup:
        "Synthesize [Co(NH₃)₆]Cl₃; record λ_max on UV-Vis. Compute Δ_o per metal-ion mole.",
      equation:
        "$\\Delta_o = \\dfrac{hc}{\\lambda_{\\max}}\\cdot N_A$ in J/mol.  $h = 6.626\\times10^{-34}$, $c = 3.00\\times10^{8}$, $N_A = 6.022\\times10^{23}$.",
      plugIn:
        "λ_max = 437 nm = 437×10⁻⁹ m.  E_photon = (6.626×10⁻³⁴)(3.00×10⁸)/(437×10⁻⁹) = 4.55×10⁻¹⁹ J.  Δ_o = 4.55×10⁻¹⁹·6.022×10²³ = 2.74×10⁵ J/mol.",
      answer:
        "Δ_o = 274 kJ/mol — in the strong-field range expected for NH₃.  Low-spin d⁶: t₂g⁶eg⁰ (diamagnetic).",
    },
    related: [
      { id: "exp2", why: "Beer's Law spectrophotometry — same instrument, same A vs c reading." },
      { id: "exp4", why: "λ_max selection logic for indicator quantification." },
      { id: "ref-techniques", why: "Color-complement wheel + spectrometer technique cheat sheet." },
    ],
  },
  exp11: {
    tldr: [
      "Functional-group ID by IR: O-H broad, N-H 1-2 sharp, C=O ~1700 strong, C-H near 3000.",
      "Frequency ladder: lighter atoms + stiffer bond ⇒ higher cm⁻¹ (E = (h/2π)√(κ(m₁+m₂)/m₁m₂)).",
      "Order: C-H > C≡N ≈ C≡C > C=O > C=C > C-O > C-C.  Triple > double > single.",
      "Polar bonds give STRONG IR; symmetric stretches (N≡N, internal C≡C) are weak/absent.",
      "Polarity = bond polarities + geometry. CCl₄, CO₂, BF₃ have polar bonds but are non-polar molecules.",
    ],
    stepFaded: {
      setup:
        "Given an IR + a candidate structure, mark every diagnostic band and rule classes in/out.",
      equation:
        "IR vibration: $\\tilde{\\nu} = \\dfrac{1}{2\\pi c}\\sqrt{\\dfrac{\\kappa}{\\mu}}$, $\\mu = \\dfrac{m_1 m_2}{m_1+m_2}$.",
      plugIn:
        "Spectrum: strong sharp 1715 cm⁻¹ + broad 2500-3300 cm⁻¹ + no N-H. → C=O present + carboxylic acid OH dimer band → carboxylic acid.",
      answer:
        "Class = carboxylic acid. Confirms with C-O at 1280 + O-H out-of-plane bend ~930. Rule out ester (lacks broad O-H).",
    },
    related: [
      { id: "exp10", why: "Spectroscopy as a structural probe (electronic vs vibrational)." },
      { id: "ref-techniques", why: "Spectrometer protocol; IR diagnostic table." },
    ],
  },
};

// ----- Cross-cutting concept threads --------------------------
const crossCutting: CrossCutting[] = [
  {
    title: "Beer's Law (A = εbc) as a measurement clock",
    blurb:
      "Whenever a solution has a chromophore, [chromophore] is just a calibrated absorbance reading. Same machinery, four contexts.",
    expIds: ["exp2", "exp4", "exp10"],
    bullets: [
      "Exp 2: A(t) tracks [crystal violet] as it reacts with OH⁻ → kinetics from ln A vs t.",
      "Exp 4: A_λ at two wavelengths gives [HIn] and [In⁻] → pK_a of indicator.",
      "Exp 10: A at λ_max gives [Co complex]; λ_max gives Δ_o = hc/λ.",
      "Always blank against pure solvent at the SAME λ; cuvette in the SAME orientation.",
      "Keep A in 0.2-1.0 for best linearity; saturated reads underestimate concentration.",
    ],
  },
  {
    title: "Equilibrium Q vs K (Le Chatelier in disguise)",
    blurb:
      "Every weak-acid, complex-ion, solubility, buffer or indicator question reduces to: write K, write Q under stress, compare.",
    expIds: ["exp3", "exp4", "exp5", "exp6", "exp7"],
    bullets: [
      "Exp 3: Co(II)-Cl⁻ color shift; raise [Cl⁻] ⇒ Q drops below K (Cl⁻^4 in denominator) ⇒ shift forward.",
      "Exp 4: HIn ⇌ H⁺ + In⁻; pH = pK_a + log([In⁻]/[HIn]).",
      "Exp 5/6: HA ⇌ H⁺ + A⁻; same HH equation, just real-acid concentrations.",
      "Exp 7: ΔG° = −RT ln K — equilibrium constant IS the thermodynamic driving force.",
      "Polyprotic: H₂A → HA⁻ → A²⁻ has TWO equiv pts (and two pK_a values to read off the curve).",
    ],
  },
  {
    title: "Kinetics — pick the right plot",
    blurb:
      "For a single reactant: which plot is linear tells you the order. Half-life formula then drops out.",
    expIds: ["exp1", "exp2"],
    bullets: [
      "0th: A vs t linear, slope = −k, t½ = [A]₀/(2k).",
      "1st: ln A vs t linear, slope = −k, t½ = ln 2 / k (independent of [A]₀).",
      "2nd: 1/A vs t linear, slope = +k, t½ = 1/(k[A]₀) (DEPENDS on [A]₀).",
      "Pseudo-1st = drown one reactant in excess of the other; recover true k by dividing by the excess concentration.",
    ],
  },
  {
    title: "Thermodynamics linkage (ΔH, ΔS, ΔG, K)",
    blurb:
      "Three-equation hydra you must know cold: ΔG° = ΔH° − TΔS°; ΔG° = −RT ln K; ΔG = ΔG° + RT ln Q.",
    expIds: ["exp5", "exp7"],
    bullets: [
      "Sign of ΔG decides spontaneity at given T.",
      "ΔS > 0 favored by gas formation, more particles, dilution, melting/dissolving.",
      "ΔH < 0 (exothermic) is favored everywhere except very high T (where TΔS may dominate).",
      "K > 1 ⇒ ΔG° < 0 ⇒ products favored at standard state.",
    ],
  },
  {
    title: "Arrhenius — Eₐ from k vs T",
    blurb:
      "Whenever you ran the same kinetics at multiple T, the move is ln k vs 1/T.",
    expIds: ["exp1", "exp2"],
    bullets: [
      "ln k = ln A − Eₐ/(RT). Slope = −Eₐ/R; multiply by R = 8.314 J/(mol·K) and you have Eₐ in J/mol.",
      "Two-point form: ln(k₂/k₁) = −(Eₐ/R)(1/T₂ − 1/T₁). Solve for Eₐ algebraically.",
      "Exp 1 uses initial-rate k; Exp 2 uses pseudo-first-order k_obs (must divide by excess [OH⁻] FIRST).",
    ],
  },
  {
    title: "Redox + n electrons (don't mix mass and charge)",
    blurb:
      "Galvanic, electrolytic, corrosion: same balancing rules. Always identify n = moles e⁻ per mole of metal/limiting species.",
    expIds: ["exp8", "exp9"],
    bullets: [
      "Cu²⁺/Cu: n = 2.  Ag⁺/Ag: n = 1.  Fe³⁺/Fe: n = 3.  Mn₂⁺/MnO₄⁻ in acid: n = 5.",
      "Faraday: m = (Q·M)/(n·F).  Nernst: E = E° − (0.0592/n) log Q.",
      "Sacrificial anode: MORE negative E°_red than the metal you protect.",
      "Cathode reaction depends on pH: O₂/OH⁻ at neutral, H⁺/H₂ at acidic.",
    ],
  },
  {
    title: "Sig figs for log/decimal quantities",
    blurb:
      "pH, pK, log K — the digits BEFORE the decimal are the exponent (not significant). Digits AFTER the decimal are the mantissa (those count).",
    expIds: ["exp4", "exp5", "exp6", "exp7"],
    bullets: [
      "pH = 4.74 has 2 sig figs (the two digits AFTER the decimal). [H⁺] = 10⁻⁴·⁷⁴ = 1.8×10⁻⁵ — 2 sig figs.",
      "ln 7.0 = 1.9459 — only the first two digits after the decimal are significant.",
      "Reverse: if [H⁺] = 3.0×10⁻⁵ (2 sig figs), pH = 4.52 — TWO digits after decimal.",
      "Don't carry 7 digits through a chain — round to the right number of digits at the END.",
    ],
  },
  {
    title: "Color spectroscopy (UV-Vis): λ_max, ε, complement",
    blurb:
      "Same instrument, same protocol, three different chemical questions.",
    expIds: ["exp2", "exp4", "exp10"],
    bullets: [
      "Always select λ_max for measurement — best sensitivity, least slope-of-spectrum error.",
      "Complement: a blue solution absorbs orange ~600 nm; orange absorbs blue ~470 nm; pink absorbs green ~520 nm.",
      "Smaller Δ_o ⇒ longer λ_max ⇒ lower-energy color absorbed ⇒ complementary color seen.",
    ],
  },
];

// ----- Mnemonics & memory aids --------------------------------
const mnemonics: Mnemonic[] = [
  {
    title: "Spectrochemical series (strong-field on the right)",
    body: "I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ ≈ CO",
    cues: [
      "'I Bring Cookies For Our Hunger; New Eats — CO!' (I, Br, Cl, F, OH, H₂O, NH₃, en, CN, CO)",
      "Halides are weak field; π-acceptors (CN⁻, CO) are strong.",
      "Stronger field ⇒ larger Δ_o ⇒ shorter λ_max absorbed ⇒ more likely low-spin.",
    ],
  },
  {
    title: "OIL RIG — redox direction",
    body: "Oxidation Is Loss (of electrons); Reduction Is Gain.",
    cues: [
      "LEO the lion says GER: Lose Electrons = Oxidation; Gain Electrons = Reduction.",
      "Anode = Oxidation (both vowels). Cathode = Reduction.",
    ],
  },
  {
    title: "REDCAT — sign convention by cell type",
    body: "RED CAT, AN OX. Reduction always at the Cathode; Oxidation always at the Anode.",
    cues: [
      "Galvanic: Cathode is (+); Anode is (−). Electrons flow externally − → +.",
      "Electrolytic: Cathode is (−) (supply forces electrons in); Anode is (+).",
      "Process labels never change; sign labels do.",
    ],
  },
  {
    title: "Color-complement wheel",
    body: "Color seen is the complement of color absorbed.",
    cues: [
      "Violet absorbed (~410 nm) ⇒ Yellow-green seen.",
      "Blue absorbed (~470 nm) ⇒ Orange seen.",
      "Green absorbed (~530 nm) ⇒ Red seen.",
      "Yellow absorbed (~580 nm) ⇒ Violet seen.",
      "Orange absorbed (~610 nm) ⇒ Blue seen.",
      "Red absorbed (~680 nm) ⇒ Green seen.",
      "Memorable pairs: Violet ↔ Yellow, Blue ↔ Orange, Green ↔ Red.",
    ],
  },
  {
    title: "IR diagnostic peg list",
    body: "Memorize five anchors: 3300, 3000, 2200, 1700, 1100.",
    cues: [
      "3300 cm⁻¹: O-H broad (alcohol); N-H sharp (amine/amide).",
      "3000 cm⁻¹: C-H stretches (sp³ below, sp² just above 3000).",
      "2200 cm⁻¹: C≡C / C≡N triple bonds (weak unless polar).",
      "1700 cm⁻¹: C=O — the diagnostic carbonyl band.",
      "1100 cm⁻¹: C-O single bond (ether, ester C-O, alcohol C-O).",
    ],
  },
  {
    title: "Plot identifier — kinetics order",
    body: "Pick the plot that's linear. The plot tells you the order.",
    cues: [
      "[A] vs t linear ⇒ 0th order. Slope = −k.",
      "ln[A] vs t linear ⇒ 1st order. Slope = −k.",
      "1/[A] vs t linear ⇒ 2nd order. Slope = +k.",
      "Don't trust R² alone; eyeball residuals.",
    ],
  },
  {
    title: "ΔG sign grid (when does rxn go forward?)",
    body: "ΔG = ΔH − TΔS. Four combinations of signs.",
    cues: [
      "ΔH (−) and ΔS (+): ALWAYS spontaneous at any T.",
      "ΔH (+) and ΔS (−): NEVER spontaneous at any T.",
      "ΔH (−) and ΔS (−): spontaneous at LOW T.",
      "ΔH (+) and ΔS (+): spontaneous at HIGH T.",
    ],
  },
  {
    title: "Polyprotic n equivalence points",
    body: "Number of equivalence points = number of acidic protons titratable.",
    cues: [
      "H₂CO₃ (diprotic) ⇒ 2 equiv pts ⇒ 2 pK_a's.",
      "H₃PO₄ (triprotic) ⇒ 3 equiv pts (3rd is barely visible).",
      "Half-eq before each equiv pt sits at the corresponding pK_a.",
    ],
  },
  {
    title: "Sacrificial anode rule",
    body: "Couple iron to a metal with MORE NEGATIVE E°_red.",
    cues: [
      "More negative reduction potential = more easily oxidized = anode = sacrificed.",
      "Fe E° = −0.44 V. Mg (−2.37), Zn (−0.76) protect. Pb (−0.13), Cu (+0.34) do NOT.",
      "Galvanizing = Zn coating. Dolphin pipelines use Mg pucks.",
    ],
  },
];

// ----- Skibo traps / gotchas ---------------------------------
const skiboTraps: Trap[] = [
  {
    title: "Rate definition coefficient (the −1/2)",
    expId: "exp1",
    bait: "Student writes rate = d[H₂O₂]/dt for 2 H₂O₂ → 2 H₂O + O₂.",
    catch:
      "Rate is defined PER stoichiometric coefficient: rate = −½ d[H₂O₂]/dt = +d[O₂]/dt. Forgetting the ½ doubles your reported rate (and halves k).",
  },
  {
    title: "Pseudo-first-order vs true rate constant",
    expId: "exp2",
    bait: "Reports the slope of ln A vs t as 'the rate constant k'.",
    catch:
      "That slope is k_obs. To get the true second-order k, divide by the excess concentration: k = k_obs / [OH⁻].",
  },
  {
    title: "Buffer 'more or less base' for equal pH",
    expId: "exp5",
    bait:
      "Asks: to make pH = pK_a + 0.30 buffer, do you add MORE base or MORE acid (compared to a 1:1 mixture)?",
    catch:
      "pH = pK_a + log([A⁻]/[HA]). pH > pK_a ⇒ [A⁻] > [HA] ⇒ MORE conjugate BASE. Don't confuse 'more pH' with 'more acid.'",
  },
  {
    title: "Log/decimal sig-fig rule",
    expId: "exp4",
    bait: "pH = 4.74 reported to 3 sig figs.",
    catch:
      "Digits BEFORE the decimal in a log are exponent (not sig). Only digits AFTER count. pH = 4.74 ⇒ 2 sf ⇒ [H⁺] = 1.8×10⁻⁵ (2 sf), NOT 1.82×10⁻⁵.",
  },
  {
    title: "Polyprotic equiv points (n protons)",
    expId: "exp6",
    bait: "Says 'titration of H₃PO₄ shows one equivalence point near pH 11.'",
    catch:
      "Polyprotic acids have n equiv pts. H₂CO₃ has 2; H₃PO₄ has 3 (last is faint). The 'final' pH past the last equiv pt is not the only one.",
  },
  {
    title: "Balance redox for charge AND mass",
    expId: "exp8",
    bait:
      "Half-reaction balanced for atoms but charges don't match: e.g. MnO₄⁻ + H⁺ → Mn²⁺ + H₂O without 5 e⁻.",
    catch:
      "Always check: total atoms balance AND total charge balance. Add e⁻ to the more-positive side until charge balances. Then combine half-rxns so e⁻ cancel.",
  },
  {
    title: "Blank vs zero (spectrometer)",
    expId: "exp10",
    bait: "Reads A directly without zeroing the instrument against the solvent.",
    catch:
      "ALWAYS zero against a blank cuvette of pure solvent at the SAME λ before each set of samples. A reads zero through the blank by definition; otherwise solvent absorbance is in your sample value.",
  },
  {
    title: "TD vs TC pipettes (last drop)",
    bait: "Blows out the last drop of a TD (To Deliver) pipette.",
    catch:
      "TD pipettes are calibrated to leave the last drop in the tip. TC (To Contain) pipettes — rare — get rinsed out fully. Forcing out the last drop of a TD over-delivers.",
  },
  {
    title: "λ_max selection",
    expId: "exp10",
    bait: "Reports A at a wavelength other than λ_max because 'the absorbance was higher there.'",
    catch:
      "Use λ_max — slope of A(λ) is zero there, so wavelength drift introduces minimal error, and signal is largest. Random λ choice gives both lower S/N and sensitivity to drift.",
  },
  {
    title: "Sample prep matters in Exp 10",
    expId: "exp10",
    bait: "Compares Δ_o values across syntheses without mass-normalizing.",
    catch:
      "λ_max gives Δ_o per mole regardless of concentration. But A is concentration-dependent — use A only to confirm complex formation, not to compare strength of field.",
  },
  {
    title: "Cathode is + in galvanic, − in electrolytic",
    expId: "exp8",
    bait:
      "Treats cathode = (−) always.",
    catch:
      "Process label (cathode = reduction, anode = oxidation) is invariant. Sign label depends on cell type: spontaneous galvanic puts (+) at cathode; driven electrolytic puts (−) at cathode (because the supply pushes electrons IN there).",
  },
  {
    title: "Cathode reaction depends on pH",
    expId: "exp9",
    bait:
      "Writes O₂ + 2H₂O + 4e⁻ → 4OH⁻ as the cathode regardless of solution pH.",
    catch:
      "Neutral/basic (incl. seawater): O₂/OH⁻. Acidic: 2H⁺ + 2e⁻ → H₂. Picking the wrong cathode kills the question — and the choice between phenolphthalein indicator turning pink or staying clear.",
  },
  {
    title: "Bond-frequency ordering",
    expId: "exp11",
    bait:
      "Says C-H is at 1700 because 'C=O is also at 1700.'",
    catch:
      "Frequency ↑ with stiffness (κ ↑) AND lighter atoms (μ ↓). C-H is sp³/sp² ~3000 (H is lightest); C=O ~1700 (heavier atoms but stiffer bond); C-O ~1100 (single bond). Ladder: C-H > C=O > C-O.",
  },
];

// ----- Past Skibo quizzes (transcribed) -----------------------
const pastQuizzes: PastQuiz[] = [
  {
    id: "pq-init-rates",
    title: "Quiz 1 — Initial-rate kinetics",
    expId: "exp1",
    questions: [
      {
        q: "For 2 H₂O₂(aq) → 2 H₂O(ℓ) + O₂(g) with rate = k[H₂O₂]^m, write the formal definition of rate in three equivalent ways using stoichiometry.",
        a: "rate = −½ d[H₂O₂]/dt = +d[H₂O]/dt · ½ = +d[O₂]/dt. The 1/2 in front of d[H₂O₂]/dt comes from the coefficient 2; without it, the 'rate' you compute is twice the rxn rate.",
      },
      {
        q: "Trial 1: [H₂O₂] = 0.020 M; r₁ = 4.0×10⁻⁵ M/s. Trial 2: [H₂O₂] = 0.040 M; r₂ = 1.6×10⁻⁴ M/s. Determine m and k (assume rate-law has only [H₂O₂]).",
        a: "Doubling [H₂O₂] → 4× rate ⇒ m = 2.  k = r/[H₂O₂]² = 4.0×10⁻⁵/(0.020)² = 0.10 M⁻¹ s⁻¹.",
      },
      {
        q: "Why does the 'initial-rate' technique require using only the early portion of [A] vs t?",
        a: "Later in the run, [A] depletes and the back-reaction or product effects can curve the data. The pure forward rate-law r = k[A]^m holds at t→0 (or when products ≪ reactants). Late-time slopes UNDER-estimate r₀.",
      },
    ],
  },
  {
    id: "pq-pseudo-rates",
    title: "Quiz 2 — Pseudo-first-order kinetics (CV + OH⁻)",
    expId: "exp2",
    questions: [
      {
        q: "Crystal violet (CV⁺) is run with 50× excess NaOH. ln A vs t is linear with slope −1.85×10⁻² s⁻¹ at [OH⁻] = 0.0500 M. What is k_obs and what is k (true second-order)?",
        a: "k_obs = +1.85×10⁻² s⁻¹ (magnitude of slope). k = k_obs/[OH⁻] = 1.85×10⁻²/0.0500 = 0.370 M⁻¹ s⁻¹.",
      },
      {
        q: "Why ln A and not just A?",
        a: "Because [CV⁺] decays exponentially in pseudo-first-order conditions: [A] = [A]₀ e^(−k_obs t) ⇒ ln A = ln A₀ − k_obs t. A linear plot of ln A vs t has slope −k_obs and intercept ln A₀.",
      },
      {
        q: "If you ran the same experiment at 35 °C and obtained k_obs = 4.3×10⁻² s⁻¹ (vs 1.85×10⁻² at 25 °C), estimate Eₐ.",
        a: "Two-point Arrhenius: ln(k₂/k₁) = −(Eₐ/R)(1/T₂ − 1/T₁).  ln(4.3/1.85) = −(Eₐ/8.314)(1/308 − 1/298).  0.844 = −(Eₐ/8.314)(−1.09×10⁻⁴).  Eₐ = 0.844·8.314/1.09×10⁻⁴ = 64 kJ/mol.",
      },
    ],
  },
  {
    id: "pq-lcp",
    title: "Quiz 3 — Le Chatelier (Co–Cl)",
    expId: "exp3",
    questions: [
      {
        q: "[Co(H₂O)₆]²⁺(aq) + 4 Cl⁻(aq) ⇌ [CoCl₄]²⁻(aq) + 6 H₂O(ℓ).  Pink ⇌ Blue. ΔH > 0 (endothermic, forward).  Effect of ADDING concentrated HCl: predict color and explain via Q vs K.",
        a: "Adding HCl raises [Cl⁻] → Q = [CoCl₄²⁻]/([Co²⁺][Cl⁻]⁴) DROPS (Cl⁻ in denominator, raised to 4th).  Q < K ⇒ rxn shifts FORWARD ⇒ MORE blue.",
      },
      {
        q: "Effect of cooling the solution. Which color dominates and why?",
        a: "Forward rxn is endothermic. Cooling REMOVES heat (a 'product' in the endothermic forward direction).  System shifts BACKWARD to replace it ⇒ MORE pink ([Co(H₂O)₆]²⁺).",
      },
      {
        q: "What if you simply diluted the solution with water?",
        a: "Dilution favors the side with MORE moles of solute particles. LHS has 1 + 4 = 5 solute moles; RHS has 1 (water doesn't count as a solute particle). Dilution shifts BACKWARD ⇒ MORE pink.",
      },
    ],
  },
  {
    id: "pq-btb",
    title: "Quiz 4 — Indicator (BTB)",
    expId: "exp4",
    questions: [
      {
        q: "Bromothymol blue HIn (yellow) ⇌ H⁺ + In⁻ (blue), pK_a = 7.10. At pH = 7.40, what is [In⁻]/[HIn] and what color do you see?",
        a: "log([In⁻]/[HIn]) = pH − pK_a = 7.40 − 7.10 = 0.30 ⇒ ratio = 10^0.30 = 2.0. So [In⁻]:[HIn] = 2:1; color is greenish-blue (mostly In⁻).",
      },
      {
        q: "At what pH is the color exactly intermediate (greenest)?",
        a: "When [HIn] = [In⁻], which is when pH = pK_a = 7.10.",
      },
      {
        q: "An unknown sample of BTB at λ_yellow gives A_y = 0.40, at λ_blue gives A_b = 0.60. Given ε_HIn,y = 4000 M⁻¹cm⁻¹ and ε_In,b = 5000 M⁻¹cm⁻¹ (both b = 1.000 cm), find pH if pK_a = 7.10.",
        a: "[HIn] = A_y/ε = 0.40/4000 = 1.0×10⁻⁴ M.  [In⁻] = 0.60/5000 = 1.2×10⁻⁴ M.  Ratio = 1.20.  pH = 7.10 + log 1.20 = 7.18.",
      },
    ],
  },
  {
    id: "pq-buffers",
    title: "Quiz 5 — Buffers",
    expId: "exp5",
    questions: [
      {
        q: "Make a 100 mL pH 4.74 buffer at 0.20 M total weak-acid concentration. Acetic acid pK_a = 4.74; you have 0.500 M acetic acid, 0.500 M sodium acetate, and water.",
        a: "pH = pK_a ⇒ [HA] = [A⁻].  Need 0.10 M each in 100 mL ⇒ 0.010 mol of each. From 0.500 M stocks: 20 mL acetic acid + 20 mL sodium acetate, dilute to 100 mL.",
      },
      {
        q: "If you wanted pH 5.04 instead of 4.74 with the same total 0.20 M, do you use MORE acetate or MORE acetic acid?",
        a: "pH = pK_a + 0.30 ⇒ [A⁻]/[HA] = 10^0.30 = 2.0. So MORE acetate (the conjugate base). Specifically [A⁻] = 0.133 M, [HA] = 0.067 M. Volumes: ~26.7 mL acetate + ~13.3 mL acid in 100 mL.",
      },
      {
        q: "Add 1.00 mL of 0.50 M HCl to the pH-4.74 buffer above. Final pH?",
        a: "Add 0.50 mmol H⁺. Reacts with A⁻: n_A⁻ goes 10.00 → 9.50 mmol; n_HA goes 10.00 → 10.50 mmol.  pH = 4.74 + log(9.50/10.50) = 4.74 − 0.0436 = 4.70. (Practically unchanged — the buffer wins.)",
      },
    ],
  },
  {
    id: "pq-titrations",
    title: "Quiz 6 — Acid-base titrations",
    expId: "exp6",
    questions: [
      {
        q: "Titrate 25.00 mL of 0.1000 M acetic acid (pK_a = 4.74) with 0.1000 M NaOH. Find pH at: (a) 0 mL, (b) 12.50 mL, (c) 25.00 mL, (d) 30.00 mL.",
        a: "(a) Pure HA: [H⁺] = √(K_a·C) = √(10⁻⁴·⁷⁴·0.1000) = 1.35×10⁻³ M ⇒ pH = 2.87.\n(b) Half-eq: pH = pK_a = 4.74.\n(c) Equiv: all HA→A⁻ at 0.0500 M; K_b = K_w/K_a = 5.5×10⁻¹⁰; [OH⁻] = √(C·K_b) = 5.2×10⁻⁶; pH = 8.72.\n(d) Past eq: 5.00 mL excess NaOH = 0.500 mmol in 55.00 mL ⇒ [OH⁻] = 9.09×10⁻³; pOH = 2.04; pH = 11.96.",
      },
      {
        q: "Why is phenolphthalein the right indicator for this titration but methyl orange (pK_a 3.4) is not?",
        a: "The equivalence pH = 8.72. Phenolphthalein transitions 8.3-10 — encompasses the equivalence pH, so the color change pinpoints it. Methyl orange transitions 3.1-4.4 — would change near the BUFFER region, completely missing the equiv pt.",
      },
      {
        q: "How many equivalence points would you see if you titrated 0.1 M H₃PO₄ instead?",
        a: "Three protons ⇒ THREE equiv pts (pK_a's at 2.15, 7.20, 12.4). The first two are sharp; the third is hard to see because pK_a3 is close to OH⁻ self-ionization. So in practice you may report 2 well-defined equivalence pts and note the third.",
      },
    ],
  },
  {
    id: "pq-ksp",
    title: "Quiz 7 — Ca(OH)₂ K_sp",
    questions: [
      {
        q: "Ca(OH)₂(s) ⇌ Ca²⁺(aq) + 2 OH⁻(aq). At 25 °C, [OH⁻] saturated solution = 0.0220 M. Compute K_sp.",
        a: "[Ca²⁺] = ½[OH⁻] = 0.0110 M.  K_sp = [Ca²⁺][OH⁻]² = (0.0110)(0.0220)² = 5.32×10⁻⁶.  Lit. value ≈ 5.5×10⁻⁶ — agrees.",
      },
      {
        q: "If you titrated 25.00 mL saturated Ca(OH)₂ with 0.0500 M HCl and reached endpoint at 11.0 mL, compute the experimental [OH⁻] and K_sp.",
        a: "n_OH = 0.0500·0.0110 = 5.50×10⁻⁴ mol.  [OH⁻] = 5.50×10⁻⁴/0.02500 = 0.0220 M.  Same as part (a) ⇒ K_sp = 5.32×10⁻⁶.",
      },
      {
        q: "Explain why you must filter undissolved Ca(OH)₂ before titrating.",
        a: "Otherwise solid sitting in the aliquot continues to dissolve as you remove ions, falsely INFLATING measured [OH⁻] and K_sp. Filtering captures only the saturated solution at equilibrium.",
      },
    ],
  },
];

// ----- Auto-derived question bank (practice + whyQA) ----------
const questionBank: BankQuestion[] = (() => {
  const out: BankQuestion[] = [];
  for (const exp of experiments) {
    const label = `${exp.num}. ${exp.short}`;
    exp.practice.forEach((p, i) => {
      out.push({
        id: `qb.${exp.id}.p${i}`,
        expId: exp.id,
        expLabel: label,
        q: p.q,
        a: p.solution,
        source: "practice",
      });
    });
    exp.whyQA.forEach((qa, i) => {
      out.push({
        id: `qb.${exp.id}.w${i}`,
        expId: exp.id,
        expLabel: label,
        q: qa.q,
        a: qa.a,
        source: "whyQA",
      });
    });
  }
  return out;
})();

// ----- Auto-derived flashcard deck ----------------------------
const flashcardDeck: FlashcardEntry[] = (() => {
  const out: FlashcardEntry[] = [];
  for (const exp of experiments) {
    const label = `${exp.num}. ${exp.short}`;
    exp.whyQA.forEach((qa, i) => {
      out.push({
        id: `fc.${exp.id}.w${i}`,
        expId: exp.id,
        expLabel: label,
        front: qa.q,
        back: qa.a,
        source: "whyQA",
      });
    });
    exp.errors.forEach((e, i) => {
      out.push({
        id: `fc.${exp.id}.e${i}`,
        expId: exp.id,
        expLabel: label,
        front: `Error: ${e.source}. What is the effect on the result?`,
        back: e.effect,
        source: "errors",
      });
    });
  }
  for (const g of formulaGroups) {
    g.items.forEach((it, i) => {
      const eq = Array.isArray(it.eq) ? it.eq.join("; ") : it.eq;
      out.push({
        id: `fc.formula.${g.heading.replace(/\W+/g, "_")}.${i}`,
        expId: "ref-formulas",
        expLabel: `Formula · ${g.heading}`,
        front: `Write the formula for: ${it.name}.`,
        back: eq + (it.note ? ` — ${it.note}` : ""),
        source: "formulas",
      });
    });
  }
  return out;
})();

// ----- Mock exam paper (~40 pts, 60 min) ----------------------
const mockExamPaper: MockQuestion[] = [
  {
    id: "me-q1",
    expId: "exp1",
    expLabel: "1. Initial rates",
    points: 4,
    prompt:
      "For 2 H₂O₂ → 2 H₂O + O₂: trial A [H₂O₂] = 0.030 M, r = 6.0×10⁻⁵ M/s; trial B [H₂O₂] = 0.060 M, r = 2.4×10⁻⁴ M/s. Find rate-law order m and k.",
    solution:
      "Doubling [H₂O₂] → 4× rate ⇒ m = 2. k = r/[H₂O₂]² = 6.0×10⁻⁵/(0.030)² = 0.067 M⁻¹·s⁻¹.",
    hint: "Take ratio of rates first.",
  },
  {
    id: "me-q2",
    expId: "exp2",
    expLabel: "2. Pseudo-first-order",
    points: 4,
    prompt:
      "ln A vs t for CV with excess [OH⁻] = 0.080 M is linear, slope = −2.5×10⁻² s⁻¹. Find k_obs and the true 2nd-order k. State units.",
    solution:
      "k_obs = 2.5×10⁻² s⁻¹.  k = k_obs/[OH⁻] = 2.5×10⁻²/0.080 = 0.31 M⁻¹·s⁻¹.",
  },
  {
    id: "me-q3",
    expId: "exp3",
    expLabel: "3. Le Chatelier",
    points: 3,
    prompt:
      "Co(H₂O)₆²⁺ + 4 Cl⁻ ⇌ CoCl₄²⁻ + 6 H₂O. Endothermic forward. Predict color (pink/blue) on (a) heating, (b) adding HCl, (c) diluting.",
    solution:
      "(a) Heat ⇒ shift forward (endo) ⇒ MORE blue. (b) Adding HCl raises [Cl⁻] ⇒ Q < K ⇒ shift forward ⇒ MORE blue. (c) Dilute ⇒ shift toward MORE solute particles (LHS = 5) ⇒ MORE pink.",
  },
  {
    id: "me-q4",
    expId: "exp4",
    expLabel: "4. Indicator pK_a",
    points: 3,
    prompt:
      "Indicator HIn ⇌ H⁺ + In⁻ has pK_a = 6.50. At pH 7.10, what fraction is in the In⁻ form? Sig figs.",
    solution:
      "pH − pK_a = 0.60 ⇒ [In⁻]/[HIn] = 10^0.60 = 4.0. Fraction In⁻ = 4.0/5.0 = 0.80 (2 sf).",
  },
  {
    id: "me-q5",
    expId: "exp5",
    expLabel: "5. Buffer",
    points: 4,
    prompt:
      "Prepare 250 mL of pH 9.00 buffer using NH₃ (pK_b = 4.75) / NH₄Cl. Total ammonia conc = 0.20 M. Find moles of each.",
    solution:
      "pK_a(NH₄⁺) = 14 − 4.75 = 9.25. pH = pK_a + log([NH₃]/[NH₄⁺]) ⇒ 9.00 − 9.25 = −0.25 = log ratio ⇒ [NH₃]/[NH₄⁺] = 0.562. Total = 0.20 M ⇒ [NH₄⁺] = 0.128 M, [NH₃] = 0.072 M. In 250 mL: 0.0320 mol NH₄Cl, 0.0180 mol NH₃.",
  },
  {
    id: "me-q6",
    expId: "exp6",
    expLabel: "6. Titration",
    points: 4,
    prompt:
      "Titrate 50.00 mL 0.1000 M HF (pK_a = 3.17) with 0.1000 M NaOH. Compute pH at (a) half-equivalence, (b) equivalence.",
    solution:
      "(a) Half-eq pH = pK_a = 3.17. (b) Equiv: all HF → F⁻ at C = 0.0500 M (in 100 mL). K_b = 10⁻¹⁴/10⁻³·¹⁷ = 1.48×10⁻¹¹. [OH⁻] = √(0.0500·1.48×10⁻¹¹) = 8.6×10⁻⁷; pOH = 6.07; pH = 7.93.",
  },
  {
    id: "me-q7",
    expId: "exp7",
    expLabel: "7. Calorimetry",
    points: 3,
    prompt:
      "50.0 mL 1.50 M HCl + 50.0 mL 1.50 M NaOH at 22.0 °C → 32.2 °C in coffee cup. Find ΔH per mole H⁺ neutralized. Density 1.0 g/mL, c = 4.18 J/g·°C.",
    solution:
      "q = (100 g)(4.18)(10.2) = 4264 J = 4.26 kJ.  n(H⁺) = 0.050·1.50 = 0.075 mol.  ΔH = −q/n = −4.26/0.075 = −56.9 kJ/mol.",
  },
  {
    id: "me-q8",
    expId: "exp8",
    expLabel: "8. Galvanic cell + Nernst",
    points: 4,
    prompt:
      "Construct a galvanic cell from Zn²⁺/Zn (E° = −0.76 V) and Cu²⁺/Cu (E° = +0.34 V). At 25 °C with [Cu²⁺] = 0.010 M, [Zn²⁺] = 1.50 M, what is E_cell?",
    solution:
      "E°_cell = 0.34 − (−0.76) = +1.10 V. n = 2. Q = [Zn²⁺]/[Cu²⁺] = 1.50/0.010 = 150.  E = 1.10 − (0.0592/2)·log 150 = 1.10 − (0.0296)(2.18) = 1.10 − 0.064 = 1.04 V.",
  },
  {
    id: "me-q9",
    expId: "exp8",
    expLabel: "8. Faraday",
    points: 3,
    prompt:
      "Plate Ag from AgNO₃(aq) at 0.250 A for 25.0 min onto a Pt cathode. Mass of Ag deposited?",
    solution:
      "Q = 0.250·1500 = 375 C.  n_e = 375/96485 = 3.886×10⁻³ mol. Ag⁺ + e⁻ → Ag, n = 1, n_Ag = 3.886×10⁻³.  m = 3.886×10⁻³·107.87 = 0.419 g.",
  },
  {
    id: "me-q10",
    expId: "exp9",
    expLabel: "9. Corrosion",
    points: 3,
    prompt:
      "An iron pipe in moist soil at pH 7 is connected (electrically) to (a) a magnesium block, (b) a copper pipe nearby. For each, identify whether iron is the anode or cathode and whether iron CORRODES faster or slower than alone.",
    solution:
      "(a) Mg E°(−2.37) ≪ Fe (−0.44) ⇒ Mg = anode, Fe = cathode → Fe is PROTECTED (slower corrosion).  (b) Cu E°(+0.34) > Fe ⇒ Fe = anode, Cu = cathode → Fe corrodes FASTER. Always pair Fe with metals MORE negative in E° to protect.",
  },
  {
    id: "me-q11",
    expId: "exp10",
    expLabel: "10. Coordination Δ_o",
    points: 4,
    prompt:
      "[Co(en)₃]³⁺ has λ_max = 470 nm. Compute Δ_o in kJ/mol. Predict observed color from the complement wheel.",
    solution:
      "E = hc/λ = (6.626×10⁻³⁴)(3.00×10⁸)/(470×10⁻⁹) = 4.23×10⁻¹⁹ J.  Δ_o = 4.23×10⁻¹⁹ · 6.022×10²³ = 2.55×10⁵ J/mol = 255 kJ/mol. Absorbs blue (430-490 nm) ⇒ complement = ORANGE color seen.",
  },
  {
    id: "me-q12",
    expId: "exp11",
    expLabel: "11. IR / functional groups",
    points: 3,
    prompt:
      "An IR spectrum shows: strong sharp band at 1735 cm⁻¹, no band 2500-3300, no band 3300-3500, C-H near 2950, strong 1200. Class? Reasoning.",
    solution:
      "C=O at 1735 ⇒ carbonyl. No broad O-H (so not acid/alcohol). No N-H (so not amide/amine). Strong band 1200 ⇒ C-O. Carbonyl + C-O + no acid/alcohol/amide ⇒ ESTER (R-COO-R'). Position 1735 also matches ester (slightly higher than ketone ~1715).",
  },
  {
    id: "me-q13",
    expId: "exp11",
    expLabel: "11. Polarity",
    points: 2,
    prompt:
      "Order CH₂Cl₂, CHCl₃, CCl₄ by molecular dipole moment. Justify.",
    solution:
      "CCl₄: 4 identical Cl, T_d symmetry → bond dipoles cancel → μ = 0.  CHCl₃: 3 Cl + 1 H, C₃v symmetry → partial cancel → μ ≈ 1.04 D.  CH₂Cl₂: 2 Cl + 2 H, C₂v → less cancellation → μ ≈ 1.60 D. Order: CH₂Cl₂ > CHCl₃ > CCl₄.",
  },
];

// ----- helpers -------------------------------------------------
function relatedLabelFor(id: string): string {
  const e = experiments.find((x) => x.id === id);
  if (e) return `${e.num}. ${e.short}`;
  if (id === "ref-formulas") return "Formulas";
  if (id === "ref-techniques") return "Lab techniques";
  if (id === "ref-safety") return "Safety";
  if (id === "ref-cram") return "Cram plan";
  return id;
}

function dueAfterBox(box: number): number {
  const days = [1, 1, 3, 7, 14, 30];
  const idx = MathJS.min(MathJS.max(box, 1), 5);
  return Date.now() + days[idx] * 24 * 60 * 60 * 1000;
}

function pickWeighted<T extends { id: string; expId: string }>(
  bank: T[],
  current: string | null
): T {
  if (bank.length === 0) throw new Error("empty bank");
  const pool = bank.filter((b) => b.id !== current);
  const arr = pool.length ? pool : bank;
  return arr[MathJS.floor(MathJS.random() * arr.length)];
}

function formatMMSS(totalSeconds: number): string {
  const s = MathJS.max(0, MathJS.floor(totalSeconds));
  const mm = String(MathJS.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// ----- TL;DR card --------------------------------------------
function TldrCard({ items }: { items: string[] }) {
  return (
    <Card collapsible defaultOpen>
      <CardHeader trailing={<Pill tone="success" size="sm">TL;DR</Pill>}>
        Must-know in 60 seconds
      </CardHeader>
      <CardBody>
        <Bullets items={items} />
      </CardBody>
    </Card>
  );
}

// ----- Step-faded worked example -----------------------------
function StepFadedExample({
  storageKey,
  steps,
}: {
  storageKey: string;
  steps: { setup: string; equation: string; plugIn: string; answer: string };
}) {
  const [stage, setStage] = useCanvasState<number>(storageKey, 0);
  const labels = ["Setup", "Equation", "Plug-in", "Answer"];
  const values = [steps.setup, steps.equation, steps.plugIn, steps.answer];
  const visibleCount = MathJS.min(stage + 1, 4);
  return (
    <Card collapsible defaultOpen>
      <CardHeader trailing={<Pill tone="info" size="sm">Worked example · step-faded</Pill>}>
        Try the next step before peeking
      </CardHeader>
      <CardBody>
        <Stack gap={10}>
          {values.slice(0, visibleCount).map((v, i) => (
            <Stack key={i} gap={4}>
              <Text weight="semibold">{labels[i]}</Text>
              <Para text={v} />
            </Stack>
          ))}
          <Row gap={8} wrap>
            <Button
              variant="primary"
              onClick={() => setStage((s) => MathJS.min(s + 1, 3))}
            >
              {stage >= 3 ? "All revealed" : `Reveal ${labels[stage + 1]}`}
            </Button>
            <Button variant="ghost" onClick={() => setStage(0)}>
              Reset
            </Button>
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
}

// ----- Related footer ----------------------------------------
function RelatedFooter({
  items,
  onNavigate,
}: {
  items: { id: string; why: string }[];
  onNavigate: (id: string) => void;
}) {
  return (
    <Card collapsible defaultOpen={false}>
      <CardHeader trailing={<Pill tone="info" size="sm">Related</Pill>}>
        Linked across the course
      </CardHeader>
      <CardBody>
        <Stack gap={8}>
          {items.map((r, i) => (
            <Row key={i} gap={10} align="start" wrap>
              <Pill tone="info" onClick={() => onNavigate(r.id)}>
                {relatedLabelFor(r.id)}
              </Pill>
              <Text tone="secondary" size="small">
                {r.why}
              </Text>
            </Row>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

// ============================================================
// FLASHCARDS PANE
// ============================================================
function FlashcardsPane() {
  const [store, setStore] = useCanvasState<LeitnerStore>("flashcards.leitner", {});
  const [filter, setFilter] = useCanvasState<string>("flashcards.filter", "all");
  const [showBack, setShowBack] = useState(false);
  const [pos, setPos] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const filteredDeck = useMemo(() => {
    if (filter === "all") return flashcardDeck;
    if (filter === "whyQA" || filter === "errors" || filter === "formulas")
      return flashcardDeck.filter((c) => c.source === filter);
    return flashcardDeck.filter((c) => c.expId === filter);
  }, [filter]);

  const dueCards = useMemo(() => {
    return filteredDeck.filter((c) => {
      const s = store[c.id];
      if (!s) return true;
      return s.due <= now;
    });
  }, [filteredDeck, store, now]);

  const card = dueCards[pos % MathJS.max(dueCards.length, 1)];

  useEffect(() => {
    setShowBack(false);
  }, [card?.id]);

  const grade = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (!card) return;
      setStore((prev) => {
        const cur = prev[card.id];
        const oldBox = cur?.box ?? 1;
        let nextBox = oldBox;
        if (rating === 1) nextBox = 1;
        else if (rating === 2) nextBox = MathJS.max(1, oldBox - 1);
        else if (rating === 3) nextBox = MathJS.min(5, oldBox + 1);
        else if (rating === 4) nextBox = MathJS.min(5, oldBox + 2);
        return {
          ...prev,
          [card.id]: { box: nextBox, due: dueAfterBox(nextBox), lastSeen: Date.now() },
        };
      });
      setPos((p) => p + 1);
      setShowBack(false);
    },
    [card, setStore]
  );

  // hotkeys: Space/Enter flips, 1-4 grades
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable
        )
          return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setShowBack((v) => !v);
      } else if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
        if (showBack) {
          e.preventDefault();
          grade(parseInt(e.key, 10) as 1 | 2 | 3 | 4);
        }
      } else if (e.key === "ArrowDown" || e.key === "n") {
        setPos((p) => p + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grade, showBack]);

  const totalDue = dueCards.length;
  const totalLearned = useMemo(() => {
    return Object.values(store).filter((s) => s.box >= 4).length;
  }, [store]);

  const filterOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [
      { value: "all", label: "All cards" },
      { value: "whyQA", label: "Why-Q&A" },
      { value: "errors", label: "Common errors" },
      { value: "formulas", label: "Formulas" },
    ];
    for (const e of experiments) opts.push({ value: e.id, label: `${e.num}. ${e.short}` });
    return opts;
  }, []);

  const boxCounts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0];
    for (const card of filteredDeck) {
      const b = store[card.id]?.box ?? 1;
      c[b] = (c[b] || 0) + 1;
    }
    return c;
  }, [filteredDeck, store]);

  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Flashcards (Leitner spaced-repetition)</H2>
        <Text tone="secondary">
          Auto-derived from why-Q&amp;A, common errors, and formulas. 5 boxes (1/3/7/14/30 day intervals).
          Press <Code>Space</Code> to flip; after the back is shown, press <Code>1</Code>=Again,{" "}
          <Code>2</Code>=Hard, <Code>3</Code>=Good, <Code>4</Code>=Easy. <Code>n</Code> = next without grading.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={`${totalDue}`} label="Due now" tone="warning" />
        <Stat value={`${flashcardDeck.length}`} label="Total cards" />
        <Stat value={`${totalLearned}`} label="In box 4-5 (learned)" tone="success" />
        <Stat
          value={`${MathJS.round((totalLearned / MathJS.max(flashcardDeck.length, 1)) * 100)}%`}
          label="Mastery"
          tone="info"
        />
      </Grid>

      <Card collapsible defaultOpen>
        <CardHeader>Filter deck</CardHeader>
        <CardBody>
          <Row gap={6} wrap>
            {filterOptions.map((opt) => (
              <Pill
                key={opt.value}
                active={filter === opt.value}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </Pill>
            ))}
          </Row>
        </CardBody>
      </Card>

      <Card collapsible defaultOpen>
        <CardHeader trailing={<Pill tone="info" size="sm">{card?.expLabel ?? "—"}</Pill>}>
          {dueCards.length > 0 ? `Card ${(pos % dueCards.length) + 1} of ${dueCards.length}` : "Done!"}
        </CardHeader>
        <CardBody>
          {dueCards.length === 0 ? (
            <Callout tone="success" title="All caught up">
              <Text>
                No cards due in this filter. Come back later or switch filters above.
              </Text>
            </Callout>
          ) : (
            <Stack gap={12}>
              <Stack gap={6}>
                <Text weight="semibold">Front</Text>
                <Para text={card.front} />
              </Stack>
              {showBack ? (
                <>
                  <Divider />
                  <Stack gap={6}>
                    <Text weight="semibold">Back</Text>
                    <Para text={card.back} />
                  </Stack>
                  <Row gap={6} wrap>
                    <Button variant="secondary" onClick={() => grade(1)}>1 · Again</Button>
                    <Button variant="secondary" onClick={() => grade(2)}>2 · Hard</Button>
                    <Button variant="primary" onClick={() => grade(3)}>3 · Good</Button>
                    <Button variant="primary" onClick={() => grade(4)}>4 · Easy</Button>
                  </Row>
                </>
              ) : (
                <Row gap={6} wrap>
                  <Button variant="primary" onClick={() => setShowBack(true)}>
                    Show back (Space)
                  </Button>
                  <Button variant="ghost" onClick={() => setPos((p) => p + 1)}>
                    Skip
                  </Button>
                </Row>
              )}
            </Stack>
          )}
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader>Box distribution</CardHeader>
        <CardBody>
          <Table
            headers={["Box", "Cards", "Interval"]}
            columnAlign={["center", "center", "left"]}
            rows={[1, 2, 3, 4, 5].map((b) => [
              `${b}`,
              `${boxCounts[b] ?? 0}`,
              ["new / again", "1 day", "3 days", "7 days", "14 days", "30 days"][b],
            ])}
          />
          <Row gap={6} wrap style={{ marginTop: 10 }}>
            <Button
              variant="ghost"
              onClick={() => {
                if (window.confirm("Reset all flashcard progress?")) setStore({});
              }}
            >
              Reset progress
            </Button>
          </Row>
        </CardBody>
      </Card>
    </Stack>
  );
}

// ============================================================
// QUIZ MODE PANE
// ============================================================
const initialQuiz: QuizState = {
  current: null,
  showAnswer: false,
  attemptsById: {},
  correctById: {},
  streak: 0,
  bestStreak: 0,
  lastResult: null,
};

function QuizPane({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [state, setState] = useCanvasState<QuizState>("quiz.state", initialQuiz);
  const [filter, setFilter] = useCanvasState<string>("quiz.filter", "all");

  const filteredBank = useMemo(() => {
    if (filter === "all") return questionBank;
    return questionBank.filter((q) => q.expId === filter);
  }, [filter]);

  const draw = useCallback(() => {
    if (filteredBank.length === 0) return;
    const next = pickWeighted(filteredBank, state.current);
    setState((s) => ({ ...s, current: next.id, showAnswer: false, lastResult: null }));
  }, [filteredBank, setState, state.current]);

  useEffect(() => {
    if (!state.current) {
      const next = pickWeighted(filteredBank, null);
      setState((s) => ({ ...s, current: next.id, showAnswer: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = useMemo(
    () =>
      filteredBank.find((q) => q.id === state.current) ??
      questionBank.find((q) => q.id === state.current) ??
      filteredBank[0] ??
      questionBank[0],
    [filteredBank, state.current]
  );

  const grade = useCallback(
    (correct: boolean) => {
      if (!current) return;
      setState((s) => {
        const newCorrect = { ...s.correctById };
        const newAttempts = { ...s.attemptsById };
        newAttempts[current.expId] = (newAttempts[current.expId] ?? 0) + 1;
        if (correct) newCorrect[current.expId] = (newCorrect[current.expId] ?? 0) + 1;
        const newStreak = correct ? s.streak + 1 : 0;
        return {
          ...s,
          correctById: newCorrect,
          attemptsById: newAttempts,
          streak: newStreak,
          bestStreak: MathJS.max(s.bestStreak, newStreak),
          lastResult: correct ? "right" : "wrong",
        };
      });
      window.setTimeout(() => {
        const next = pickWeighted(filteredBank, current.id);
        setState((s) => ({ ...s, current: next.id, showAnswer: false, lastResult: null }));
      }, 800);
    },
    [current, filteredBank, setState]
  );

  const accuracy = useMemo(() => {
    return experiments
      .map((e) => {
        const total = state.attemptsById[e.id] ?? 0;
        const correct = state.correctById[e.id] ?? 0;
        const pct = total === 0 ? null : MathJS.round((correct / total) * 100);
        return { exp: e, total, correct, pct };
      })
      .sort((a, b) => {
        if (a.pct == null && b.pct == null) return 0;
        if (a.pct == null) return 1;
        if (b.pct == null) return -1;
        return a.pct - b.pct;
      });
  }, [state.attemptsById, state.correctById]);

  const filterOptions = [
    { value: "all", label: "All experiments" },
    ...experiments.map((e) => ({ value: e.id, label: `${e.num}. ${e.short}` })),
  ];

  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Quiz mode (interleaved random sampler)</H2>
        <Text tone="secondary">
          Random question from the practice + Q&amp;A bank. Reveal the solution, self-grade right
          or wrong. Streak counter + per-experiment accuracy below.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={`${state.streak}`} label="Current streak" tone={state.streak > 0 ? "success" : "info"} />
        <Stat value={`${state.bestStreak}`} label="Best streak" />
        <Stat value={`${questionBank.length}`} label="Bank size" />
        <Stat
          value={`${
            Object.values(state.attemptsById).reduce((a, b) => a + b, 0)
          }`}
          label="Total attempts"
        />
      </Grid>

      <Card collapsible defaultOpen>
        <CardHeader>Filter pool</CardHeader>
        <CardBody>
          <Row gap={6} wrap>
            {filterOptions.map((opt) => (
              <Pill
                key={opt.value}
                active={filter === opt.value}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </Pill>
            ))}
          </Row>
        </CardBody>
      </Card>

      <Card collapsible defaultOpen>
        <CardHeader
          trailing={
            <Row gap={6}>
              {state.lastResult === "right" && <Pill tone="success" size="sm">✓ Correct</Pill>}
              {state.lastResult === "wrong" && <Pill tone="warning" size="sm">✗ Missed</Pill>}
              <Pill tone="info" size="sm">{current?.expLabel ?? ""}</Pill>
            </Row>
          }
        >
          Question
        </CardHeader>
        <CardBody>
          {!current ? (
            <Text>No questions in this filter.</Text>
          ) : (
            <Stack gap={12}>
              <Para text={current.q} />
              {state.showAnswer ? (
                <>
                  <Divider />
                  <Callout tone="success" title="Solution">
                    <Para text={current.a} />
                  </Callout>
                  <Row gap={6} wrap>
                    <Button variant="primary" onClick={() => grade(true)}>
                      I got it right
                    </Button>
                    <Button variant="secondary" onClick={() => grade(false)}>
                      Missed it
                    </Button>
                    <Button variant="ghost" onClick={() => onNavigate(current.expId)}>
                      Open this experiment →
                    </Button>
                  </Row>
                </>
              ) : (
                <Row gap={6} wrap>
                  <Button variant="primary" onClick={() => setState((s) => ({ ...s, showAnswer: true }))}>
                    Show solution
                  </Button>
                  <Button variant="ghost" onClick={draw}>
                    Skip / new question
                  </Button>
                </Row>
              )}
            </Stack>
          )}
        </CardBody>
      </Card>

      <Card collapsible defaultOpen={false}>
        <CardHeader>Accuracy heatmap (your weakest experiments first)</CardHeader>
        <CardBody>
          <Table
            headers={["Experiment", "Attempts", "Correct", "Accuracy"]}
            columnAlign={["left", "center", "center", "center"]}
            rows={accuracy.map((a) => [
              <Pill onClick={() => onNavigate(a.exp.id)}>{`${a.exp.num}. ${a.exp.short}`}</Pill>,
              `${a.total}`,
              `${a.correct}`,
              a.pct == null ? "—" : `${a.pct}%`,
            ])}
            rowTone={accuracy.map((a) =>
              a.pct == null
                ? undefined
                : a.pct < 50
                ? ("warning" as const)
                : a.pct >= 80
                ? ("info" as const)
                : undefined
            )}
          />
          <Row gap={6} wrap style={{ marginTop: 10 }}>
            <Button
              variant="ghost"
              onClick={() => {
                if (window.confirm("Reset quiz progress?")) setState(initialQuiz);
              }}
            >
              Reset quiz
            </Button>
          </Row>
        </CardBody>
      </Card>
    </Stack>
  );
}

// ============================================================
// MOCK EXAM PANE
// ============================================================
const initialMock: MockState = {
  startedAt: null,
  remaining: MOCK_DURATION_SEC,
  responses: {},
  selfScore: {},
  submitted: false,
  history: [],
};

function MockExamPane() {
  const [state, setState] = useCanvasState<MockState>("mock.state", initialMock);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!state.startedAt || state.submitted) return;
    const t = window.setInterval(() => setTick((x) => x + 1), 1000);
    return () => window.clearInterval(t);
  }, [state.startedAt, state.submitted]);

  const remainingNow = useMemo(() => {
    if (!state.startedAt || state.submitted) return state.remaining;
    const elapsed = MathJS.floor((Date.now() - state.startedAt) / 1000);
    return MathJS.max(0, MOCK_DURATION_SEC - elapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.startedAt, state.submitted, state.remaining, tick]);

  const submit = useCallback(() => {
    setState((s) => {
      if (!s.startedAt || s.submitted) return s;
      const finishedAt = Date.now();
      const durationSec = MathJS.min(
        MOCK_DURATION_SEC,
        MathJS.floor((finishedAt - s.startedAt) / 1000)
      );
      const score = mockExamPaper.reduce((acc, q) => {
        const sc = s.selfScore[q.id];
        return acc + (typeof sc === "number" ? sc : 0);
      }, 0);
      const attempt: MockAttempt = {
        finishedAt,
        durationSec,
        score,
        perQ: { ...s.selfScore },
      };
      return {
        ...s,
        submitted: true,
        remaining: MathJS.max(0, MOCK_DURATION_SEC - durationSec),
        history: [...s.history, attempt],
      };
    });
  }, [setState]);

  useEffect(() => {
    if (state.startedAt && !state.submitted && remainingNow <= 0) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingNow]);

  const start = () => {
    setState({
      startedAt: Date.now(),
      remaining: MOCK_DURATION_SEC,
      responses: {},
      selfScore: {},
      submitted: false,
      history: state.history,
    });
  };

  const reset = () => {
    if (window.confirm("Reset the current attempt? (history is preserved)"))
      setState({ ...initialMock, history: state.history });
  };

  const totalPoints = mockExamPaper.reduce((a, b) => a + b.points, 0);
  const yourScore = mockExamPaper.reduce(
    (a, b) => a + (typeof state.selfScore[b.id] === "number" ? state.selfScore[b.id] : 0),
    0
  );
  const lowTime = remainingNow > 0 && remainingNow < 600;

  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Mock exam — 60 minutes, ~40 points</H2>
        <Text tone="secondary">
          Twelve to thirteen problems mirroring the real lab final&apos;s mix. Solutions stay
          hidden until you submit (or the timer runs out). Self-grade each problem 0 / partial /
          full once revealed.
        </Text>
      </Stack>

      <Card>
        <CardBody>
          <Row gap={12} align="center" justify="between" wrap>
            <Row gap={12} align="center" wrap>
              <Stat
                value={formatMMSS(remainingNow)}
                label="Time left"
                tone={lowTime ? "warning" : state.startedAt ? "info" : undefined}
              />
              <Stat value={`${totalPoints}`} label="Total points" />
              <Stat
                value={`${yourScore.toFixed(1)}`}
                label={state.submitted ? "Your score" : "Self-graded so far"}
                tone={state.submitted ? "success" : "info"}
              />
            </Row>
            <Row gap={6} wrap>
              {!state.startedAt && (
                <Button variant="primary" onClick={start}>
                  Start mock exam
                </Button>
              )}
              {state.startedAt && !state.submitted && (
                <Button variant="primary" onClick={submit}>
                  Submit now
                </Button>
              )}
              {(state.startedAt || state.submitted) && (
                <Button variant="ghost" onClick={reset}>
                  Reset attempt
                </Button>
              )}
            </Row>
          </Row>
        </CardBody>
      </Card>

      {!state.startedAt && !state.submitted && (
        <Callout tone="info" title="Before you start">
          <Stack gap={6}>
            <Text>
              Have a calculator and your formula reference next to you. The clock starts as soon as
              you press <Code>Start mock exam</Code>. Solutions stay locked until you submit.
            </Text>
            <Text tone="secondary" size="small">
              Strategy: read all 13 problems first; do the calculations you&apos;re fastest at FIRST.
              ~1.5 min per point on average.
            </Text>
          </Stack>
        </Callout>
      )}

      <Stack gap={12}>
        {mockExamPaper.map((q, i) => (
          <Card key={q.id} collapsible defaultOpen>
            <CardHeader
              trailing={
                <Row gap={6}>
                  <Pill tone="info" size="sm">{q.expLabel}</Pill>
                  <Pill tone="neutral" size="sm">{q.points} pt</Pill>
                </Row>
              }
            >
              Question {i + 1}
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Para text={q.prompt} />
                <textarea
                  className="cs-textarea"
                  placeholder="Your work here…"
                  rows={4}
                  value={state.responses[q.id] ?? ""}
                  disabled={state.submitted || !state.startedAt}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      responses: { ...s.responses, [q.id]: e.target.value },
                    }))
                  }
                  style={{
                    width: "100%",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: "0.92em",
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--cs-border, rgba(127,127,127,0.3))",
                    background: "transparent",
                    color: "inherit",
                    resize: "vertical",
                  }}
                />
                {q.hint && !state.submitted && (
                  <Text tone="tertiary" size="small">
                    Hint: {q.hint}
                  </Text>
                )}
                {state.submitted && (
                  <>
                    <Callout tone="success" title="Solution">
                      <Para text={q.solution} />
                    </Callout>
                    <Row gap={6} align="center" wrap>
                      <Text tone="secondary" size="small">
                        Self-grade:
                      </Text>
                      {[
                        { label: "0 (missed)", value: 0 },
                        { label: `½ (${(q.points / 2).toFixed(1)} partial)`, value: q.points / 2 },
                        { label: `Full (${q.points})`, value: q.points },
                      ].map((opt) => (
                        <Pill
                          key={opt.label}
                          active={state.selfScore[q.id] === opt.value}
                          tone={
                            state.selfScore[q.id] === q.points
                              ? "success"
                              : state.selfScore[q.id] === 0
                              ? "warning"
                              : "info"
                          }
                          onClick={() =>
                            setState((s) => ({
                              ...s,
                              selfScore: { ...s.selfScore, [q.id]: opt.value },
                            }))
                          }
                        >
                          {opt.label}
                        </Pill>
                      ))}
                    </Row>
                  </>
                )}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>

      {state.history.length > 0 && (
        <Card collapsible defaultOpen={false}>
          <CardHeader>Attempt history</CardHeader>
          <CardBody>
            <Table
              headers={["Finished", "Time used", "Score", "%"]}
              columnAlign={["left", "center", "center", "center"]}
              rows={state.history
                .slice()
                .reverse()
                .map((a) => [
                  new Date(a.finishedAt).toLocaleString(),
                  formatMMSS(a.durationSec),
                  `${a.score.toFixed(1)} / ${totalPoints}`,
                  `${MathJS.round((a.score / totalPoints) * 100)}%`,
                ])}
            />
            <Row gap={6} wrap style={{ marginTop: 10 }}>
              <Button
                variant="ghost"
                onClick={() => {
                  if (window.confirm("Clear attempt history?"))
                    setState((s) => ({ ...s, history: [] }));
                }}
              >
                Clear history
              </Button>
            </Row>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}

// ============================================================
// CROSS-CUTTING / MNEMONICS / TRAPS / PAST QUIZZES
// ============================================================
function CrossCuttingPane({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Cross-cutting concepts (the high-leverage threads)</H2>
        <Text tone="secondary">
          Skibo loves a question that&apos;s &quot;kinetics&quot; on the surface but really tests
          the same Beer&apos;s-Law/Q-vs-K/Henderson-Hasselbalch backbone you saw in five other
          experiments. Drill these concept threads, not the experiments individually.
        </Text>
      </Stack>
      {crossCutting.map((c, i) => (
        <Card key={i} collapsible defaultOpen={i < 2}>
          <CardHeader
            trailing={
              <Row gap={6} wrap>
                {c.expIds.map((id) => (
                  <Pill key={id} tone="info" size="sm" onClick={() => onNavigate(id)}>
                    {relatedLabelFor(id)}
                  </Pill>
                ))}
              </Row>
            }
          >
            {c.title}
          </CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>{c.blurb}</Text>
              <Bullets items={c.bullets} />
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}

function MnemonicsPane() {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Mnemonics &amp; memory hooks</H2>
        <Text tone="secondary">
          The cheap tricks that turn 'I almost remember it' into 'I know it cold' under exam time pressure.
        </Text>
      </Stack>
      <Grid columns={2} gap={12}>
        {mnemonics.map((m, i) => (
          <Card key={i} collapsible defaultOpen={i < 4}>
            <CardHeader trailing={<Pill tone="success" size="sm">Mnemonic</Pill>}>
              {m.title}
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text weight="semibold">{m.body}</Text>
                {m.cues && m.cues.length > 0 && <Bullets items={m.cues} />}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

function TrapsPane({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Skibo traps &amp; gotchas</H2>
        <Text tone="secondary">
          Real mistakes from past quizzes. Each card pairs the BAIT (the wrong-but-tempting move)
          with the CATCH (the rule that tells you what to do instead). If you can paraphrase every
          catch from memory, you've protected ~10-15 points.
        </Text>
      </Stack>
      <Stack gap={10}>
        {skiboTraps.map((t, i) => (
          <Card key={i} collapsible defaultOpen={i < 4}>
            <CardHeader
              trailing={
                t.expId ? (
                  <Pill tone="info" size="sm" onClick={() => onNavigate(t.expId!)}>
                    {relatedLabelFor(t.expId)}
                  </Pill>
                ) : (
                  <Pill tone="warning" size="sm">General</Pill>
                )
              }
            >
              {t.title}
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Stack gap={4}>
                  <Pill tone="warning" size="sm">Bait</Pill>
                  <Para text={t.bait} />
                </Stack>
                <Stack gap={4}>
                  <Pill tone="success" size="sm">Catch</Pill>
                  <Para text={t.catch} />
                </Stack>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

function PastQuizzesPane({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <Stack gap={16}>
      <Stack gap={4}>
        <H2>Past quizzes (replay)</H2>
        <Text tone="secondary">
          Verbatim transcriptions of seven prior Skibo quizzes (Initial-rate kinetics through
          Ksp). Every solution is hidden behind a click — try the question first; reveal only after
          you've committed an answer. These are the highest-yield drill on the entire site.
        </Text>
      </Stack>
      <Stack gap={12}>
        {pastQuizzes.map((q) => (
          <Card key={q.id} collapsible defaultOpen={false}>
            <CardHeader
              trailing={
                q.expId ? (
                  <Pill tone="info" size="sm" onClick={() => onNavigate(q.expId!)}>
                    {relatedLabelFor(q.expId)}
                  </Pill>
                ) : null
              }
            >
              {q.title}
            </CardHeader>
            <CardBody>
              <Stack gap={14}>
                {q.questions.map((qq, i) => (
                  <PastQuizCard key={i} index={i} question={qq} storageKey={`pastquiz.${q.id}.${i}`} />
                ))}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

function PastQuizCard({
  index,
  question,
  storageKey,
}: {
  index: number;
  question: PastQuizQ;
  storageKey: string;
}) {
  const [open, setOpen] = useCanvasState<boolean>(storageKey, false);
  return (
    <Stack gap={6}>
      <Text weight="semibold">Question {index + 1}</Text>
      <Para text={question.q} />
      <Row gap={6}>
        <Button variant={open ? "secondary" : "primary"} onClick={() => setOpen((v) => !v)}>
          {open ? "Hide solution" : "Show solution"}
        </Button>
      </Row>
      {open && (
        <Callout tone="success" title="Worked solution">
          <Para text={question.a} />
        </Callout>
      )}
    </Stack>
  );
}

// ------------------------------------------------------------
// NAV
// ------------------------------------------------------------

type NavItem = {
  id: string;
  label: string;
  group: "experiment" | "study" | "reference";
};

const navItems: NavItem[] = [
  ...experiments.map((e) => ({
    id: e.id,
    label: `${e.num}. ${e.short}`,
    group: "experiment" as const,
  })),
  { id: "tools-flashcards", label: "Flashcards (SR)", group: "study" },
  { id: "tools-quiz", label: "Quiz mode", group: "study" },
  { id: "tools-mock", label: "Mock exam (60 min)", group: "study" },
  { id: "tools-traps", label: "Skibo traps", group: "study" },
  { id: "tools-past", label: "Past quizzes", group: "study" },
  { id: "tools-cross", label: "Cross-cutting", group: "study" },
  { id: "tools-mnemonics", label: "Mnemonics", group: "study" },
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
  group: "experiment" | "study" | "reference";
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
    const extras = experimentExtras[exp.id];
    if (extras) {
      extras.tldr.forEach((t) => out.push({ ...meta, context: "TL;DR", text: t }));
      if (extras.stepFaded) {
        out.push({
          ...meta,
          context: "Worked example",
          text: `${extras.stepFaded.setup} ${extras.stepFaded.equation} ${extras.stepFaded.plugIn} ${extras.stepFaded.answer}`,
        });
      }
      extras.related?.forEach((r) =>
        out.push({
          ...meta,
          context: "Related",
          text: `${relatedLabelFor(r.id)} — ${r.why}`,
        })
      );
    }
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

  const studyMeta = (id: string, label: string) => ({
    sectionId: id,
    sectionLabel: label,
    group: "study" as const,
  });

  crossCutting.forEach((c) => {
    out.push({
      ...studyMeta("tools-cross", "Cross-cutting"),
      context: c.title,
      text: c.blurb,
    });
    c.bullets.forEach((b) =>
      out.push({
        ...studyMeta("tools-cross", "Cross-cutting"),
        context: c.title,
        text: b,
      })
    );
  });
  mnemonics.forEach((m) => {
    out.push({
      ...studyMeta("tools-mnemonics", "Mnemonics"),
      context: m.title,
      text: m.body,
    });
    m.cues?.forEach((c) =>
      out.push({
        ...studyMeta("tools-mnemonics", "Mnemonics"),
        context: m.title,
        text: c,
      })
    );
  });
  skiboTraps.forEach((t) => {
    out.push({
      ...studyMeta("tools-traps", "Skibo traps"),
      context: t.title,
      text: `Bait: ${t.bait}`,
    });
    out.push({
      ...studyMeta("tools-traps", "Skibo traps"),
      context: t.title,
      text: `Catch: ${t.catch}`,
    });
  });
  pastQuizzes.forEach((q) => {
    q.questions.forEach((qq, i) => {
      out.push({
        ...studyMeta("tools-past", "Past quizzes"),
        context: `${q.title} · Q${i + 1}`,
        text: qq.q,
      });
      out.push({
        ...studyMeta("tools-past", "Past quizzes"),
        context: `${q.title} · Q${i + 1} answer`,
        text: qq.a,
      });
    });
  });
  mockExamPaper.forEach((q, i) => {
    out.push({
      ...studyMeta("tools-mock", "Mock exam"),
      context: `Q${i + 1} · ${q.expLabel}`,
      text: q.prompt,
    });
  });
  flashcardDeck.slice(0, 250).forEach((c) =>
    out.push({
      ...studyMeta("tools-flashcards", "Flashcards"),
      context: c.expLabel,
      text: `${c.front} — ${c.back}`,
    })
  );
  questionBank.slice(0, 250).forEach((c) =>
    out.push({
      ...studyMeta("tools-quiz", "Quiz mode"),
      context: c.expLabel,
      text: c.q,
    })
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
              STUDY TOOLS
            </Text>
            <Stack gap={6}>
              {navItems
                .filter((n) => n.group === "study")
                .map((n) => (
                  <Pill
                    key={n.id}
                    active={section === n.id}
                    tone="info"
                    onClick={() => navigate(n.id)}
                    style={{ width: "100%", justifyContent: "flex-start" }}
                  >
                    {n.label}
                  </Pill>
                ))}
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
                <FlashcardsPane />
              </div>
              <div className="cs-print-section">
                <QuizPane onNavigate={navigate} />
              </div>
              <div className="cs-print-section">
                <MockExamPane />
              </div>
              <div className="cs-print-section">
                <TrapsPane onNavigate={navigate} />
              </div>
              <div className="cs-print-section">
                <PastQuizzesPane onNavigate={navigate} />
              </div>
              <div className="cs-print-section">
                <CrossCuttingPane onNavigate={navigate} />
              </div>
              <div className="cs-print-section">
                <MnemonicsPane />
              </div>
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
              {section === "tools-flashcards" && <FlashcardsPane />}
              {section === "tools-quiz" && <QuizPane onNavigate={navigate} />}
              {section === "tools-mock" && <MockExamPane />}
              {section === "tools-traps" && <TrapsPane onNavigate={navigate} />}
              {section === "tools-past" && <PastQuizzesPane onNavigate={navigate} />}
              {section === "tools-cross" && <CrossCuttingPane onNavigate={navigate} />}
              {section === "tools-mnemonics" && <MnemonicsPane />}
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

