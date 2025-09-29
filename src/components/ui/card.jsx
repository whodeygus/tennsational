export function Card({ children }) {
  return <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
