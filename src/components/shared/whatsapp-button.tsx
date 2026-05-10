"use client";

export function WhatsAppButton() {
  const phone = "15816340224";
  const message = encodeURIComponent(
    "Hello IDLOGICE! I'm interested in Canadian immigration services. Could you help me?"
  );
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 hover:bg-[#20bc5a] hover:shadow-[#25D366]/60 hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden group"
      style={{ boxShadow: "0 4px 20px rgba(37,211,102,0.45)" }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40 pointer-events-none" style={{ animationDuration: "2.5s" }} />

      {/* Icon + label */}
      <span className="relative z-10 flex items-center gap-2.5 pl-3 pr-4 py-3">
        {/* WhatsApp SVG */}
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0 fill-white" aria-hidden="true">
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.82.736 5.466 2.022 7.761L0 32l8.469-2.001A15.94 15.94 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333a13.29 13.29 0 0 1-6.784-1.852l-.487-.289-4.996 1.181 1.244-4.867-.319-.503A13.269 13.269 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667c7.363 0 13.333 5.97 13.333 13.333 0 7.364-5.97 13.333-13.333 13.333zm7.322-9.988c-.4-.2-2.365-1.166-2.732-1.3-.367-.133-.634-.2-.901.2-.267.4-1.032 1.3-1.265 1.567-.233.267-.467.3-.867.1-.4-.2-1.688-.622-3.216-1.984-1.188-1.06-1.99-2.37-2.223-2.77-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.901-2.166-1.234-2.966-.325-.778-.655-.672-.901-.685l-.768-.013c-.267 0-.7.1-1.067.5-.367.4-1.4 1.366-1.4 3.332 0 1.967 1.434 3.866 1.634 4.133.2.267 2.82 4.3 6.833 6.033.955.412 1.7.659 2.282.843.959.305 1.832.262 2.52.159.769-.115 2.365-.967 2.699-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z"/>
        </svg>
        <span className="text-sm font-bold leading-none hidden sm:block">Chat with us</span>
      </span>
    </a>
  );
}
