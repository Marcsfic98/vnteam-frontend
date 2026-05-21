interface SequenceProps {
  count: number;
}

export default function Sequence({ count }: SequenceProps) {
  return (
    <div className="w-full h-20 bg-white border  border-slate-100 shadow-sm rounded-2xl flex items-center justify-center px-4">
      <div className="flex flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Sequência
        </span>
        <h4 className="text-lg font-black text-slate-800 mt-0.5">
          {count} {count === 1 ? "Dia" : "Dias"}
        </h4>
      </div>
    </div>
  );
}
