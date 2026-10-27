"use client";

// Декоративный анимированный фон — плавающие элементы
// Помечен как "use client" так как использует анимации

export default function FloatingBackground() {
  return (
    // pointer-events-none — фон не перехватывает клики
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* ── Большие размытые пятна цвета (сеть градиентов) ── */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(252, 231, 243, 0.8) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(233, 213, 255, 0.8) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 207, 232, 0.7) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Плавающие эмодзи / символы ── */}

      {/* Вишнёвые цветки */}
      <span
        className="absolute text-3xl select-none"
        style={{
          top: "8%",
          left: "7%",
          animation: "float 7s ease-in-out infinite",
          animationDelay: "0s",
          opacity: 0.6,
        }}
      >
        🌸
      </span>
      <span
        className="absolute text-2xl select-none"
        style={{
          top: "15%",
          right: "10%",
          animation: "float 9s ease-in-out infinite",
          animationDelay: "1.5s",
          opacity: 0.5,
        }}
      >
        🌸
      </span>
      <span
        className="absolute text-xl select-none"
        style={{
          bottom: "25%",
          left: "5%",
          animation: "float 6s ease-in-out infinite",
          animationDelay: "3s",
          opacity: 0.45,
        }}
      >
        🌺
      </span>

      {/* Сердечки */}
      <span
        className="absolute text-xl select-none"
        style={{
          top: "40%",
          left: "3%",
          animation: "float 8s ease-in-out infinite",
          animationDelay: "0.8s",
          opacity: 0.5,
        }}
      >
        💕
      </span>
      <span
        className="absolute text-2xl select-none"
        style={{
          bottom: "15%",
          right: "8%",
          animation: "float 7s ease-in-out infinite",
          animationDelay: "2s",
          opacity: 0.45,
        }}
      >
        🩷
      </span>
      <span
        className="absolute text-lg select-none"
        style={{
          top: "65%",
          right: "4%",
          animation: "float 5s ease-in-out infinite",
          animationDelay: "4s",
          opacity: 0.4,
        }}
      >
        💗
      </span>

      {/* Звёздочки и искорки */}
      <span
        className="absolute text-2xl select-none"
        style={{
          top: "25%",
          left: "12%",
          animation: "sparkle 3s ease-in-out infinite",
          animationDelay: "0.5s",
          opacity: 0.7,
        }}
      >
        ✨
      </span>
      <span
        className="absolute text-xl select-none"
        style={{
          top: "55%",
          right: "12%",
          animation: "sparkle 3.5s ease-in-out infinite",
          animationDelay: "1s",
          opacity: 0.6,
        }}
      >
        ✦
      </span>
      <span
        className="absolute text-lg select-none"
        style={{
          bottom: "40%",
          left: "8%",
          animation: "sparkle 2.8s ease-in-out infinite",
          animationDelay: "2.5s",
          opacity: 0.55,
        }}
      >
        ⋆
      </span>
      <span
        className="absolute text-2xl select-none"
        style={{
          bottom: "35%",
          right: "15%",
          animation: "sparkle 4s ease-in-out infinite",
          animationDelay: "1.8s",
          opacity: 0.5,
        }}
      >
        🌟
      </span>

      {/* Бабочки и цветы */}
      <span
        className="absolute text-xl select-none"
        style={{
          top: "78%",
          left: "15%",
          animation: "wiggle 4s ease-in-out infinite",
          animationDelay: "0.3s",
          opacity: 0.45,
        }}
      >
        🦋
      </span>
      <span
        className="absolute text-lg select-none"
        style={{
          top: "5%",
          right: "25%",
          animation: "float 10s ease-in-out infinite",
          animationDelay: "1.2s",
          opacity: 0.4,
        }}
      >
        🌷
      </span>

      {/* SVG декоративные точки — значения детерминированы по индексу, нет Math.random() */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.15 }}
      >
        {Array.from({ length: 8 }).map((_, i) =>
          Array.from({ length: 6 }).map((_, j) => {
            // Вычисляем стабильные значения на основе позиции (i, j)
            // Math.random() нельзя — даёт разные значения на сервере и клиенте
            const duration = (2 + ((i * 13 + j * 7) % 30) / 10).toFixed(2);
            const delay = (((i * 11 + j * 17) % 40) / 10).toFixed(2);
            return (
              <circle
                key={`${i}-${j}`}
                cx={`${12 + i * 12}%`}
                cy={`${15 + j * 15}%`}
                r="2"
                fill="#f472b6"
                style={{
                  animationName: "sparkle",
                  animationDuration: `${duration}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
