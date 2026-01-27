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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Mobile Optimized */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-xs sm:text-base text-primary-foreground">
              SIA
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-bold">{t('app.title')}</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-secondary-foreground">{user?.totalScore || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                  <Flame className="h-4 w-4 text-chart-4" />
                  <span className="text-sm font-semibold text-secondary-foreground">{user?.currentStreak || 0}</span>
                </div>
                {/* Profile button removed per user request */}
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-[#ff006e] to-[#00d9ff] hover:opacity-90"
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
        {/* Hero Section - FirstMovers Inspired */}
        <div className="text-center mb-16 py-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('home.hero.title')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 mb-8 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          {!isAuthenticated ? (
            <Button 
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {language === 'es' ? 'Comenzar Ahora' : 'Get Started Today'}
            </Button>
          ) : (
            <Button 
              onClick={() => courses && courses[0] && (window.location.href = `/course/${courses[0].id}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {language === 'es' ? 'Continuar Aprendiendo' : 'Continue Learning'}
            </Button>
          )}
        </div>

        {/* Courses Grid - Mobile Optimized */}
        <section className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            {t('home.courses.title')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {courses?.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 h-full">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                        Course {course.order}
                      </Badge>
                      <Badge className="bg-accent/10 text-accent border-accent/20">
                        {course.order <= 2 ? 'Beginner' : course.order <= 4 ? 'Intermediate' : 'Advanced'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors leading-tight">
                      {language === 'es' && course.titleEs ? course.titleEs : course.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      {language === 'es' && course.descriptionEs ? course.descriptionEs : course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                      {t('home.courses.start')}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Your Local Chamber - Detected by IP */}
        {locationData?.chamber && (
          <section className="mb-12">
            <div className="text-center mb-6">
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground mb-2">
                📍 {language === 'es' ? 'Tu Cámara Local' : 'Your Local Chamber'}
              </Badge>
              <h3 className="text-2xl font-bold">
                {language === 'es' ? '¡Únete a tu Cámara de Comercio!' : 'Join Your Chamber of Commerce!'}
              </h3>
              {locationData.location?.city && (
                <p className="text-sm text-gray-400 mt-2">
                  {language === 'es' ? 'Detectado desde' : 'Detected from'}: {locationData.location.city}, {locationData.location.state}
                </p>
              )}
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-card to-secondary border-2 border-primary shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {locationData.chamber.logoUrl && (
                      <img src={locationData.chamber.logoUrl} alt={locationData.chamber.name} className="h-20 mx-auto mb-4" />
                    )}
                    <h4 className="text-2xl font-bold mb-2">
                      {language === 'es' && locationData.chamber.nameEs ? locationData.chamber.nameEs : locationData.chamber.name}
                    </h4>
                    <p className="text-card-foreground mb-4">
                      {language === 'es' && locationData.chamber.descriptionEs ? locationData.chamber.descriptionEs : locationData.chamber.description}
                    </p>
                    {locationData.chamber?.distance && (
                      <p className="text-sm text-accent mb-4">
                        📍 {Math.round(locationData.chamber.distance)} {language === 'es' ? 'millas de distancia' : 'miles away'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {locationData.chamber?.signupUrl && (
                      <Button
                        onClick={() => window.open(locationData.chamber?.signupUrl!, '_blank')}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        {t('home.organizations.join')} {language === 'es' ? 'Ahora' : 'Now'} →
                      </Button>
                    )}
                    {locationData.chamber?.website && (
                      <Button
                        onClick={() => window.open(locationData.chamber?.website!, '_blank')}
                        variant="outline"
                        size="lg"
                        className="border-border text-card-foreground hover:bg-secondary"
                      >
                        {t('home.organizations.visit')}
                      </Button>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {(locationData.chamber?.linkedinUrl || locationData.chamber?.facebookUrl || locationData.chamber?.twitterUrl || locationData.chamber?.instagramUrl || locationData.chamber?.tiktokUrl) && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <p className="text-sm text-gray-400 text-center mb-3">
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
                        {locationData.chamber?.tiktokUrl && (
                          <Button
                            onClick={() => window.open(locationData.chamber?.tiktokUrl!, '_blank')}
                            size="sm"
                            className="bg-black hover:bg-gray-900 text-white border border-[#00f2ea]"
                            title="TikTok"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
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
            <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {language === 'es' ? 'Asociación Mutuamente Beneficiosa' : 'Mutually Beneficial Partnership'}
                    </span>
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {language === 'es'
                      ? 'Genere ingresos para su Cámara mientras ofrece educación en IA de clase mundial a sus miembros.'
                      : 'Generate revenue for your Chamber while delivering world-class AI education to your members.'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-background/50 p-6 rounded-xl border-2 border-primary/20">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-primary mb-2">15%</div>
                      <h3 className="text-xl font-bold mb-3">
                        {language === 'es' ? 'Participación en Ingresos' : 'Revenue Share'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es'
                          ? 'Gane el 15% de los ingresos netos recurrentes de suscripción generados por los miembros de su Cámara que se inscriban en servicios premium de SIA.'
                          : 'Earn 15% of net recurring subscription revenue generated from your Chamber members who enroll in premium SIA services.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-background/50 p-6 rounded-xl border-2 border-accent/20">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-accent mb-2">50%</div>
                      <h3 className="text-xl font-bold mb-3">
                        {language === 'es' ? 'Descuento para la Cámara' : 'Chamber Discount'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es'
                          ? 'Su Cámara recibe un 50% de descuento en todos los servicios comprados directamente durante la duración del acuerdo.'
                          : 'Your Chamber receives a 50% discount on all services purchased directly for the duration of the agreement.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/partnership">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-xl font-bold shadow-xl">
                      {language === 'es' ? 'Ver Detalles Completos' : 'View Full Details'} →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Other Partner Chambers */}
        {organizations && organizations.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">{language === 'es' ? 'Otras Cámaras Asociadas' : 'Other Partner Chambers'}</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {organizations
                .filter(org => org.id !== locationData?.chamber?.id)
                .slice(0, 6)
                .map((org) => (
                <Card key={org.id} className="bg-card border-border hover:border-accent transition-all hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Top: Organization Name */}
                    <div className="text-center mb-4">
                      {org.logoUrl && (
                        <img src={org.logoUrl} alt={org.name} className="h-16 mx-auto mb-3" />
                      )}
                      {org.signupUrl && (
                        <Button
                          onClick={() => window.open(org.signupUrl!, '_blank')}
                          size="sm"
                          className="bg-primary text-primary-foreground hover:opacity-90"
                        >
                          {t('home.organizations.join')} {language === 'es' && org.nameEs ? org.nameEs : org.name}
                        </Button>
                      )}
                    </div>

                    {/* Middle: Description */}
                    <div className="flex-grow text-center mb-4">
                      <p className="text-sm text-muted-foreground">{language === 'es' && org.descriptionEs ? org.descriptionEs : org.description}</p>
                      {org.memberCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">{org.memberCount} {t('home.organizations.members')}</p>
                      )}
                    </div>

                    {/* Bottom: Visit Website Button */}
                    <div className="text-center mt-auto">
                      {org.website && (
                        <Button
                          onClick={() => window.open(org.website!, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-border text-card-foreground hover:bg-secondary"
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
        )}

        {/* Social Sharing */}
        <section className="text-center">
          <Button
            onClick={() => setShowShareMenu(!showShareMenu)}
            variant="outline"
            className="border-[#ff006e] text-[#ff006e] hover:bg-[#ff006e] hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t('home.share.title')}
          </Button>

          {showShareMenu && (
            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              <Button onClick={() => shareToSocial('linkedin')} className="bg-[#0077b5] hover:bg-[#006399]">
                {t('share.linkedin')}
              </Button>
              <Button onClick={() => shareToSocial('facebook')} className="bg-[#1877f2] hover:bg-[#166fe5]">
                {t('share.facebook')}
              </Button>
              <Button onClick={() => shareToSocial('twitter')} className="bg-[#1da1f2] hover:bg-[#1a91da]">
                {t('share.twitter')}
              </Button>
              <Button onClick={() => shareToSocial('tiktok')} className="bg-black hover:bg-gray-900">
                {t('share.tiktok')}
              </Button>
              <Button onClick={() => shareToSocial('instagram')} className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90">
                {t('share.instagram')}
              </Button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800 text-center">
          <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
            <Video className="h-4 w-4 text-[#ff006e]" />
            <a 
              href="https://docs.google.com/videos/d/18ya6FWoDUtOi640czhYPJ_S91BcXxrIb7rZxa6Ys6os/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff006e] transition-colors"
            >
              {language === 'es' ? 'Ver Video de Introducción' : 'Watch Introduction Video'}
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            © 2024 SIA AI Academy. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </footer>
      </main>

      {/* Action Buttons - Smaller & Mobile Optimized */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <Button
          onClick={startRetellCall}
          size="sm"
          className={`shadow-lg flex items-center gap-1.5 px-3 py-2 text-sm ${
            isCallActive 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-[#ff006e] hover:bg-[#e6005e]'
          }`}
        >
          <Phone className={`h-4 w-4 ${isAgentSpeaking ? 'animate-bounce' : ''}`} />
          <span className="font-medium">
            {isCallActive 
              ? (language === 'es' ? 'Finalizar' : 'End Call')
              : (language === 'es' ? 'Coach' : 'AI Coach')
            }
          </span>
        </Button>
        
        <Button
          onClick={openChatGPT}
          size="sm"
          className="bg-[#00d9ff] hover:bg-[#00c2e6] shadow-lg flex items-center gap-1.5 px-3 py-2 text-sm text-black"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">ChatGPT</span>
        </Button>
        
        <Button
          onClick={openZoom}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center gap-1.5 px-3 py-2 text-sm"
        >
          <Video className="h-4 w-4" />
          <span className="font-medium">{language === 'es' ? 'Reunión' : 'Meeting'}</span>
        </Button>
      </div>
    </div>
  );
}
