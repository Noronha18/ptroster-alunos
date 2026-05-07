export function CardWorkout({ workout }) {
  if (!workout) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-ios-border mb-4 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-block px-3 py-1 bg-ios-gray text-ios-text-secondary text-[10px] font-bold rounded-full mb-2 uppercase tracking-widest">
            {workout.block_name || 'Treino do Dia'}
          </span>
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{workout.title}</h3>
        </div>
        <div className="bg-ios-gray p-2 rounded-2xl text-center min-w-[64px]">
          <span className="block text-[10px] text-ios-text-secondary font-bold uppercase">Séries</span>
          <span className="block text-xl font-black text-ios-blue">{workout.exercises?.length || 0}</span>
        </div>
      </div>

      <div className="space-y-3">
        {workout.exercises?.map((ex, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-ios-border shadow-sm active:bg-ios-gray transition-colors">
            <div className="w-12 h-12 bg-ios-gray rounded-2xl flex items-center justify-center font-black text-ios-text-secondary">
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg leading-tight">{ex.name}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-sm text-ios-text-secondary font-medium bg-ios-gray px-2 py-0.5 rounded-md">
                  {ex.series}x{ex.reps}
                </span>
                <span className="text-sm text-ios-text-secondary font-medium bg-ios-gray px-2 py-0.5 rounded-md">
                  {ex.load}kg
                </span>
              </div>
            </div>
            <div className="text-xs font-black text-ios-blue bg-blue-50 px-3 py-2 rounded-xl">
              {ex.rest}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
