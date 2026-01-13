'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { 
  ArrowRight, 
  Users, 
  Sparkles, 
  Shield, 
  Globe,
  MessageCircle,
  TrendingUp,
  Star,
  CheckCircle2,
  Zap,
  Heart,
  BookOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Component đếm số có animation
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <span className="text-3xl lg:text-4xl font-bold text-blue-500">
      {count >= 1000 ? `${Math.floor(count / 1000)}K` : count}{suffix}
    </span>
  );
}

export default function EnhancedLandingPage() {
  const stats = [
    { label: "Người dùng", value: "10000", icon: Users },
    { label: "Bài viết", value: "50000", icon: MessageCircle },
    { label: "Kết nối", value: "100000", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Users,
      title: "Cộng đồng sôi động",
      description: "Kết nối với hàng nghìn người dùng có cùng đam mê và sở thích. Tham gia thảo luận, chia sẻ ý tưởng và xây dựng mạng lưới của bạn.",
      color: "bg-blue-500"
    },
    {
      icon: Sparkles,
      title: "Nội dung chất lượng",
      description: "Khám phá và chia sẻ kiến thức từ cộng đồng chuyên gia. Mỗi ngày đều có những bài viết mới đầy giá trị.",
      color: "bg-blue-600"
    },
    {
      icon: Shield,
      title: "An toàn & Bảo mật",
      description: "Thông tin của bạn được bảo vệ với công nghệ mã hóa hiện đại. Riêng tư và an toàn là ưu tiên hàng đầu.",
      color: "bg-blue-700"
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Chuyên gia Tech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      quote: "KnowHub đã giúp tôi kết nối với rất nhiều người trong ngành. Nền tảng tuyệt vời để học hỏi và chia sẻ!",
      rating: 5
    },
    {
      name: "Trần Thị B",
      role: "Content Creator",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      quote: "Cộng đồng thân thiện, nhiều kiến thức bổ ích. Giao diện đẹp và dễ sử dụng!",
      rating: 5
    },
    {
      name: "Lê Văn C",
      role: "Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      quote: "Tuyệt vời để chia sẻ và học hỏi. Đây là nơi tôi tìm thấy nhiều bạn bè mới!",
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Đăng ký miễn phí",
      description: "Tạo tài khoản chỉ trong 30 giây với email hoặc mạng xã hội"
    },
    {
      step: "02", 
      title: "Chọn chủ đề yêu thích",
      description: "Follow các topics phù hợp với sở thích và chuyên môn của bạn"
    },
    {
      step: "03",
      title: "Bắt đầu kết nối",
      description: "Chia sẻ bài viết, thảo luận và xây dựng network của riêng mình"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Kiểu Notion */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
              <Image src="/assets/knowhub-logo.png" alt="Logo" width={40} height={40} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">KnowHub</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Đăng nhập
            </Link>
            <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              <Link href="/register">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Phần Hero - Layout chia đôi với Illustration */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Pattern nền nhẹ */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#3B82F6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Hình trang trí */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Trái - Nội dung (5 cột) */}
            <div className="lg:col-span-5">
              {/* Huy hiệu */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Nền tảng kết nối tri thức #1</span>
              </div>

              {/* Tiêu đề chính */}
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Kết nối, chia sẻ và{' '}
                <span className="text-blue-500">cùng phát triển</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                KnowHub là nơi cộng đồng gặp gỡ. Chia sẻ kiến thức, khám phá ý tưởng mới 
                và kết nối với những người có cùng đam mê.
              </p>

              {/* Nút hành động */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-12 px-6 text-base font-medium group"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Bắt đầu miễn phí
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-12 px-6 text-base font-medium"
                >
                  <Link href="/explore">Khám phá ngay</Link>
                </Button>
              </div>

              {/* Thống kê */}
              <div className="flex items-center gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <AnimatedCounter value={stat.value} suffix="+" />
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phải - Hình minh họa (7 cột) */}
            <div className="lg:col-span-7 relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-4 lg:p-6 shadow-xl shadow-blue-100/50">
                {/* Hình minh họa chính */}
                <Image
                  src="/assets/thumbnail.png"
                  alt="Community connecting"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
                
                {/* Thẻ nổi */}
                <div className="absolute -left-6 top-1/4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bài viết mới!</p>
                      <p className="text-xs text-gray-500">Vừa xong • 2 phút trước</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">+128 likes</p>
                      <p className="text-xs text-gray-500">Bài viết trending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo đối tác */}
      <section className="py-12 border-y border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-gray-500 mb-8">Được tin tưởng bởi các cộng đồng</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <div className="text-xl font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Community A</div>
            <div className="text-xl font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Tech Group</div>
            <div className="text-xl font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">DevVN</div>
            <div className="text-xl font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">StartupVN</div>
          </div>
        </div>
      </section>

      {/* Cách hoạt động */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Bắt đầu trong 3 bước đơn giản
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tham gia KnowHub chưa bao giờ dễ dàng đến thế
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative text-center p-8">
                {/* Số bước */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>

                {/* Đường kẻ nối */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-blue-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần Tính năng */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Tại sao chọn KnowHub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mọi thứ bạn cần để xây dựng và phát triển cộng đồng của mình
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <Card 
                key={idx}
                className="bg-white border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Đánh giá người dùng */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Cộng đồng nói gì về chúng tôi
            </h2>
            <p className="text-lg text-gray-600">Hàng nghìn người đã tin tưởng và sử dụng KnowHub</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card 
                key={idx}
                className="bg-gray-50 border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kêu gọi hành động cuối */}
      <section className="py-24 bg-blue-500 relative overflow-hidden">
        {/* Phần tử nền */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circles" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Sẵn sàng tham gia cộng đồng?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Hàng nghìn người đang chờ bạn. Đăng ký miễn phí và bắt đầu hành trình của bạn ngay hôm nay.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-gray-50 rounded-lg h-14 px-8 text-lg font-medium group"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Đăng ký miễn phí
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Hoàn toàn miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Bắt đầu ngay lập tức</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chân trang */}
      <footer className="bg-slate-950 text-gray-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-12">
            {/* Cột thương hiệu */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">KnowHub</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Nền tảng kết nối tri thức đáng tin cậy nhất.<br/>
                Chia sẻ với sự tự tin.
              </p>
              {/* Nút tải ứng dụng */}
              <div className="flex gap-3">
                <Link 
                  href="#" 
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-500">Download on</div>
                    <div className="text-xs font-medium text-white">App Store</div>
                  </div>
                </Link>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-500">Get it on</div>
                    <div className="text-xs font-medium text-white">Google Play</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Sản phẩm */}
            <div>
              <h3 className="text-white font-medium mb-4">Products</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/feed" className="hover:text-white transition-colors">Bảng tin</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">Khám phá</Link></li>
                <li><Link href="/topics" className="hover:text-white transition-colors">Chủ đề</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Sự kiện</Link></li>
                <li><Link href="/groups" className="hover:text-white transition-colors">Nhóm</Link></li>
              </ul>
            </div>

            {/* Tài nguyên */}
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">API Docs</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>

            {/* Công ty */}
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/legal" className="hover:text-white transition-colors">Legal</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Cộng đồng */}
            <div>
              <h3 className="text-white font-medium mb-4">Community</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Discord</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Telegram</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Reddit</Link></li>
              </ul>
            </div>
          </div>

          {/* Thanh dưới cùng */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div>© 2026 KnowHub. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation tùy chỉnh */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
      `}</style>
    </div>
  );
}
