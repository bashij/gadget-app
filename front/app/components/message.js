export default function Message({ message, status }) {
  return (
    <ul className={`alert alert-${status}`}>
      {message.map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  )
}