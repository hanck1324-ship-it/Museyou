import { Heart, Lightbulb, Sparkles, Music, Users, Theater, ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/buttons/button";
import { MuseYouLogo } from "./MuseYouLogo";

interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  const missions = [
    {
      icon: Heart,
      iconColor: "text-pink-500",
      bgGradient: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-200",
      glowColor: "shadow-pink-500/20",
      title: "LOVE",
      titleColor: "text-pink-600",
      description: "마음이 모여 사랑으로 가득 찬 도시 서울",
      detailDescription: "문화예술을 함께 즐기며 특별한 인연을 만나보세요",
      emoji: "💕",
    },
    {
      icon: Lightbulb,
      iconColor: "text-amber-500",
      bgGradient: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-200",
      glowColor: "shadow-amber-500/20",
      title: "INSPIRE",
      titleColor: "text-amber-600",
      description: "다채롭고 새로운 경험을 주는 도시 서울",
      detailDescription: "매일 새로운 공연과 전시로 영감을 받으세요",
      emoji: "💡",
    },
    {
      icon: Sparkles,
      iconColor: "text-blue-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-200",
      glowColor: "shadow-blue-500/20",
      title: "FUN",
      titleColor: "text-blue-600",
      description: "즐겁고 매력으로 가득 찬 매력 도시 서울",
      detailDescription: "청년들의 데이트를 더욱 즐겁게 만들어드립니다",
      emoji: "✨",
    },
  ];

  const features = [
    {
      icon: Music,
      title: "서울시 문화예술 공연",
      description: "클래식, 연극, 뮤지컬, 전시 등 다양한 공연 정보를 한눈에",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users,
      title: "문화 파트너 매칭",
      description: "공연을 함께 즐길 이상형을 찾고 특별한 데이트를 시작하세요",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Theater,
      title: "문화공구",
      description: "함께 모여 문화예술을 즐기는 단체 관람 프로그램. 단체 할인 혜택을 받을 수 있어요",
      gradient: "from-purple-500 to-indigo-500",
    },
  ];

  const stats = [
    { icon: Calendar, value: "100+", label: "진행중인 공연" },
    { icon: Users, value: "1,000+", label: "활동 중인 회원" },
    { icon: MapPin, value: "25개", label: "서울 전 자치구" },
    { icon: Star, value: "4.8", label: "평균 만족도" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 lg:space-y-12"
        >
          {/* Logo */}
          <MuseYouLogo size="lg" />

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              당신의 뮤즈를 찾아, 문화예술과 함께하는
              <br />
              특별한 데이트 플랫폼
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button
              size="lg"
              onClick={onStart}
              className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 hover:from-emerald-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 text-lg group"
            >
              지금 시작하기
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission Cards */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <h2 className="text-center text-transparent bg-gradient-to-r from-pink-600 via-amber-600 to-blue-600 bg-clip-text mb-8 lg:mb-12">
            우리의 미션
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <motion.div
                  key={mission.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.15, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className={`
                    group relative overflow-hidden rounded-2xl lg:rounded-3xl
                    backdrop-blur-xl bg-gradient-to-br ${mission.bgGradient}
                    border ${mission.borderColor} shadow-xl hover:shadow-2xl ${mission.glowColor}
                    p-8 lg:p-10 transition-all duration-300
                  `}
                >
                  {/* Decorative glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative space-y-4 lg:space-y-5">
                    {/* Icon only */}
                    <div className="flex items-center justify-center">
                      <div className={`
                        p-4 lg:p-5 rounded-2xl backdrop-blur-sm bg-white/70
                        border ${mission.borderColor} shadow-lg
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <Icon className={`size-8 lg:size-10 ${mission.iconColor}`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-center ${mission.titleColor} text-2xl lg:text-3xl tracking-wide`}>
                      {mission.title}
                    </h3>

                    {/* Description */}
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {mission.description}
                    </p>

                    {/* Detail Description */}
                    <p className="text-center text-sm text-muted-foreground/80 italic">
                      {mission.detailDescription}
                    </p>
                  </div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h2 className="text-center text-transparent bg-gradient-to-r from-emerald-600 via-purple-600 to-pink-600 bg-clip-text mb-8 lg:mb-12">
            주요 기능
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/60 border border-white/40 shadow-xl hover:shadow-2xl p-8 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative space-y-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/70 via-purple-50/50 to-pink-50/50 border border-white/40 shadow-2xl p-8 lg:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-center text-transparent bg-gradient-to-r from-emerald-600 via-purple-600 to-pink-600 bg-clip-text mb-10 lg:mb-16">
              Muse You와 함께하세요
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
                    className="text-center space-y-3"
                  >
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 via-purple-500/10 to-pink-500/10 border border-purple-200/50">
                      <Icon className="size-6 text-purple-600" />
                    </div>
                    <div className="text-3xl lg:text-4xl bg-gradient-to-r from-emerald-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                onClick={onStart}
                className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-500 hover:from-emerald-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 group"
              >
                문화예술 데이트 시작하기
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Muse You. 당신의 뮤즈와 함께 문화예술을 즐기세요.</p>
      </footer>
    </div>
  );
}