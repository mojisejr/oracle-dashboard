export function GoalSection() {
  const goals = [
    {
      icon: '🌾',
      title: 'ร่วมมือทำผลไม้ไทยคุณภาพสูงส่งขายจีน',
      description: 'Thai-Chinese Partnership'
    },
    {
      icon: '🤝',
      title: 'Thai-Chinese Partnership',
      description: 'คุณนนท์ + Oracle (o) ร่วมมือกัน'
    },
    {
      icon: '🛠️',
      title: 'สร้างเครื่องมือชาวสวนที่ใช้งานได้จริง',
      description: 'Practical tools for real farmers'
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
      
      <div className="max-w-6xl mx-auto relative">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">เป้าหมายของเรา</span>
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            พันธกิจที่เรามุ่งมั่นไปด้วยกัน
          </p>
        </div>
        
        {/* Glass Card */}
        <div className="glass glass-hover rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {goals.map((goal, index) => (
              <div 
                key={index}
                className="text-center md:text-left"
              >
                {/* Icon */}
                <div className="text-5xl mb-4">
                  {goal.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-neutral-800 mb-2">
                  {goal.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-neutral-600">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Divider */}
          <div className="border-t border-white/30 my-8" />
          
          {/* Credit */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-2xl">🛡️</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-neutral-800">
                  สร้างโดย Oracle Ranger (o)
                </p>
                <p className="text-xs text-neutral-600">
                  ร่วมกับคุณนนท์ (Nonthasak Laoluerat)
                </p>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
