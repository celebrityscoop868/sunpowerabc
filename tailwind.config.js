/** @type {import('tailwindcss').Config} */
export default {
  // ✅ Mantengo lo del repo actual (necesario)
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  // ✅ Tomo del antiguo lo que SÍ sirve sin meterte toda la basura de shadcn
  darkMode: ["class"],

  theme: {
    extend: {
      // ✅ útil (no rompe nada aunque no uses --radius todavía)
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },

      // ✅ dejo keyframes/animation SOLO si vas a usar tailwindcss-animate
      // (no te meto los colores HSL de shadcn porque NO los estás usando)
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  // ✅ Si NO tienes instalado tailwindcss-animate, déjalo vacío.
  // ✅ Si SÍ lo tienes instalado, deja esta línea.
  plugins: [require("tailwindcss-animate")],
};
