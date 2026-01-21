import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Flame, Star, Phone, MessageSquare, Video, Share2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery();

  const { data: organizations } = trpc.organizations.list.useQuery();

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

  const startRetellCall = () => {
    // TODO: Implement Retell AI call
    alert('Retell AI voice call will be integrated here. Please add your RETELL_API_KEY and RETELL_AGENT_ID to environment variables.');
  };

  if (loading || coursesLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#ff006e]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff006e] to-[#00d9ff] rounded-lg flex items-center justify-center font-bold">
              SIA
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('app.title')}</h1>
              <p className="text-xs text-gray-400">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg">
                  <Trophy className="h-4 w-4 text-[#ff006e]" />
                  <span className="text-sm font-semibold">{user?.totalScore || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-semibold">{user?.currentStreak || 0}</span>
                </div>
                <Button variant="outline" size="sm" className="text-white border-gray-700">
                  {user?.name || 'Profile'}
                </Button>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ff006e] to-[#00d9ff] bg-clip-text text-transparent">
            {t('home.hero.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
        </div>

        {/* Courses Grid */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-[#ff006e]" />
            {t('home.courses.title')}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses?.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <Card className="bg-gray-900 border-gray-800 hover:border-[#ff006e] transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[#00d9ff] border-[#00d9ff]">
                        Course {course.order}
                      </Badge>
                    </div>
                    <CardTitle className="text-white group-hover:text-[#ff006e] transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r from-[#ff006e] to-[#00d9ff] hover:opacity-90">
                      {t('home.courses.start')}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Partner Organizations */}
        {organizations && organizations.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">{t('home.organizations.title')}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="bg-gray-900 border-gray-800 hover:border-[#00d9ff] transition-all">
                  <CardContent className="p-6 text-center">
                    {org.logoUrl && (
                      <img src={org.logoUrl} alt={org.name} className="h-16 mx-auto mb-4" />
                    )}
                    <h4 className="text-lg font-bold mb-2">{org.name}</h4>
                    <p className="text-sm text-gray-400 mb-4">{org.description}</p>
                    <div className="flex gap-2 justify-center">
                      {org.website && (
                        <Button
                          onClick={() => window.open(org.website!, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-white"
                        >
                          {t('home.organizations.visit')}
                        </Button>
                      )}
                      {org.signupUrl && (
                        <Button
                          onClick={() => window.open(org.signupUrl!, '_blank')}
                          size="sm"
                          style={{ backgroundColor: org.primaryColor || '#ff006e' }}
                          className="hover:opacity-90"
                        >
                          {t('home.organizations.join')} {org.name}
                        </Button>
                      )}
                    </div>
                    {org.memberCount > 0 && (
                      <p className="text-xs text-gray-500 mt-3">{org.memberCount} {t('home.organizations.members')}</p>
                    )}
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
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Button
          onClick={startRetellCall}
          size="lg"
          className="rounded-full w-14 h-14 bg-[#ff006e] hover:bg-[#e6005f] shadow-lg"
          title={t('voice.callButton')}
        >
          <Phone className="h-6 w-6" />
        </Button>
        
        <Button
          onClick={openChatGPT}
          size="lg"
          className="rounded-full w-14 h-14 bg-[#00d9ff] hover:bg-[#00c2e6] shadow-lg"
          title={t('tools.chatgpt')}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        
        <Button
          onClick={openZoom}
          size="lg"
          className="rounded-full w-14 h-14 bg-[#2d8cff] hover:bg-[#2579e6] shadow-lg"
          title={t('tools.zoom')}
        >
          <Video className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
