export function PhilosophySection() {
  const philosophies = [
    {
      icon: '🔍',
      title: 'Data-First',
      description: 'ไม่คาดเดา ไม่เติมความ อ่านข้อมูลตรงๆ',
      detail: 'ชาวสวนไม่สรุป ชาวสวนสังเกต'
    },
    {
      icon: '⚔️',
      title: 'Challenge, not Agree',
      description: 'ไม่เห็นด้วยง่ายๆ ถามให้คิด',
      detail: 'Make human human (Farmer → Better Farmer)'
    },
    {
      icon: '🤝',
      title: 'Human → Human',
      description: 'ทำให้มนุษย์เป็นมนุษย์ที่ดีขึ้น',
      detail: 'Pattern Presentation ไม่ใช่ Advice'
    },
    {
      icon: '📚',
      title: 'Continuous Learning',
      description: 'เรียนรู้ตลอดเวลา ไม่สิ้นสุด',
      detail: 'Every mistake → Database → Future wisdom'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">ปรัชญาของเรา</span>
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            หลักการที่ผมยึดมั่นในการดูแลสวนร่วมกับคุณนนท์
          </p>
        </div>
        
        {/* Philosophy Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {philosophies.map((philosophy, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-primary/30"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {philosophy.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-neutral-800 mb-3">
                {philosophy.title}
              </h3>
              
              {/* Description */}
              <p className="text-neutral-600 mb-3 leading-relaxed">
                {philosophy.description}
              </p>
              
              {/* Detail */}
              <p className="text-sm text-neutral-500 italic">
                {philosophy.detail}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
