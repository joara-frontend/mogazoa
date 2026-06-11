interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ children, onClick, type = 'button' }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
      {children}
    </button>
  );
}
