const MenuItem = (p: { children: React.ReactNode; onClick: () => void }) => {
  return (
    <div
      onClick={p.onClick}
      className="px-4 py-3 hover:bg-neutral-100 transition"
    >
      {p.children}
    </div>
  );
};

export default MenuItem;
