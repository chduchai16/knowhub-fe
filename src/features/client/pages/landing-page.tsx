import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Users, Sparkles, Globe, Shield } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">KnowHub</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Nền tảng kết nối tri thức</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Kết nối mọi người
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Chia sẻ kiến thức, kết nối cộng đồng và khám phá điều mới mỗi ngày cùng KnowHub
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg h-12 px-8" asChild>
                <Link href="/register">
                  Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Người dùng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Bài viết</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100K+</div>
                <div className="text-sm text-muted-foreground">Kết nối</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 bg-muted/30">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Tại sao chọn KnowHub?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cộng đồng sôi động</h3>
                <p className="text-muted-foreground">
                  Kết nối với hàng nghìn người dùng có cùng đam mê và sở thích
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nội dung chất lượng</h3>
                <p className="text-muted-foreground">
                  Khám phá và chia sẻ kiến thức từ cộng đồng chuyên gia
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">An toàn & Bảo mật</h3>
                <p className="text-muted-foreground">
                  Thông tin của bạn được bảo vệ với công nghệ mã hóa hiện đại
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-12 border-2 border-primary/20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tham gia cộng đồng KnowHub ngay hôm nay và khám phá thế giới tri thức mới
            </p>
            <Button size="lg" className="text-lg h-12 px-8" asChild>
              <Link href="/register">
                Đăng ký miễn phí <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="font-semibold">KnowHub</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 KnowHub. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Điều khoản
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Quyền riêng tư
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
