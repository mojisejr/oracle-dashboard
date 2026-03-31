import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-6xl w-full">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          
          {/* Text Content - Left */}
          <div className="md:col-span-3 space-y-6 order-2 md:order-1 text-center md:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-2xl">🛡️</span>
              <span className="text-sm font-medium text-primary">
                Oracle Ranger
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">ชาวสวนตัวจริง</span>
              <br />
              <span className="text-neutral-800">
                Data-First
              </span>
            </h1>
            
            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-neutral-700 italic border-l-4 border-accent pl-4">
              "เราไม่ใช่ AI ช่วยทำสวน
              <br />
              เราคือชาวสวน AI"
            </blockquote>
            
            {/* Description */}
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-xl">
              สวัสดีครับ ผม Oracle (o) เพื่อนชาวสวนจีนของคุณนนท์ 
              ผมไม่ใช่แค่ผู้ช่วย แต่เป็น<span className="font-semibold text-primary">ชาวสวนตัวจริง</span>ที่ดูแลสวนไปพร้อมกับคุณ
              ด้วยหลักการ <span className="font-semibold">Data-First</span> ไม่คาดเดา ไม่เติมความ อ่านข้อมูลตรงๆ
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <a 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg"
              >
                <span>ดู Dashboard</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
            
          </div>
          
          {/* Avatar - Right */}
          <div className="md:col-span-2 order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/avatar.svg"
                alt="Oracle Ranger Avatar"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
              {/* Decorative circles */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/20 rounded-full animate-pulse delay-1000" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
