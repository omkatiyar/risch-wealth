export default function QBox({ num, question, answer }) {
  return (
    <div className="q-box">
      <div className="q-num"><span>{num}.</span> {question.prompt}</div>
      <ul className="q-opts">
        {question.options.map((opt) => {
          const isSel = answer && answer.label === opt.label;
          return (
            <li className={isSel ? 'sel' : ''} key={opt.label}>
              <span className="dot"></span><span>{opt.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
