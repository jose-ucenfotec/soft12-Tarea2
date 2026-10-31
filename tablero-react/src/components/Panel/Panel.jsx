// Envoltorio con estilo de tarjeta. Lo que va adentro llega por children.
function Panel({ titulo, children }) {
  return (
    <section className="card mb-4">
      <div className="card-header bg-white">
        <h2 className="h5 mb-0">{titulo}</h2>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

export default Panel;