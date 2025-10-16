export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-2 text-lg font-semibold">No encontrado</h1>
      <p className="text-sm opacity-80">La ruta solicitada no existe.</p>
      <a href="/" className="text-sm underline mt-2 inline-block">Volver al inicio</a>
    </div>
  );
}
