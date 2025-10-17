import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let initialized = false;

const resources = {
  es: {
    translation: {
      hero: {
        title: "Experiencias que honran el cuidado mutuo",
        subtitle:
          "Diseñamos acuerdos vivos entre personas y colectivos para sostener vínculos seguros y consentidos.",
        cta: "Comenzar"
      },
      onboarding: {
        heading: "Tu llegada",
        intro: "Compartí tu intención para personalizar la experiencia.",
        consent: "Consentimiento informado",
        profile: "Tu presencia",
        finish: "Ir a momentos"
      },
      moments: {
        newTitle: "Nuevo momento",
        submit: "Guardar borrador",
        preview: "Simulación ERD",
        viewRestricted: "Este momento está protegido.",
        viewRedacted: "Algunos detalles fueron ocultados por políticas activas.",
        safe: "Ir a modo contención"
      },
      agreements: {
        reviewTitle: "Revisá el acuerdo",
        overlayClose: "Cerrar revisión"
      },
      safe: {
        title: "Modo contención",
        description: "Respirá. Tus datos quedan congelados hasta que decidas volver.",
        resume: "Reanudar recorrido"
      },
      settings: {
        title: "Preferencias",
        motion: "Reducir animaciones",
        presence: "Intensidad de presencia",
        privacy: "Privacidad",
        save: "Guardar cambios"
      }
    }
  },
  en: {
    translation: {
      hero: {
        title: "Experiences that honour mutual care",
        subtitle: "We co-create living agreements for safe, consentful relationships.",
        cta: "Begin"
      }
    }
  }
};

export function ensureI18n() {
  if (!initialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: "es",
      fallbackLng: "en",
      interpolation: { escapeValue: false }
    });
    initialized = true;
  }
  return i18n;
}
