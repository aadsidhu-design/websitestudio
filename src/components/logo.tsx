export function Logo() {
  return (
    <div className="flex items-center gap-3" aria-label="Robin Logo">
      <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 22.0002C10.3333 22.0002 14 22.0002 14 18.0002C14 14.0002 8 16.0002 8 10.0002C8 4.00024 18 2.00024 18 2.00024"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 14C8 14 6 14.5 6 16C6 17.5 8 18 8 18"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Robin</h1>
    </div>
  );
}
