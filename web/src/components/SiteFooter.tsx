export default function SiteFooter() {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Shoply — Demo for teaching
      </div>
    </footer>
  );
}