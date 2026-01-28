import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRetellAgent } from "@/hooks/useRetellAgent";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Flame, Star, Phone, MessageSquare, Video, Share2, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

// Force refresh - white theme update
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { startCall, stopCall, isCallActive, isAgentSpeaking } = useRetellAgent();
  
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery();

  const { data: organizations } = trpc.organizations.list.useQuery();
  const { data: locationData } = trpc.location.detectChamber.useQuery();

  const shareToSocial = (platform: string) => {
    const shareText = t('home.share.text') + ` ${window.location.href}`;
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTextEncoded = encodeURIComponent(shareText);

    const urls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTextEncoded}`,
      twitter: `https://twitter.com/intent/tweet?text=${shareTextEncoded}`,
      tiktok: `https://www.tiktok.com/upload?caption=${shareTextEncoded}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing URLs
    };

    if (platform === 'instagram') {
      alert('To share on Instagram, take a screenshot and post it to your story!');
      return;
    }

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const openChatGPT = () => {
    window.open('https://chat.openai.com/', '_blank');
  };

  const openZoom = () => {
    window.open('https://zoom.us/start/videomeeting', '_blank');
  };

  const startRetellCall = async () => {
    if (isCallActive) {
      stopCall();
    } else {
      await startCall();
    }
  };

  if (loading || coursesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header - Mobile Optimized */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xs sm:text-base text-white">
              SIA
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-bold text-black">{t('app.title')}</h1>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-black">{user?.totalScore || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <Flame className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-black">{user?.currentStreak || 0}</span>
                </div>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 py-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-black">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4 mb-8 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          {!isAuthenticated ? (
            <Button 
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {language === 'es' ? 'Comenzar Ahora' : 'Get Started Today'}
            </Button>
          ) : (
            <Button 
              onClick={() => courses && courses[0] && (window.location.href = `/course/${courses[0].id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {language === 'es' ? 'Continuar Aprendiendo' : 'Continue Learning'}
            </Button>
          )}
        </div>

        {/* Courses Grid */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-black">
            <Star className="h-6 w-6 text-blue-600" />
            {t('home.courses.title')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {courses?.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <Card className="bg-white border-gray-200 hover:border-blue-600/50 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 h-full">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-semibold">
                        Course {course.order}
                      </Badge>
                      <Badge className="bg-gray-50 text-gray-600 border-gray-100">
                        {course.order <= 2 ? 'Beginner' : course.order <= 4 ? 'Intermediate' : 'Advanced'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-black group-hover:text-blue-600 transition-colors leading-tight">
                      {language === 'es' && course.titleEs ? course.titleEs : course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {language === 'es' && course.descriptionEs ? course.descriptionEs : course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                      {t('home.courses.start')}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Your Local Chamber */}
        {locationData?.chamber && (
          <section className="mb-12">
            <div className="text-center mb-6">
              <Badge className="bg-blue-600 text-white mb-2">
                📍 {language === 'es' ? 'Tu Cámara Local' : 'Your Local Chamber'}
              </Badge>
              <h3 className="text-2xl font-bold text-black">
                {language === 'es' ? '¡Únete a tu Cámara de Comercio!' : 'Join Your Chamber of Commerce!'}
              </h3>
              {locationData.location?.city && (
                <p className="text-sm text-gray-500 mt-2">
                  {language === 'es' ? 'Detectado desde' : 'Detected from'}: {locationData.location.city}, {locationData.location.state}
                </p>
              )}
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white border-2 border-blue-600 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {locationData.chamber.logoUrl && (
                      <img src={locationData.chamber.logoUrl} alt={locationData.chamber.name} className="h-20 mx-auto mb-4" />
                    )}
                    <h4 className="text-2xl font-bold mb-2 text-black">
                      {language === 'es' && locationData.chamber.nameEs ? locationData.chamber.nameEs : locationData.chamber.name}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'es' && locationData.chamber.descriptionEs ? locationData.chamber.descriptionEs : locationData.chamber.description}
                    </p>
                    {locationData.chamber?.distance && (
                      <p className="text-sm text-blue-600 mb-4">
                        📍 {Math.round(locationData.chamber.distance)} {language === 'es' ? 'millas de distancia' : 'miles away'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {locationData.chamber?.signupUrl && (
                      <Button
                        onClick={() => window.open(locationData.chamber?.signupUrl!, '_blank')}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        {t('home.organizations.join')} {language === 'es' ? 'Ahora' : 'Now'} →
                      </Button>
                    )}
                    {locationData.chamber?.website && (
                      <Button
                        onClick={() => window.open(locationData.chamber?.website!, '_blank')}
                        variant="outline"
                        size="lg"
                        className="border-gray-200 text-black hover:bg-gray-50"
                      >
                        {t('home.organizations.visit')}
                      </Button>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {(locationData.chamber?.linkedinUrl || locationData.chamber?.facebookUrl || locationData.chamber?.twitterUrl || locationData.chamber?.instagramUrl || locationData.chamber?.tiktokUrl) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500 text-center mb-3">
                        {language === 'es' ? 'Conecta en Redes Sociales' : 'Connect on Social Media'}
                      </p>
                      <div className="flex justify-center gap-3 flex-wrap">
                        {locationData.chamber?.linkedinUrl && (
                          <Button
                            onClick={() => window.open(locationData.chamber?.linkedinUrl!, '_blank')}
                            size="sm"
                            className="bg-[#0077b5] hover:bg-[#006399] text-white"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        )}
                        {locationData.chamber?.facebookUrl && (
                          <Button
                            onClick={() => window.open(locationData.chamber?.facebookUrl!, '_blank')}
                            size="sm"
                            className="bg-[#1877f2] hover:bg-[#166fe5] text-white"
                            title="Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </Button>
                        )}
                        {locationData.chamber?.twitterUrl && (
                          <Button
                            onClick={() => window.open(locationData.chamber?.twitterUrl!, '_blank')}
                            size="sm"
                            className="bg-black hover:bg-gray-900 text-white"
                            title="X (Twitter)"
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                        )}
                        {locationData.chamber?.instagramUrl && (
                          <Button
                            onClick={() => window.open(locationData.chamber?.instagramUrl!, '_blank')}
                            size="sm"
                            className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white"
                            title="Instagram"
                          >
                            <Instagram className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Revenue Share Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-100 shadow-xl bg-blue-50/30">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-extrabold mb-4 text-black">
                    {language === 'es' ? 'Asociación Mutuamente Beneficiosa' : 'Mutually Beneficial Partnership'}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {language === 'es' ? 'Genera ingresos para tu Cámara mientras entregas educación de IA de clase mundial a tus miembros.' : 'Generate revenue for your Chamber while delivering world-class AI education to your members.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100">
                    <div className="text-4xl font-bold text-blue-600 mb-2">15%</div>
                    <h3 className="text-xl font-bold mb-3 text-black">{t('home.partnership.revenue.title')}</h3>
                    <p className="text-gray-600">{t('home.partnership.revenue.desc')}</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100">
                    <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
                    <h3 className="text-xl font-bold mb-3 text-black">{t('home.partnership.discount.title')}</h3>
                    <p className="text-gray-600">{t('home.partnership.discount.desc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Other Partner Chambers */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center text-black">{t('home.organizations.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {organizations?.map((org) => (
              <Card key={org.id} className="bg-white border-gray-200 hover:border-blue-600/30 transition-all shadow-sm hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-black">
                    {language === 'es' && org.nameEs ? org.nameEs : org.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {language === 'es' && org.descriptionEs ? org.descriptionEs : org.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {org.signupUrl && (
                      <Button
                        onClick={() => window.open(org.signupUrl!, '_blank')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t('home.organizations.join')}
                      </Button>
                    )}
                    {org.website && (
                      <Button
                        onClick={() => window.open(org.website!, '_blank')}
                        variant="outline"
                        className="w-full border-gray-200 text-black hover:bg-gray-50"
                      >
                        {t('home.organizations.visit')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Sharing Section */}
        <section className="text-center py-12 bg-gray-50 rounded-3xl mb-16">
          <h3 className="text-2xl font-bold mb-4 text-black">{t('home.share.title')}</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.share.desc')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={() => shareToSocial('linkedin')}
              className="bg-[#0077b5] hover:bg-[#006399] text-white px-6"
            >
              <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
            </Button>
            <Button
              onClick={() => shareToSocial('facebook')}
              className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-6"
            >
              <Facebook className="mr-2 h-5 w-5" /> Facebook
            </Button>
            <Button
              onClick={() => shareToSocial('twitter')}
              className="bg-black hover:bg-gray-900 text-white px-6"
            >
              <Twitter className="mr-2 h-5 w-5" /> X
            </Button>
            <Button
              onClick={() => shareToSocial('instagram')}
              className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white px-6"
            >
              <Instagram className="mr-2 h-5 w-5" /> Instagram
            </Button>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons - Mobile Optimized */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Button
          onClick={startRetellCall}
          className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
            isCallActive ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          title={isCallActive ? 'End Call' : 'Talk to AI Coach'}
        >
          {isCallActive ? <Phone className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
        
        <Button
          onClick={openChatGPT}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl transition-all duration-300"
          title="Open ChatGPT"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5153-4.9108 6.0462 6.0462 0 0 0-4.7471-3.124 5.9847 5.9847 0 0 0-7.6927-1.0659 6.0462 6.0462 0 0 0-3.3566 4.5871 5.9847 5.9847 0 0 0-1.0659 7.6927 6.0462 6.0462 0 0 0 3.124 4.7471 5.9847 5.9847 0 0 0 4.9108.5153 6.0462 6.0462 0 0 0 3.3566-4.5871 5.9847 5.9847 0 0 0 1.0659-7.6927 6.0462 6.0462 0 0 0-3.124-4.7471zM18.2551 15.5562a3.7495 3.7495 0 1 1-5.2973-5.2973 3.7495 3.7495 0 0 1 5.2973 5.2973z"/>
          </svg>
        </Button>

        <Button
          onClick={openZoom}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-2xl transition-all duration-300"
          title="Start Zoom Meeting"
        >
          <Video className="h-6 w-6" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              SIA
            </div>
            <span className="text-xl font-bold text-black">SIA AI Academy</span>
          </div>
          <p className="text-gray-500 mb-8">
            © 2026 Sudden Impact Agency. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
