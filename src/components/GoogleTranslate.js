import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Dynamically load the Google Translate script
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="
        fixed top-4 left-4 z-[1000]
        bg-white/80 backdrop-blur-sm
        border border-gray-300 shadow-md
        rounded-xl px-2 py-1
        text-sm text-gray-700
        hover:shadow-lg transition-shadow duration-300
      "
    ></div>
  );
}
