export function Logo() {
  return (
    <div className="flex items-center gap-3" aria-label="AnimAI Studio Logo">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L9.92955 8.07045L3.8591 10.1409L7.92955 14.0704L6.92955 20.1409L12 17.0704L17.0704 20.1409L16.0704 14.0704L20.1409 10.1409L14.0704 8.07045L12 2Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12L10.9647 14.0704L8.89425 15.1057L10.9647 16.1409L12 18.2113L13.0353 16.1409L15.1057 15.1057L13.0353 14.0704L12 12Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">AnimaForge Studio</h1>
    </div>
  );
}
